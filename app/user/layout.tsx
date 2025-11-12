import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserLayoutWrapper } from "@/components/layout/user-layout-wrapper";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userData = await supabase
    .from("User")
    .select(
      "user_id, user_email, user_firstName, user_middleName, user_lastName, user_isVerified, user_ratings, user_transactionCount, user_profileURL, user_membershipStatus"
    )
    .eq("user_email", data.user.email)
    .single();

  // Check if user is an admin - redirect to admin dashboard
  if (userData.data?.user_id && /^A\d{5}$/.test(userData.data.user_id)) {
    redirect("/admin/dashboard");
  }

  // If user not found in User table or error, redirect to login
  if (userData.error || !userData.data) {
    redirect("/auth/login");
  }

  // Safely construct full name with more defensive programming
  const firstName = userData.data?.user_firstName?.trim() || "";
  const lastName = userData.data?.user_lastName?.trim() || "";
  const fullName =
    [firstName, lastName].filter((name) => name && name.length > 0).join(" ") ||
    "User";
  const avatarUrl =
    userData.data?.user_profileURL?.trim() || "/avatars/default.jpg";

  // Use static fallback to avoid hydration issues
  const userDisplayData = {
    name: fullName,
    email: data.user.email || "",
    avatar: avatarUrl,
    membershipStatus: userData.data?.user_membershipStatus || "Free",
  };

  return (
    <UserLayoutWrapper user={userDisplayData}>
      {children}
    </UserLayoutWrapper>
  );
}
