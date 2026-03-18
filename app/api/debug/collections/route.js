import client from '@/lib/db';

export async function GET() {
  try {
    const categories = await client.execute(`SELECT * FROM categories WHERE slug = 'gold-tone'`);
    const cat = categories.rows[0];

    if (!cat) return Response.json({ error: 'category not found' });

    const products = await client.execute({
      sql: `
        SELECT DISTINCT p.*, pi.image_url as image
        FROM products p
        LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        WHERE (p.category_id = ? OR pc.category_id = ?)
          AND p.is_active = 1
        ORDER BY p.created_at DESC
      `,
      args: [cat.id, cat.id],
    });

    return Response.json({ category: cat, products: products.rows });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
