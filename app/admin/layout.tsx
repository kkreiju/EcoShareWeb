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

  // TODO: Add admin role check here
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', data.user.id)
  //   .single()

  // if (profile?.role !== 'admin') {
  //   redirect('/user/dashboard')
  // }

  return (
    <AdminLayoutWrapper
      user={{
        name:
          data.user.user_metadata?.full_name || data.user.email || "Admin",
        email: data.user.email || "",
        avatar: data.user.user_metadata?.avatar_url || "/avatars/admin.jpg",
      }}
    >
      {children}
    </AdminLayoutWrapper>
  );
}
