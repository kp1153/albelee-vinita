import client from '@/lib/db';

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, slug, image_url } = await req.json();
  await client.execute(
    `UPDATE categories SET name=?, slug=?, image_url=? WHERE id=?`,
    [name, slug, image_url, id]
  );
  return Response.json({ success: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await client.execute(`DELETE FROM categories WHERE id=?`, [id]);
  return Response.json({ success: true });
}