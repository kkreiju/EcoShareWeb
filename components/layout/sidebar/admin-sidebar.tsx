"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  FileText,
  GalleryVerticalEnd,
  Home,
  Shield,
  Users,
} from "lucide-react";

import { NavMainAdmin } from "./nav-main-admin";
import { NavUserAdmin } from "./nav-user-admin";
import { TeamSwitcherAdmin } from "./team-switcher-admin";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
  ],
};

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar: string };
}) {
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
  );
}

// Export as AppSidebarAdmin for backward compatibility
export const AppSidebarAdmin = AdminSidebar;

