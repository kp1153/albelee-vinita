import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');
  const phone = searchParams.get('phone');

  if (!orderId && !phone) {
    return NextResponse.json({ error: 'Order ID or Phone required' }, { status: 400 });
  }

  try {
    let dbOrder = null;

    if (orderId) {
      const result = await turso.execute({
        sql: 'SELECT * FROM orders WHERE id = ?',
        args: [orderId],
      });
      dbOrder = result.rows[0] || null;
    } else if (phone) {
      const result = await turso.execute({
        sql: 'SELECT * FROM orders WHERE user_phone = ? ORDER BY created_at DESC LIMIT 1',
        args: [phone],
      });
      dbOrder = result.rows[0] || null;
    }

    if (!dbOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const shiprocketId = `ALBELEE-${dbOrder.id}`;
    const token = await getShiprocketToken();

    const trackRes = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${shiprocketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const trackData = await trackRes.json();

    return NextResponse.json({
      order_id: dbOrder.id,
      customer_name: dbOrder.user_name,
      total_amount: dbOrder.total_amount,
      status: trackData?.data?.status || dbOrder.status,
      awb_code: trackData?.data?.shipments?.awb_code || '',
      courier_name: trackData?.data?.shipments?.courier_name || '',
      etd: trackData?.data?.shipments?.etd || '',
      tracking_url: trackData?.data?.shipments?.tracking_url || '',
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}