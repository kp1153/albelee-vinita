'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Products</h1>
        <Link href="/admin/products/add" className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600">+ Add Product</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm text-gray-600">Name</th>
                <th className="text-left p-4 text-sm text-gray-600">Category</th>
                <th className="text-left p-4 text-sm text-gray-600">Price</th>
                <th className="text-left p-4 text-sm text-gray-600">Stock</th>
                <th className="text-left p-4 text-sm text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.category_name}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-blue-500 hover:underline text-sm">Edit</Link>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
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