'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', mrp: '', category_id: '', stock: '', image_url: '' });

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
    fetch(`/api/admin/products/${id}`).then(r => r.json()).then(setForm);
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    setForm(f => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleSubmit = async () => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Edit Product</h1>
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        {[['name', 'Name'], ['slug', 'Slug'], ['description', 'Description'], ['price', 'Price'], ['mrp', 'MRP'], ['stock', 'Stock']].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          {form.image_url && (
            <img src={form.image_url} alt="preview" className="mb-2 h-24 rounded-lg object-cover" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {uploading && <p className="text-sm text-amber-500 mt-1">अपलोड हो रहा है...</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category_id || ''} onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600">Update Product</button>
      </div>
    </div>
  );
}