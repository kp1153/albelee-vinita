import Link from "next/link";

const styles = [
  { label: "Kundan", slug: "kundan" },
  { label: "Meenakari", slug: "meenakari" },
  { label: "Oxidized", slug: "oxidized" },
  { label: "Polki", slug: "polki" },
  { label: "American Diamond", slug: "american-diamond" },
  { label: "Rajputi", slug: "rajputi" },
];

const occasions = [
  { label: "Bridal & Wedding", slug: "bridal" },
  { label: "Festive", slug: "festive" },
  { label: "Party Wear", slug: "party-wear" },
  { label: "Daily Wear", slug: "daily-wear" },
];

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">

      {/* Hero */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl h-80 flex flex-col items-center justify-center text-center gap-4">
        <h1 className="font-serif text-4xl text-stone-900">Jaipur's Finest Fashion Jewellery</h1>
        <p className="text-stone-500 text-sm">Kundan · Meenakari · Oxidized · Polki</p>
        <Link href="/collections/new-arrivals" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
          Shop New Arrivals
        </Link>
      </section>

      {/* Shop by Style */}
      <section>
        <h2 className="font-serif text-2xl text-stone-900 mb-6">Shop by Style</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {styles.map(({ label, slug }) => (
            <Link key={slug} href={`/collections/${slug}`}
              className="bg-amber-50 border border-amber-200 rounded-lg py-4 text-center text-sm font-medium text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals — Turso से आएगा */}
      <section>
        <h2 className="font-serif text-2xl text-stone-900 mb-2">New Arrivals</h2>
        <p className="text-stone-400 text-sm">Products will load from Turso</p>
      </section>

      {/* Shop by Occasion */}
      <section>
        <h2 className="font-serif text-2xl text-stone-900 mb-6">Shop by Occasion</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {occasions.map(({ label, slug }) => (
            <Link key={slug} href={`/collections/${slug}`}
              className="bg-amber-50 border border-amber-200 rounded-xl py-8 text-center text-sm font-semibold text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers — Turso से आएगा */}
      <section>
        <h2 className="font-serif text-2xl text-stone-900 mb-2">Best Sellers</h2>
        <p className="text-stone-400 text-sm">Products will load from Turso</p>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-amber-200 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-stone-600">
        {["Free Shipping above ₹499", "Easy Returns", "Cash on Delivery", "Jaipur Craft"].map(t => (
          <div key={t} className="font-medium">{t}</div>
        ))}
      </section>

    </main>
  );
}