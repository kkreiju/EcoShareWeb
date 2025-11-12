import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/layout/admin-layout-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Check if user is an admin by querying User table
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("user_id, user_firstName, user_middleName, user_lastName, user_profileURL")
    .eq("user_email", data.user.email)
    .single();

  // If user not found in User table or error, redirect to login
  if (userError || !userData) {
    redirect("/auth/login");
  }

  // Check if user_id matches admin pattern (A followed by 5 digits)
  const isAdmin = userData.user_id && /^A\d{5}$/.test(userData.user_id);

  // If not an admin, redirect to user dashboard
  if (!isAdmin) {
    redirect("/user/dashboard");
  }

  // Safely construct full name
  const firstName = userData.user_firstName?.trim() || "";
  const lastName = userData.user_lastName?.trim() || "";
  const fullName =
    [firstName, lastName].filter((name) => name && name.length > 0).join(" ") ||
    "Admin";
  const avatarUrl =
    userData.user_profileURL?.trim() || "/avatars/admin.jpg";

  return (
    <AdminLayoutWrapper
      user={{
        name: fullName,
        email: data.user.email || "",
        avatar: avatarUrl,
      }}
    >
      {children}
    </AdminLayoutWrapper>
  );
}
