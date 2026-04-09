"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { slugify } from "transliteration";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploading, setUploading] = useState({ image: false, image2: false, image3: false, image4: false });
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    mrp: "",
    category_id: "",
    stock: "",
    image_url: "",
    image2: "",
    image3: "",
    image4: "",
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

  const generateSlug = (name) =>
    slugify(name, { separator: "-", lowercase: true });

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const { url } = await res.json();
    setForm((f) => ({ ...f, [field === "image" ? "image_url" : field]: url }));
    setUploading((prev) => ({ ...prev, [field]: false }));
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

  const ImageField = ({ field, label }) => {
    const url = field === "image" ? form.image_url : form[field];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {url && (
          <img src={url} alt="preview" className="mb-2 h-24 rounded-lg object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, field)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {uploading[field] && (
          <p className="text-sm text-amber-500 mt-1">Uploading...</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Edit Product</h1>
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            value={form.name || ""}
            onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            value={form.slug || ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <RichTextEditor
            value={form.description || ""}
            onChange={(val) => setForm((f) => ({ ...f, description: val }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MRP (original price)</label>
          <input
            value={form.mrp || ""}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            placeholder="e.g. 999"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <p className="text-xs text-gray-400 mt-1">MRP से कम price रखोगे तो discount दिखेगा</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            value={form.stock || ""}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="border border-gray-200 rounded-xl p-4 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Product Images (अधिकतम 4)</p>
          <ImageField field="image" label="Main Image" />
          <ImageField field="image2" label="Image 2" />
          <ImageField field="image3" label="Image 3" />
          <ImageField field="image4" label="Image 4" />
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
                        prev.filter((id) => id !== Number(c.id))
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
          <label className="block text-sm font-medium text-gray-700 mb-1">DB Reference / SKU Code</label>
          <input
            value={form.db_reference || ""}
            onChange={(e) => setForm({ ...form, db_reference: e.target.value })}
            placeholder="अपना internal code / SKU यहाँ डालें"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <p className="text-xs text-gray-400 mt-1">यह code सिर्फ आपके reference के लिए है — customer को नहीं दिखेगा</p>
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