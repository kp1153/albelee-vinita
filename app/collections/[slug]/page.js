import Image from "next/image";
import Link from "next/link";
import client from "@/lib/db";

export const revalidate = 0;

async function getCategoryBySlug(slug) {
  const result = await client.execute({
    sql: `SELECT * FROM categories WHERE slug = ?`,
    args: [slug],
  });
  return result.rows[0] || null;
}

async function getProductsByCategory(categoryId) {
  const result = await client.execute({
    sql: `
      SELECT DISTINCT p.*, pi.image_url as image
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      WHERE (p.category_id = ? OR pc.category_id = ?)
        AND p.is_active = 1
      ORDER BY p.created_at DESC
    `,
    args: [categoryId, categoryId],
  });
  return result.rows;
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <div className="p-16 text-center text-stone-600">Category not found.</div>;
  }

  const products = await getProductsByCategory(category.id);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-stone-900 text-center mb-10">{category.name}</h1>

      {products.length === 0 ? (
        <p className="text-center text-stone-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`}
              className="bg-white border border-[#F6C9D6] rounded-xl overflow-hidden shadow hover:shadow-md transition group">
              <div className="h-56 bg-[#FFF7F8] relative">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">💎</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-stone-800 mb-1">{p.name}</p>
                <p className="text-amber-600 font-bold">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}