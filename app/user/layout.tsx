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
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
