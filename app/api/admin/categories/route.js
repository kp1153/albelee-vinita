import client from '@/lib/db';

export async function GET() {
  const result = await client.execute(`SELECT * FROM categories ORDER BY name`);
  return Response.json(result.rows);
}

export async function POST(req) {
  const { name, slug, image_url } = await req.json();
  await client.execute(
    `INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)`,
    [name, slug, image_url]
  );
  return Response.json({ success: true });
}