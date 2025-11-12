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
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isDocsRoute = request.nextUrl.pathname.startsWith("/docs");

  // Handle admin routes - require admin authentication
  if (isAdminRoute) {
    if (!user) {
      // Not authenticated, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // User is authenticated, check if they're an admin
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.email) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }

      // Query User table to check if user is admin
      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("user_id")
        .eq("user_email", authUser.email)
        .single();

      // If user not found or error, redirect to login
      if (userError || !userData) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
      }

      // Check if user_id matches admin pattern (A followed by 5 digits)
      const isAdmin = userData.user_id && /^A\d{5}$/.test(userData.user_id);

      // If not an admin, redirect to user dashboard
      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/user/dashboard";
        return NextResponse.redirect(url);
      }

      // Admin user, allow access
      return supabaseResponse;
    } catch (error) {
      // On error, redirect to login for safety
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated
  if (user) {
    // Redirect authenticated users away from auth pages and home to appropriate dashboard
    if (isAuthRoute || isHomePage) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.email) {
          // Query User table to check if user is admin
          const { data: userData, error: userError } = await supabase
            .from("User")
            .select("user_id")
            .eq("user_email", authUser.email)
            .single();

          // Determine dashboard based on admin status
          let dashboardPath = "/user/dashboard";
          if (!userError && userData?.user_id) {
            const isAdmin = /^A\d{5}$/.test(userData.user_id);
            if (isAdmin) {
              dashboardPath = "/admin/dashboard";
            }
          }

          const url = request.nextUrl.clone();
          url.pathname = dashboardPath;
          return NextResponse.redirect(url);
        }
      } catch (error) {
        // On error, default to user dashboard
        console.error("Error checking admin status in middleware:", error);
      }

      // Fallback to user dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/user/dashboard";
      return NextResponse.redirect(url);
    }

    // Check if admin is trying to access user routes - redirect to admin dashboard
    if (isUserRoute) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.email) {
          const { data: userData, error: userError } = await supabase
            .from("User")
            .select("user_id")
            .eq("user_email", authUser.email)
            .single();

          if (!userError && userData?.user_id) {
            const isAdmin = /^A\d{5}$/.test(userData.user_id);
            if (isAdmin) {
              // Admin trying to access user routes - redirect to admin dashboard
              const url = request.nextUrl.clone();
              url.pathname = "/admin/dashboard";
              return NextResponse.redirect(url);
            }
          }
        }
      } catch (error) {
        // On error, allow access (fallback)
        console.error("Error checking admin status for user route:", error);
      }
    }

    // Allow access to user routes (if not admin), admin routes (already checked above), API routes, and docs
    if (isUserRoute || isAdminRoute || isApiRoute || isDocsRoute) {
      return supabaseResponse;
    }
  } else {
    // User is not authenticated
    // Allow access to auth routes, API routes, home page, and docs
    if (isAuthRoute || isApiRoute || isHomePage || isDocsRoute) {
      return supabaseResponse;
    }

    // Redirect unauthenticated users trying to access protected routes
    if (isUserRoute || (!isAuthRoute && !isApiRoute && !isHomePage && !isDocsRoute)) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
