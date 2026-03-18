import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  try {
    await client.execute(`ALTER TABLE products ADD COLUMN db_reference TEXT`);
    return Response.json({ success: true, message: 'db_reference column added!' });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}