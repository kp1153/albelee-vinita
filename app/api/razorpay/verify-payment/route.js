import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { sendOrderEmail } from '@/lib/email';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function getShiprocketToken() {
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  return data.token;
}

async function createShiprocketOrder(token, orderDetails, items, orderId) {
  const { name, email, phone, address, city, state, pincode } = orderDetails;

  const orderItems = items.map((item) => ({
    name: item.name,
    sku: `SKU-${item.id}`,
    units: item.quantity,
    selling_price: item.price,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: `ALBELEE-${orderId}`,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: 'Primary',
      billing_customer_name: name,
      billing_last_name: '',
      billing_address: address,
      billing_city: city || 'N/A',
      billing_pincode: pincode || '000000',
      billing_state: state || 'N/A',
      billing_country: 'India',
      billing_email: email || '',
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: 'Prepaid',
      sub_total: totalAmount,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    }),
  });

  const data = await res.json();
  return data;
}

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
    } = await req.json();

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `ALB-${Date.now()}`;

    const notes = JSON.stringify({
      name: customerDetails.name,
      email: customerDetails.email || '',
      phone: customerDetails.phone,
      address: customerDetails.address,
      city: customerDetails.city || '',
      state: customerDetails.state || '',
      pincode: customerDetails.pincode || '',
      razorpay_payment_id: razorpay_payment_id,
    });

    const result = await turso.execute({
      sql: `INSERT INTO orders (order_number, total_amount, status, payment_method, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [orderNumber, totalAmount, 'pending', 'prepaid', 'paid', notes],
    });

    const orderId = Number(result.lastInsertRowid);

    for (const item of items) {
      await turso.execute({
        sql: `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, item.id, item.name, item.price, item.quantity, item.price * item.quantity],
      });
    }

    try {
      const token = await getShiprocketToken();
      const shiprocketOrder = await createShiprocketOrder(token, customerDetails, items, orderId);
      console.log('Shiprocket order created:', shiprocketOrder);
    } catch (shipErr) {
      console.error('Shiprocket error:', shipErr);
    }

    await sendOrderEmail({ customerDetails, items, totalAmount, orderId });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}