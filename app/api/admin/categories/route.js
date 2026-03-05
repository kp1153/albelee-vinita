import client from '@/lib/db';

export async function GET() {
  const result = await client.execute(`SELECT * FROM categories ORDER BY name`);
  return Response.json(result.rows);
}