import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <Link
          href="/api/auth/google?returnTo=/admin"
          className="w-full flex items-center justify-center gap-3 border bg-white hover:bg-gray-50 text-stone-700 font-medium py-3 px-6 rounded-xl transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </Link>
      </div>
    </div>
  );
}