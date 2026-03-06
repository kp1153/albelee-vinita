'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', mrp: '', category_id: '', stock: '', image_url: '' });

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
  }, []);

  const openMediaLibrary = () => {
    const ml = window.cloudinary.createMediaLibrary(
      {
        cloud_name: 'YOUR_CLOUD_NAME',
        api_key: 'YOUR_API_KEY',
        multiple: false,
      },
      {
        insertHandler: (data) => {
          if (data?.assets?.[0]) {
            setForm(f => ({ ...f, image_url: data.assets[0].secure_url }));
          }
        },
      }
    );
    ml.show();
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
    <>
      <script src="https://media-library.cloudinary.com/global/all.js" async />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Add Product</h1>
        <div className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
          {[['name', 'Name'], ['slug', 'Slug'], ['description', 'Description'], ['price', 'Price'], ['mrp', 'MRP'], ['stock', 'Stock']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex gap-2 items-center">
              <input
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="URL या Browse से चुनो"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={openMediaLibrary}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 whitespace-nowrap"
              >
                Browse
              </button>
            </div>
            {form.image_url && (
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
    </>
  );
}