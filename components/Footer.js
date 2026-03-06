import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#FFF3F6] text-stone-800 py-8 border-t-2 border-[#F6C9D6]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
          <Link href="/shipping-policy" className="text-stone-600 hover:text-[#D85A8C] transition text-sm font-medium">
            Shipping Policy
          </Link>
          <span className="hidden md:block text-[#F6C9D6]">|</span>
          <Link href="/return-policy" className="text-stone-600 hover:text-[#D85A8C] transition text-sm font-medium">
            Returns & Exchange
          </Link>
        </div>

        <div className="border-t border-[#F6C9D6] pt-4 text-center text-xs text-stone-500">
          <p className="mb-2">&copy; {new Date().getFullYear()} Albelee Jewels. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a href="https://www.web-developer-kp.com" target="_blank" rel="noopener noreferrer"
              className="text-[#D85A8C] hover:text-[#EFA7BC] transition font-medium underline">
              web-developer-kp.com
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;