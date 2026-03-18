'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice * 100,
          currency: 'INR',
          customerDetails: formData,
          items: cartItems
        })
      });

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Albelee Jewels',
        description: 'Jewellery Purchase',
        order_id: data.id,
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true
        },
        handler: async function (response) {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerDetails: formData,
              items: cartItems
            })
          });

          const result = await verifyRes.json();

          if (result.success) {
            clearCart();
            router.push(`/order-success/${result.orderId}`);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#D85A8C'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF7F8] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 border border-[#F6C9D6]">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4 border border-[#F6C9D6]">
              <h2 className="text-xl font-bold text-stone-800 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-stone-800">Total</span>
                    <span className="text-xl font-bold text-amber-600">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={handlePayment} disabled={loading}
                className="w-full bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 px-6 py-4 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}