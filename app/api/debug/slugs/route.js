import client from '@/lib/db';

export async function GET() {
  const result = await client.execute(`SELECT id, name, slug, price, mrp FROM products`);
  return Response.json(result.rows);
}