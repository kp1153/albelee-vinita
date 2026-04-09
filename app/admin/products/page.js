'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, []);

  const deleteProduct = async () => {
    await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-xl">
            <p className="text-lg font-bold text-stone-800 mb-2">Product Delete करें?</p>
            <p className="text-sm text-gray-500 mb-6">यह action undo नहीं होगी।</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-semibold">Cancel</button>
              <button onClick={deleteProduct} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Products</h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setView(view === 'grid' ? 'table' : 'grid')}
            className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-white"
          >
            {view === 'grid' ? 'Table View' : 'Grid View'}
          </button>
          <Link href="/admin/products/add" className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600">
            + Add Product
          </Link>
        </div>
      </div>

      {loading ? <p>Loading...</p> : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
              <div className="relative w-full aspect-square bg-gray-100">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">💎</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-stone-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 mb-1">₹{p.price}</p>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${
                  p.stock > 5 ? 'bg-green-100 text-green-700' :
                  p.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-600'
                }`}>
                  {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${p.id}/edit`} className="flex-1 text-center text-blue-500 hover:underline text-xs border border-blue-200 py-1 rounded">
                    Edit
                  </Link>
                  <button onClick={() => setDeleteId(p.id)} className="flex-1 text-red-500 hover:underline text-xs border border-red-200 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.stock > 5 ? 'bg-green-100 text-green-700' :
                      p.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-blue-500 hover:underline text-sm">Edit</Link>
                    <button onClick={() => setDeleteId(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
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