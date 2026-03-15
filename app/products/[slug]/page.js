'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-500">Loading...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-500 mb-4">Product not found.</p>
        <Link href="/" className="text-[#D85A8C] underline">Go Home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFF7F8] border border-[#F6C9D6]">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">💎</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-2xl md:text-3xl text-stone-900">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-600">₹{product.price}</span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-stone-400 line-through text-lg">₹{product.mrp}</span>
            )}
          </div>

          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-medium">In Stock</span>
          ) : (
            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          {product.description && (
            <div className="mt-4 border-t border-[#F6C9D6] pt-4">
              <h2 className="font-semibold text-stone-700 mb-2">Product Details</h2>
              <div
                className="prose prose-stone max-w-none text-stone-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}