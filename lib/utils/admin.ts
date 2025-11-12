import { createClient } from "@/lib/supabase/server";

/**
 * Check if a user is an admin by their email
 * Admin users have user_id matching pattern A\d{5} (e.g., A00086)
 */
export async function isAdminUser(email: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: userData, error } = await supabase
      .from("User")
      .select("user_id")
      .eq("user_email", email)
      .single();

    if (error || !userData?.user_id) {
      return false;
    }

    // Check if user_id matches admin pattern (A followed by 5 digits)
    return /^A\d{5}$/.test(userData.user_id);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get the appropriate dashboard URL for a user based on their role
 */
export async function getDashboardUrl(email: string): Promise<string> {
  const isAdmin = await isAdminUser(email);
  return isAdmin ? "/admin/dashboard" : "/user/dashboard";
}

