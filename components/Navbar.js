"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const shopMenu = [
  {
    label: "Earrings",
    slug: "earrings",
    sub: [
      { label: "Office Wear", slug: "earrings-office-wear" },
      { label: "Bigger", slug: "earrings-bigger" },
    ],
  },
  { label: "Gold Tone", slug: "gold-tone" },
  { label: "Silver Tone", slug: "silver-tone" },
  { label: "Bracelets", slug: "bracelets" },
  { label: "Anti Tarnish", slug: "anti-tarnish" },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef(null);

  const open = (menu) => { clearTimeout(timeoutRef.current); setActiveMenu(menu); };
  const close = () => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 150); };
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  useEffect(() => { setMobileOpen(false); setActiveMenu(null); }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-amber-50 border-b border-amber-300 shadow-sm">

      {/* Top Strip */}
      <div className="bg-stone-900 text-amber-300 text-xs text-center py-1.5 tracking-widest">
        Free Shipping &nbsp;|&nbsp; COD Available &nbsp;|&nbsp;
        <Link href="/track-order" className="underline hover:text-white transition-colors ml-1">
          Track Your Order
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl font-bold text-stone-900">
            Albelee <span className="text-amber-500 italic">Jewels</span>
          </span>
          <span className="text-[9px] tracking-[4px] text-amber-500 uppercase">Jaipur · Est. 2024</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">

          <li>
            <Link href="/"
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors
              ${pathname === "/" ? "text-amber-600 bg-amber-100" : "text-stone-700 hover:text-amber-600 hover:bg-amber-100"}`}>
              Home
            </Link>
          </li>

          <li className="relative" onMouseEnter={() => open("shop")} onMouseLeave={close}>
            <button className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded transition-colors
              ${activeMenu === "shop" ? "text-amber-600 bg-amber-100" : "text-stone-700 hover:text-amber-600 hover:bg-amber-100"}`}>
              Shop by Category
              <span className={`text-[8px] transition-transform duration-200 ${activeMenu === "shop" ? "rotate-180" : ""}`}>▾</span>
            </button>

            {activeMenu === "shop" && (
              <div
                onMouseEnter={() => open("shop")}
                onMouseLeave={close}
                className="absolute top-full left-0 mt-2 bg-white border border-amber-200 rounded-lg shadow-xl p-4 z-50 min-w-[200px]"
              >
                <ul className="space-y-1">
                  {shopMenu.map(({ label, slug, sub }) => (
                    <li key={slug}>
                      <Link
                        href={`/collections/${slug}`}
                        className={`text-sm text-stone-700 hover:text-amber-600 hover:pl-1 transition-all block py-1
                          ${label === "Bracelets" ? "font-bold text-base" : ""}`}
                      >
                        {label}
                      </Link>
                      {sub && (
                        <ul className="ml-3 space-y-0.5 border-l border-amber-100 pl-2">
                          {sub.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={`/collections/${s.slug}`}
                                className="text-xs text-stone-500 hover:text-amber-600 hover:pl-1 transition-all block py-0.5"
                              >
                                {s.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>

        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center bg-amber-100 border border-amber-300 rounded-full px-3 py-1.5 gap-2 focus-within:border-amber-500 transition-colors">
            <span className="text-sm">🔍</span>
            <input className="bg-transparent text-sm text-stone-700 outline-none w-28 placeholder:text-amber-400" placeholder="Search..." />
          </div>
          <button className="relative p-2 rounded-full hover:bg-amber-100 transition-colors text-lg">
            ♡
            <span className="absolute top-0.5 right-0.5 bg-red-700 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </button>
          <button className="p-2 rounded-full hover:bg-amber-100 transition-colors text-lg">👤</button>
          <button className="relative p-2 rounded-full hover:bg-amber-100 transition-colors text-lg">
            🛍️
            <span className="absolute top-0.5 right-0.5 bg-red-700 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </button>
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-amber-200 px-4 pb-6 pt-2 space-y-4">
          <Link href="/" className="text-sm font-semibold text-stone-700 block py-1.5">Home</Link>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Shop by Category</h4>
            <ul className="space-y-1">
              {shopMenu.map(({ label, slug, sub }) => (
                <li key={slug}>
                  <Link
                    href={`/collections/${slug}`}
                    className={`text-sm text-stone-700 block py-1.5 border-b border-amber-50 hover:text-amber-600
                      ${label === "Bracelets" ? "font-bold text-base" : ""}`}
                  >
                    {label}
                  </Link>
                  {sub && (
                    <ul className="ml-4 space-y-0.5">
                      {sub.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/collections/${s.slug}`} className="text-xs text-stone-500 block py-1 hover:text-amber-600">
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}