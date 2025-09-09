import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
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
        setAuthState({
          user: session?.user ?? null,
          loading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error("Error getting session:", error);
        setAuthState({
          user: null,
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
        loading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
}