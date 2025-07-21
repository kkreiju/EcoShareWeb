import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  await supabase.auth.getClaims();

  return <main className="min-h-screen">{children}</main>;
}
