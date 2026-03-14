'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', image_url: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => { setCategories(data); setLoading(false); });
  };

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
    if (editingId) {
      await fetch(`/api/admin/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: '', slug: '', image_url: '' });
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, image_url: cat.image_url || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', image_url: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Categories</h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-stone-700">{editingId ? 'Edit Category' : 'Add Category'}</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={form.name} onChange={handleNameChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {uploading && <p className="text-sm text-amber-500 mt-1">Uploading...</p>}
          {form.image_url && !uploading && (
            <img src={form.image_url} alt="preview" className="mt-2 h-24 rounded-lg object-cover" />
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600">
            {editingId ? 'Update' : 'Add Category'}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="bg-gray-200 text-stone-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden max-w-xl">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm text-gray-600">Image</th>
                <th className="text-left p-4 text-sm text-gray-600">Name</th>
                <th className="text-left p-4 text-sm text-gray-600">Slug</th>
                <th className="text-left p-4 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-t">
                  <td className="p-4">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">💎</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-stone-800">{cat.name}</td>
                  <td className="p-4 text-stone-500 text-sm">{cat.slug}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
