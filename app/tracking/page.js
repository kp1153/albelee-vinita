'use client';
import { useState } from 'react';

export default function Tracking() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!orderId.trim() && !phone.trim()) {
      setError('Please enter Order ID or Phone Number');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const query = orderId.trim()
        ? `orderId=${orderId.trim()}`
        : `phone=${phone.trim()}`;

      const res = await fetch(`/api/tracking?${query}`);
      const data = await res.json();

      if (data.error) {
        setError('Order not found. Please check your details.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Track Your Order</h1>

      <div className="bg-white border border-[#F6C9D6] rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-stone-700 font-semibold mb-2">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
            />
          </div>
          <div className="text-center text-stone-400 font-medium">OR</div>
          <div>
            <label className="block text-stone-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={loading}
            className="w-full bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>

      {result && (
        <div className="bg-white border border-[#F6C9D6] rounded-xl p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Order #{result.order_id}</h2>
          <div className="space-y-2 text-sm text-stone-700">
            <p><strong>Name:</strong> {result.customer_name}</p>
            <p><strong>Total:</strong> ₹{result.total_amount}</p>
            <p><strong>Status:</strong> {result.status}</p>
            {result.courier_name && <p><strong>Courier:</strong> {result.courier_name}</p>}
            {result.awb_code && <p><strong>AWB:</strong> {result.awb_code}</p>}
            {result.etd && <p><strong>Expected Delivery:</strong> {result.etd}</p>}
          </div>
          {result.tracking_url && (
            
              href={result.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 font-semibold px-6 py-2 rounded-lg transition">
              View Full Tracking
            </a>
          )}
        </div>
      )}
    </main>
  );
}