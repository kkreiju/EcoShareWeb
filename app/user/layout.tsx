import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <SidebarProvider>
      <AppSidebar user={{
        name: data.user.user_metadata?.full_name || data.user.email || 'User',
        email: data.user.email || '',
        avatar: data.user.user_metadata?.avatar_url || '/avatars/default.jpg'
      }} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
