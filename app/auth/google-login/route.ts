// This file handles the Google OAuth login route for the application.
// It can handle mobile and desktop requests, redirecting users to the Google login page.

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        scope: "openid email profile",
      },
      redirectTo: process.env.ORIGIN_URL + "/auth/callback",
    },
  });

  if (error) {
    console.error("OAuth error:", error);
    return new Response("OAuth failed", { status: 500 });
  }

  if (data?.url) {
    redirect(data.url); // this performs SSR redirect
  }

  return new Response("Redirect failed", { status: 400 });
}
