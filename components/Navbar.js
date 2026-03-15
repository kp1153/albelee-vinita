'use client';
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const earringsMenu = [
  { name: 'Smaller', href: '/collections/earrings-smaller' },
  { name: 'Bigger', href: '/collections/earrings-bigger' },
];

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Earrings', href: '/collections/earrings', children: earringsMenu },
  { name: 'Gold Tone', href: '/collections/gold-tone' },
  { name: 'Silver Tone', href: '/collections/silver-tone' },
  { name: 'Bracelets', href: '/collections/bracelets' },
  { name: 'Anti Tarnish', href: '/collections/anti-tarnish' },
];

const Navbar = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const buttonRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowNav(current < lastScroll || current < 50);
      setLastScroll(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  const handleDropdownClick = (index) => setActiveDropdown(activeDropdown === index ? null : index);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`bg-[#FFF3F6] border-b-2 border-[#F6C9D6] shadow-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4">

          <div className="relative flex items-center justify-between py-4 gap-4">
            <div className="flex items-center w-24 md:w-32">
              <Link href="/">
                <Image src="/logo.jpeg" alt="Albelee" width={120} height={75} className="object-contain" priority />
              </Link>
            </div>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-serif text-2xl md:text-3xl font-bold text-stone-900 tracking-widest">ALBELEE</span>
              <span className="text-xs text-stone-500 tracking-widest font-medium">अलबेली</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/wishlist" className="p-2 transition-colors">
                <FaHeart className="text-lg md:text-xl text-[#D85A8C]" />
              </Link>
              <Link href="/tracking" className="hidden md:block text-stone-800 hover:text-[#EFA7BC] transition-colors text-sm font-medium">Tracking</Link>
              <button onClick={() => setShowSearch(!showSearch)} className="text-stone-800 hover:text-[#EFA7BC] transition-colors p-2" aria-label="Search">
                <FaSearch className="text-lg md:text-xl" />
              </button>
              <Link href="/cart" className="relative group">
                <div className="bg-[#C9D7F2] hover:bg-[#b3c6ef] text-stone-800 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all shadow-md flex items-center gap-1 md:gap-2">
                  <FaShoppingCart className="text-lg md:text-xl" />
                  {totalItems > 0 && (
                    <span className="bg-white text-stone-700 text-xs md:text-sm font-bold px-1.5 md:px-2 py-0.5 rounded-full">{totalItems}</span>
                  )}
                </div>
              </Link>
              <Link href="/admin/login" className="hidden md:block text-stone-800 hover:text-[#EFA7BC] transition-colors p-2">
                <FaUser className="text-xl" />
              </Link>
              <button
                className="md:hidden text-stone-800 p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6C9D6] border border-[#F6C9D6]"
                  autoFocus />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#D85A8C]"><FaSearch /></button>
              </form>
            </div>
          )}

          <div className="hidden md:block pb-2">
            <div className="flex items-center justify-between w-full">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {!item.children ? (
                    <Link href={item.href}
                      className={`block px-3 py-2 text-stone-900 hover:text-stone-900 hover:bg-[#F6C9D6] rounded-lg transition-colors whitespace-nowrap text-sm font-semibold uppercase tracking-wide ${isActive(item.href) ? "text-stone-900 bg-[#F6C9D6]" : ""}`}>
                      {item.name}
                    </Link>
                  ) : (
                    <button ref={(el) => (buttonRefs.current[index] = el)} onClick={() => handleDropdownClick(index)}
                      className={`px-3 py-2 text-stone-900 hover:text-stone-900 hover:bg-[#F6C9D6] rounded-lg transition-colors whitespace-nowrap text-sm font-semibold uppercase tracking-wide flex items-center gap-1 ${isActive(item.href) ? "text-stone-900 bg-[#F6C9D6]" : ""}`}>
                      {item.name}
                      <span className="text-xs">{activeDropdown === index ? '▲' : '▼'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </nav>

      <div className="h-[108px] md:h-[120px]" />

      {activeDropdown !== null && navItems[activeDropdown]?.children && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setActiveDropdown(null)} />
          <div className="fixed left-0 right-0 bg-white border-t border-[#F6C9D6] shadow-lg py-4 z-[100]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex gap-2">
                {navItems[activeDropdown].children.map((child) => (
                  <Link key={child.name} href={child.href} onClick={() => setActiveDropdown(null)}
                    className="px-4 py-2 text-sm text-stone-700 hover:text-stone-900 hover:bg-[#F6C9D6] rounded-lg transition-colors">
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {mobileOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[200] bg-[#FFF3F6] overflow-y-auto md:hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#F6C9D6]">
            <span className="font-serif text-xl font-bold text-stone-900 tracking-widest">ALBELEE</span>
            <button onClick={() => setMobileOpen(false)} className="text-stone-800 p-2">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item, index) => (
              <div key={item.name}>
                {!item.children ? (
                  <Link href={item.href}
                    className={`block px-4 py-3 text-stone-900 rounded-xl text-base font-semibold uppercase tracking-wide transition-colors ${isActive(item.href) ? "bg-[#F6C9D6]" : "hover:bg-[#F6C9D6]"}`}>
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setMobileDropdown(mobileDropdown === index ? null : index)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-stone-900 rounded-xl text-base font-semibold uppercase tracking-wide transition-colors ${isActive(item.href) ? "bg-[#F6C9D6]" : "hover:bg-[#F6C9D6]"}`}>
                      {item.name}
                      <FaChevronDown className={`transition-transform text-sm ${mobileDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdown === index && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {item.children.map(child => (
                          <Link key={child.name} href={child.href}
                            className="block px-4 py-2.5 text-stone-700 hover:bg-[#F6C9D6] rounded-xl text-sm font-medium transition-colors">
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div className="border-t border-[#F6C9D6] mt-4 pt-4 flex flex-col gap-1">
              <Link href="/tracking"
                className="block px-4 py-3 text-stone-900 hover:bg-[#F6C9D6] rounded-xl text-base font-semibold uppercase tracking-wide transition-colors">
                Tracking
              </Link>
              <Link href="/admin/login"
                className="block px-4 py-3 text-stone-900 hover:bg-[#F6C9D6] rounded-xl text-base font-semibold uppercase tracking-wide transition-colors">
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;