/**
 * Supabase API client for direct database operations
 * 
 * Note: This is a global client instance for client-side components.
 * For server-side operations, use lib/supabase/server.ts instead.
 * For client-side auth operations, use lib/supabase/client.ts instead.
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
