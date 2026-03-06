'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', mrp: '', category_id: '', stock: '', image_url: '' });

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
  }, []);

  const generateSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(f => ({ ...f, name, slug: generateSlug(name) }));
  };

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
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Add Product</h1>
      <div className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={form.name} onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        {[['description', 'Description'], ['price', 'Price'], ['mrp', 'MRP'], ['stock', 'Stock']].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {uploading && <p className="text-sm text-amber-500 mt-1">Uploading...</p>}
          {form.image_url && !uploading && (
            <img src={form.image_url} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button onClick={handleSubmit} className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600">Save Product</button>
      </div>
    </div>
  );
}