'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-stone-900 mb-4">Your Cart</h1>
        <p className="text-stone-500 mb-6">Your cart is empty.</p>
        <Link href="/" className="bg-[#F6C9D6] text-stone-800 px-6 py-2 rounded-lg hover:bg-[#EFA7BC] transition">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white border border-[#F6C9D6] rounded-xl p-4">
            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-[#FFF7F8]">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-stone-800">{item.name}</p>
              <p className="text-amber-600 font-bold">₹{item.price}</p>
              <p className="text-stone-500 text-sm">Qty: {item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Link href="/checkout" className="bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 font-semibold px-8 py-3 rounded-xl transition">
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}