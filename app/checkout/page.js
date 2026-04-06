"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const DELIVERY_CHARGE = 0;
  const DISCOUNT_THRESHOLD = 1000;
  const FLAT_DISCOUNT = 51;

  const totalMRP = cartItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const mrpDiscount = totalMRP - totalPrice;
  const flatDiscount = totalPrice >= DISCOUNT_THRESHOLD ? FLAT_DISCOUNT : 0;
  const amountToPay = totalPrice - flatDiscount;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReview = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill all required fields");
      return;
    }
    setShowConfirm(true);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToPay * 100,
          currency: "INR",
          customerDetails: formData,
          items: cartItems,
        }),
      });

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Albelee",
        description: "Jewellery Purchase",
        image: "/logo.jpeg",
        order_id: data.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerDetails: formData,
              items: cartItems,
            }),
          });

          const result = await verifyRes.json();

          if (result.success) {
            clearCart();
            router.push(`/order-success/${result.orderId}`);
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#D85A8C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF7F8] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 border border-[#F6C9D6]">
              <h2 className="text-xl font-bold text-stone-800 mb-6">
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4 border border-[#F6C9D6]">
              <h2 className="text-xl font-bold text-stone-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F6C9D6] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Total MRP</span>
                  <span>₹{totalMRP}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                {mrpDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({Math.round((mrpDiscount / totalMRP) * 100)}% off)</span>
                    <span>- ₹{mrpDiscount}</span>
                  </div>
                )}
                {flatDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Special Discount</span>
                    <span>- ₹{flatDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-stone-800 border-t border-[#F6C9D6] pt-2">
                  <span>Amount to Pay</span>
                  <span className="text-amber-600">₹{amountToPay}</span>
                </div>
              </div>
              <button
                onClick={handleReview}
                className="mt-4 w-full bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 px-6 py-4 rounded-xl font-semibold text-lg transition"
              >
                Review Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-[#F6C9D6] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-800">
                Review Order
              </h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600 text-sm underline"
              >
                Edit Order
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                ITEMS
              </h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs border border-red-200 px-2 py-0.5 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F6C9D6] pt-3 mb-4 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              {mrpDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({Math.round((mrpDiscount / totalMRP) * 100)}% off)</span>
                  <span>- ₹{mrpDiscount}</span>
                </div>
              )}
              {flatDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Special Discount</span>
                  <span>- ₹{flatDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-800 text-base pt-1 border-t border-[#F6C9D6]">
                <span>Amount to Pay</span>
                <span className="text-amber-600">₹{amountToPay}</span>
              </div>
            </div>

            <div className="border-t border-[#F6C9D6] pt-3 mb-5">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                DELIVERY ADDRESS
              </h3>
              <p className="text-sm text-gray-700">{formData.name}</p>
              <p className="text-sm text-gray-700">{formData.phone}</p>
              <p className="text-sm text-gray-700">
                {formData.address}, {formData.city}, {formData.state} -{" "}
                {formData.pincode}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Edit
              </button>
              <button
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="flex-1 bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay Now ₹" + amountToPay}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}