import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Define protected and public routes
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isHomePage = request.nextUrl.pathname === "/";
  const isUserRoute = request.nextUrl.pathname.startsWith("/user");

  // If user is authenticated
  if (user) {
    // Redirect authenticated users away from auth pages and home to dashboard
    if (isAuthRoute || isHomePage) {
      console.log(
        "MIDDLEWARE: Authenticated user accessing auth/home, redirecting to dashboard"
      );
      const url = request.nextUrl.clone();
      url.pathname = "/user/dashboard";

      return NextResponse.redirect(url);
    }

    // Allow access to user routes and API routes
    if (isUserRoute || isApiRoute) {
      return supabaseResponse;
    }
  } else {
    // User is not authenticated
    // Allow access to auth routes, API routes, and home page
    if (isAuthRoute || isApiRoute || isHomePage) {
      return supabaseResponse;
    }

    // Redirect unauthenticated users trying to access protected routes
    if (isUserRoute || (!isAuthRoute && !isApiRoute && !isHomePage)) {
      console.log("MIDDLEWARE: No user found, redirecting to login page");
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
