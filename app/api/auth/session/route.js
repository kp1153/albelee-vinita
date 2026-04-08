import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get('session');
  if (!raw) {
    return Response.json({ user: null });
  }
  try {
    const user = JSON.parse(raw.value);
    return Response.json({ user });
  } catch {
    return Response.json({ user: null });
  }
}