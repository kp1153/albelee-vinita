import Link from 'next/link';
import client from '@/lib/db';

async function getOrder(orderId) {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [orderId],
    });
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    return null;
  }
}

async function getOrderItems(orderId) {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM order_items WHERE order_id = ?',
      args: [orderId],
    });
    return result.rows;
  } catch (error) {
    return [];
  }
}

export default async function OrderSuccessPage({ params }) {
  const resolvedParams = await params;
  const order = await getOrder(resolvedParams.slug);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Order not found</h1>
        <Link href="/" className="text-[#D85A8C] hover:underline">Go back to Home</Link>
      </div>
    );
  }

  const items = await getOrderItems(order.id);
  const customer = JSON.parse(order.notes || '{}');

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl border border-[#F6C9D6] p-8">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-serif font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Order Number: <span className="font-semibold">#{order.order_number}</span></p>
        </div>

        <div className="border-t border-b border-[#F6C9D6] py-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Address:</strong> {customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-700 border-b pb-2">
                <span>{item.product_name} x {item.quantity}</span>
                <span className="font-semibold">₹{item.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF7F8] border border-[#F6C9D6] p-4 rounded-xl mb-6">
          <div className="flex justify-between text-xl font-bold">
            <span>Total Amount:</span>
            <span className="text-amber-600">₹{order.total_amount}</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">हम जल्द ही आपसे संपर्क करेंगे। धन्यवाद!</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 px-6 py-2 rounded-xl transition">
              Go Home
            </Link>
            <Link href="/collections/earrings" className="border border-[#F6C9D6] text-stone-800 px-6 py-2 rounded-xl hover:bg-[#FFF7F8] transition">
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
