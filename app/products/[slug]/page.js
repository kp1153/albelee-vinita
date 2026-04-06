"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlisted(saved.includes(slug));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updated;
    if (wishlisted) {
      updated = saved.filter((s) => s !== slug);
    } else {
      updated = [...saved, slug];
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  const handlePincodeCheck = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
      return;
    }
    setDeliveryMsg("Checking...");
    try {
      const res = await fetch(`/api/pincode-check?pincode=${pincode}`);
      const data = await res.json();
      if (data.serviceable) {
        setDeliveryMsg(`Get it by ${data.delivery_date}${data.cod ? " · COD Available" : ""}`);
      } else {
        setDeliveryMsg("Delivery not available at this pincode.");
      }
    } catch {
      setDeliveryMsg("Could not check. Please try again.");
    }
  };

  const images = product
    ? [product.image, product.image2, product.image3, product.image4].filter(Boolean)
    : [];

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
        <Link href="/" className="text-[#D85A8C] underline">
          Go Home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFF7F8] border border-[#F6C9D6]">
            {images.length > 0 ? (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                💎
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === i ? "border-[#D85A8C]" : "border-[#F6C9D6]"
                  }`}
                >
                  <Image src={img} alt={`view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-2xl md:text-3xl text-stone-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-600">
              ₹{product.price}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-stone-400 line-through text-lg">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-medium">In Stock ({product.stock} left)</span>
          ) : (
            <span className="text-red-500 text-sm font-medium">
              Out of Stock
            </span>
          )}

          {/* Add to Cart + Wishlist */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "✓ Added to Bag" : "Add to Bag"}
            </button>
            <button
              onClick={handleWishlist}
              className={`px-4 py-3 rounded-xl border-2 transition font-semibold ${
                wishlisted
                  ? "border-[#D85A8C] bg-[#FFF0F5] text-[#D85A8C]"
                  : "border-[#F6C9D6] text-stone-500 hover:border-[#D85A8C] hover:text-[#D85A8C]"
              }`}
              title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {wishlisted ? "♥" : "♡"} Wishlist
            </button>
          </div>

          {/* Pincode Check */}
          <div className="border border-[#F6C9D6] rounded-xl p-4 flex flex-col gap-2">
            <p className="text-sm font-semibold text-stone-700">
              Enter your PIN code to check when you will receive it
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => { setPincode(e.target.value); setDeliveryMsg(""); }}
                placeholder="Enter PIN code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6C9D6]"
              />
              <button
                onClick={handlePincodeCheck}
                className="bg-[#F6C9D6] hover:bg-[#EFA7BC] text-stone-800 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Check
              </button>
            </div>
            {deliveryMsg && (
              <p className="text-sm text-green-700 font-medium">{deliveryMsg}</p>
            )}
            <div className="flex gap-4 mt-1">
              <span className="text-xs text-stone-600 flex items-center gap-1">
                💵 COD Available
              </span>
              <span className="text-xs text-stone-600 flex items-center gap-1">
                🔄 Returns within 2 days (damage / wrong item)
              </span>
            </div>
          </div>

          {/* Customer Photos placeholder */}
          <div className="border-t border-[#F6C9D6] pt-4">
            <h2 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
              Customer Photos
            </h2>
            <p className="text-xs text-stone-400 italic">No customer photos yet.</p>
          </div>

          {/* Reviews placeholder */}
          <div className="border-t border-[#F6C9D6] pt-4">
            <h2 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
              Reviews
            </h2>
            <p className="text-xs text-stone-400 italic">No reviews yet. Be the first to review!</p>
          </div>

          {product.description && (
            <div className="mt-2 border-t border-[#F6C9D6] pt-4">
              <h2 className="font-semibold text-stone-700 mb-2">
                Product Details
              </h2>
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