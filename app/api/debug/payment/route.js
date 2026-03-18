import Razorpay from 'razorpay';

export async function GET() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: 100,
      currency: 'INR',
      receipt: 'test_receipt',
    });

    return Response.json({ success: true, order });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
