import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Link href="/admin/products" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <div className="text-4xl mb-2">💎</div>
          <div className="font-semibold text-stone-700">Products</div>
        </Link>
        <Link href="/admin/categories" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <div className="text-4xl mb-2">📂</div>
          <div className="font-semibold text-stone-700">Categories</div>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <div className="text-4xl mb-2">📦</div>
          <div className="font-semibold text-stone-700">Orders</div>
        </Link>
        <Link href="/admin/customers" className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
          <div className="text-4xl mb-2">👥</div>
          <div className="font-semibold text-stone-700">Customers</div>
        </Link>
      </div>
    </div>
  );
}