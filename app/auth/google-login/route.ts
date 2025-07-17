// app/auth/google-login/route.ts
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        queryParams: {
        access_type: 'offline',
        prompt: 'consent',
    },
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  console.log('Google OAuth URL:', data?.url);

  if (error) {
    console.error('OAuth error:', error);
    return new Response('OAuth failed', { status: 500 });
  }

  if (data?.url) {
    redirect(data.url); // this performs SSR redirect
  }

  return new Response('Redirect failed', { status: 400 });
}
