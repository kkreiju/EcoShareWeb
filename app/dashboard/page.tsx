import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Main from "@/components/dashboard/main";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Main />
    </div>
  );
}
