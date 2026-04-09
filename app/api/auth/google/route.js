import { redirect } from 'next/navigation';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get('returnTo') || '/';

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'https://www.shop-at-albelee.com/api/auth/callback/google',
    response_type: 'code',
    scope: 'openid email profile',
    state: returnTo,
  });

  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}