import client from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const result = await client.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
  return Response.json(result.rows[0]);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, slug, description, price, mrp, category_id, stock } = await req.json();
  await client.execute({
    sql: `UPDATE products SET name=?, slug=?, description=?, price=?, mrp=?, category_id=?, stock=? WHERE id=?`,
    args: [name, slug, description, price, mrp, category_id, stock, id],
  });
  return Response.json({ success: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await client.execute({ sql: `DELETE FROM products WHERE id = ?`, args: [id] });
  return Response.json({ success: true });
}