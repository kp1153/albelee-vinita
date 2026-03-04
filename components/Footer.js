import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
          <Link href="/shipping-policy" className="text-stone-300 hover:text-amber-400 transition text-sm">
            Shippingg Policy
          </Link>
          <span className="hidden md:block text-stone-600">|</span>
          <Link href="/return-policy" className="text-stone-300 hover:text-amber-400 transition text-sm">
            Returns & Exchange
          </Link>
        </div>

        <div className="border-t border-stone-700 pt-4 text-center text-xs text-stone-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} Albelee Jewels. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a href="https://www.web-developer-kp.com" target="_blank" rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition font-medium underline">
              web-developer-kp.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;