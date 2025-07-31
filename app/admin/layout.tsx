import { AppSidebarAdmin } from "@/components/sidebar-admin/app-sidebar-admin"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DynamicBreadcrumbAdmin } from "@/components/ui/dynamic-breadcrumb-admin"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
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
    <SidebarProvider>
      <AppSidebarAdmin user={{
        name: data.user.user_metadata?.full_name || data.user.email || 'Admin',
        email: data.user.email || '',
        avatar: data.user.user_metadata?.avatar_url || '/avatars/admin.jpg'
      }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbAdmin />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
