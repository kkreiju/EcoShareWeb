"use client"

import * as React from "react"
import {
  AudioWaveform,
  BarChart3,
  Command,
  FileText,
  GalleryVerticalEnd,
  Home,
  Settings,
  Shield,
  Users,
} from "lucide-react"

import { NavMainAdmin } from "@/components/sidebar-admin/nav-main-admin"
import { NavUserAdmin } from "@/components/sidebar-admin/nav-user-admin"
import { TeamSwitcherAdmin } from "@/components/sidebar-admin/team-switcher-admin"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin sidebar data
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "EcoShare Admin",
      logo: Shield,
      plan: "Admin Panel",
    },
    {
      name: "Analytics",
      logo: BarChart3,
      plan: "Reports",
    },
    {
      name: "Management",
      logo: Settings,
      plan: "Control",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebarAdmin({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user?: { name: string; email: string; avatar: string } }) {
  const userData = user || data.user;
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcherAdmin teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMainAdmin items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUserAdmin user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
