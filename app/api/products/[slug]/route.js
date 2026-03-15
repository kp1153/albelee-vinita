import client from '@/lib/db';

export async function GET(req, { params }) {
  const { slug } = await params;
  try {
    const result = await client.execute({
      sql: `
        SELECT p.*, pi.image_url as image
        FROM products p
        LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
        WHERE p.slug = ?
        LIMIT 1
      `,
      args: [slug],
    });
    if (!result.rows[0]) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(result.rows[0]);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}