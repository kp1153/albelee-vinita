import client from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const result = await client.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
  const product = result.rows[0];

  const catResult = await client.execute({
    sql: `SELECT category_id FROM product_categories WHERE product_id = ?`,
    args: [id],
  });
  product.category_ids = catResult.rows.map(r => r.category_id);

  return Response.json(product);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, slug, description, price, mrp, category_id, stock, category_ids, db_reference, image_url, image2, image3, image4 } = await req.json();

  await client.execute({
    sql: `UPDATE products SET name=?, slug=?, description=?, price=?, mrp=?, category_id=?, stock=?, db_reference=?, image=?, image2=?, image3=?, image4=? WHERE id=?`,
    args: [name, slug, description, price, mrp, category_id || null, stock, db_reference || null, image_url || null, image2 || null, image3 || null, image4 || null, id],
  });

  if (image_url) {
    const existing = await client.execute({
      sql: `SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1`,
      args: [id],
    });
    if (existing.rows.length > 0) {
      await client.execute({
        sql: `UPDATE product_images SET image_url = ? WHERE product_id = ? AND is_primary = 1`,
        args: [image_url, id],
      });
    } else {
      await client.execute({
        sql: `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)`,
        args: [id, image_url],
      });
    }
  }

  await client.execute({ sql: `DELETE FROM product_categories WHERE product_id = ?`, args: [id] });
  if (category_ids && category_ids.length > 0) {
    for (const catId of category_ids) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)`,
        args: [id, catId],
      });
    }
  }

  return Response.json({ success: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await client.execute({ sql: `DELETE FROM products WHERE id = ?`, args: [id] });
  return Response.json({ success: true });
}