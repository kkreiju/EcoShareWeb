import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUrl } from "@/lib/utils/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user?.email) {
      // Get redirect URL from params or determine based on user role
      let next = searchParams.get("next");
      
      // If no explicit next param or invalid path, determine dashboard based on user role
      if (!next || !next.startsWith("/")) {
        next = await getDashboardUrl(data.user.email);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // No code and no error - something went wrong
  return NextResponse.redirect(`${origin}/?auth_error=no_code_provided`);
}
