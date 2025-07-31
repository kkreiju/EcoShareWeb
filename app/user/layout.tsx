import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const userData = await supabase
      .from('User')
                .select('user_id, user_email, user_firstName, user_middleName, user_lastName, user_isVerified, user_ratings, user_transactionCount, user_profileURL')
                .eq('user_email', data.user.email)
                .single();

  data.user.user_metadata = {
    full_name: userData.data?.user_firstName + ' ' + userData.data?.user_lastName,
    avatar_url: userData.data?.user_profileURL
  }

  return (
    <SidebarProvider>
      <AppSidebar user={{
        name: data.user.user_metadata?.full_name || 'User',
        email: data.user.email || '',
        avatar: data.user.user_metadata?.avatar_url || '/avatars/default.jpg'
      }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}