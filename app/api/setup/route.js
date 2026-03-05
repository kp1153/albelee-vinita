import { createClient } from '@libsql/client';

export async function GET() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, image_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT, price INTEGER NOT NULL, mrp INTEGER NOT NULL, category_id INTEGER REFERENCES categories(id), stock INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS product_images (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, image_url TEXT NOT NULL, is_primary BOOLEAN DEFAULT 0, sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE, phone TEXT NOT NULL UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS addresses (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE, name TEXT NOT NULL, phone TEXT NOT NULL, line1 TEXT NOT NULL, line2 TEXT, city TEXT NOT NULL, state TEXT NOT NULL, pincode TEXT NOT NULL, is_default BOOLEAN DEFAULT 0);
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, order_number TEXT NOT NULL UNIQUE, customer_id INTEGER REFERENCES customers(id), address_id INTEGER REFERENCES addresses(id), total_amount INTEGER NOT NULL, discount INTEGER DEFAULT 0, shipping_charge INTEGER DEFAULT 0, status TEXT DEFAULT 'pending', payment_method TEXT DEFAULT 'cod', payment_status TEXT DEFAULT 'pending', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id INTEGER NOT NULL REFERENCES products(id), product_name TEXT NOT NULL, price INTEGER NOT NULL, quantity INTEGER NOT NULL, subtotal INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS wishlist (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(customer_id, product_id));
    CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    INSERT OR IGNORE INTO categories (name, slug) VALUES ('Earrings', 'earrings'), ('Earrings Smaller', 'earrings-smaller'), ('Earrings Bigger', 'earrings-bigger'), ('Gold Tone', 'gold-tone'), ('Silver Tone', 'silver-tone'), ('Bracelets', 'bracelets'), ('Anti Tarnish', 'anti-tarnish');
  `);

  return Response.json({ success: true, message: 'Tables created!' });
}