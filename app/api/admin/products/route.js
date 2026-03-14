import client from '@/lib/db';

export async function GET() {
  try {
    const result = await client.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return Response.json(result.rows);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, slug, description, price, category_id, stock, image_url } = await req.json();
    const result = await client.execute({
      sql: `INSERT INTO products (name, slug, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [name, slug, description, price, category_id, stock],
    });
    if (image_url) {
      await client.execute({
        sql: `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)`,
        args: [result.lastInsertRowid, image_url],
      });
    }
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}