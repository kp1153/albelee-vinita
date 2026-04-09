import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import client from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect('https://www.shop-at-albelee.com/login?error=no_code');
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'https://www.shop-at-albelee.com/api/auth/callback/google',
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokens.access_token) {
    return NextResponse.redirect('https://www.shop-at-albelee.com/login?error=token_failed');
  }

  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = await userRes.json();

  const isAdmin = user.email === process.env.OWNER_EMAIL;

  if (!isAdmin) {
    await client.execute({
      sql: `INSERT INTO customers (name, email, image_url, google_id)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET name=?, image_url=?`,
      args: [user.name, user.email, user.picture, user.id, user.name, user.picture],
    });
  }

  const sessionData = JSON.stringify({
    name: user.name,
    email: user.email,
    image: user.picture,
    isAdmin,
  });

  const cookieStore = await cookies();
  cookieStore.set('session', sessionData, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  const returnTo = state && state.startsWith('/') ? state : '/';
  return NextResponse.redirect(`https://www.shop-at-albelee.com${returnTo}`);
}