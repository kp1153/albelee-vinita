import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFF3F6] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-sm w-full text-center">
        <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-widest mb-1">ALBELEE</h1>
        <p className="text-stone-500 text-sm mb-8">Sign in to your account</p>
        <Link
          href="/api/auth/google?returnTo=/"
          className="w-full flex items-center justify-center gap-3 border border-[#F6C9D6] bg-white hover:bg-[#FFF3F6] text-stone-700 font-medium py-3 px-6 rounded-xl transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </Link>
      </div>
    </div>
  );
}