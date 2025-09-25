import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  userId: string | null; // Custom user ID from User table
  email: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userId: null,
    email: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", session?.user?.email ?? null)
          .single();

        setAuthState({
          user: session?.user ?? null,
          userId: userData?.user_id ?? null,
          email: session?.user?.email ?? null,
          loading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error("Error getting session:", error);
        setAuthState({
          user: null,
          userId: null,
          email: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {

      setAuthState({
        user: session?.user ?? null,
        userId: null, // Will be fetched if needed
        email: session?.user?.email ?? null,
        loading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
}