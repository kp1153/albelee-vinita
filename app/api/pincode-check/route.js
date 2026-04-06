import { NextResponse } from 'next/server';

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
  const pincode = searchParams.get('pincode');
  const weight = searchParams.get('weight') || '0.5';

  if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  try {
    const token = await getShiprocketToken();

    const params = new URLSearchParams({
      pickup_postcode: process.env.SHIPROCKET_PICKUP_PINCODE || '110001',
      delivery_postcode: pincode,
      weight,
      cod: '1',
    });

    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!data?.data?.available_courier_companies?.length) {
      return NextResponse.json({ serviceable: false });
    }

    const couriers = data.data.available_courier_companies;
    const fastest = couriers.sort((a, b) => a.estimated_delivery_days - b.estimated_delivery_days)[0];

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (fastest.estimated_delivery_days || 5));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${days[deliveryDate.getDay()]}, ${deliveryDate.getDate()} ${months[deliveryDate.getMonth()]} ${deliveryDate.getFullYear()}`;

    return NextResponse.json({
      serviceable: true,
      delivery_date: dateStr,
      courier_name: fastest.courier_name,
      estimated_days: fastest.estimated_delivery_days,
      cod: fastest.cod === 1,
    });
  } catch (error) {
    console.error('Pincode check error:', error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }
}