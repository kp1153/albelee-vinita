"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    image_url: "",
    db_reference: "",
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm(data);
        setSelectedCategories((data.category_ids || []).map(Number));
      });
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const { url } = await res.json();
    setForm((f) => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleSubmit = async () => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: selectedCategories[0] || null,
        category_ids: selectedCategories,
      }),
    });
    router.push("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Edit Product</h1>
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            value={form.slug || ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <RichTextEditor
            value={form.description || ""}
            onChange={(val) => setForm((f) => ({ ...f, description: val }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MRP (original price)
          </label>
          <input
            value={form.mrp || ""}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="e.g. 999"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            MRP से कम price रखोगे तो discount दिखेगा
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            value={form.stock || ""}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          {form.image_url && (
            <img
              src={form.image_url}
              alt="preview"
              className="mb-2 h-24 rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {uploading && (
            <p className="text-sm text-amber-500 mt-1">Uploading...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories (एक से अधिक चुन सकते हैं)
          </label>
          <div className="border border-gray-300 rounded-lg p-3 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-amber-50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(Number(c.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, Number(c.id)]);
                    } else {
                      setSelectedCategories((prev) =>
                        prev.filter((id) => id !== Number(c.id)),
                      );
                    }
                  }}
                  className="accent-amber-500"
                />
                <span className="text-sm text-gray-700">{c.name}</span>
              </label>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              ✓ {selectedCategories.length} category चुनी गई
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DB Reference / SKU Code
          </label>
          <input
            value={form.db_reference || ""}
            onChange={(e) => setForm({ ...form, db_reference: e.target.value })}
            placeholder="अपना internal code / SKU यहाँ डालें"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            यह code सिर्फ आपके reference के लिए है — customer को नहीं दिखेगा
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}
