export const revalidate = 0;
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/db";

async function getCategories() {
  try {
    const result = await client.execute(`SELECT * FROM categories ORDER BY name`);
    return result.rows;
  } catch (e) {
    console.error("DB error:", e);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  return (
    <main>

      <section className="w-full h-[600px] flex">
        <div className="w-1/2 flex flex-col justify-center px-16" style={{background: '#F5D1B5'}}>
          <h1 className="font-serif text-5xl text-stone-800 font-bold leading-tight drop-shadow">
            A New Expression,<br />Every Day.
          </h1>
        </div>
        <div className="w-1/2 relative">
          <Image
            src="/hero.png"
            alt="Albelee Jewels"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      <section className="py-16 text-center" style={{background: '#F5D1B5'}}>
        <div className="max-w-2xl mx-auto px-4">
          <p className="font-serif text-xl text-stone-800 leading-relaxed drop-shadow">
            तू अब निकल, चल बदल, रोज़ नया रूप धर,<br />
            बन सँवर, कर गुज़र नित नई अठखेली...<br />
            कि जान ले अब हर कोई,<br />
            तू है कोई अलबेली
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl text-stone-900 text-center mb-10">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/collections/${cat.slug}`}
              className="bg-white border border-[#F6C9D6] rounded-xl overflow-hidden shadow hover:shadow-md transition group">
              <div className="h-48 bg-[#FFF7F8] relative">
                {cat.image_url ? (
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">💎</div>
                )}
              </div>
              <div className="p-4 text-center">
                <p className="font-semibold text-stone-800 mb-2">{cat.name}</p>
                <span className="bg-[#F6C9D6] text-stone-800 text-xs px-4 py-1.5 rounded-full group-hover:bg-[#EFA7BC] transition">
                  View All
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#F6C9D6] py-8 bg-[#FFF7F8]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-stone-600">
          {["Free Shipping above ₹499", "Easy Returns", "Cash on Delivery", "Handcrafted Jewellery"].map(t => (
            <div key={t} className="font-medium">{t}</div>
          ))}
        </div>
      </section>

    </main>
  );
}