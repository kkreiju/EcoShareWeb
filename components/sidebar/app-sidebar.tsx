"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Bell,
  GalleryVerticalEnd,
  Home,
  List,
  MessageCircle,
  Search,
  Leaf,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "EcoShare",
      logo: GalleryVerticalEnd,
      plan: "Community",
    },
  ],
  nutrientAssistant: [
    {
      title: "Nutrient Assistant",
      url: "/user/nutrient-assistant",
      icon: Leaf,
    },
  ],
  mainNav: [
    {
      title: "Home",
      url: "/user/dashboard",
      icon: Home,
    },
    {
      title: "Listings",
      url: "/user/listings",
      icon: List,
    },
    {
      title: "Nearby Listings",
      url: "/user/nearby-listings",
      icon: Search,
      premium: true,
    },
    {
      title: "Messages",
      url: "/user/messages",
      icon: MessageCircle,
    },
    {
      title: "Notifications",
      url: "/user/notifications",
      icon: Bell,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar: string; membershipStatus?: string };
}) {
  const { userId, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = user || data.user;

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        const response = await fetch(`/api/notification/get-notification?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const count = (data.data || []).filter((n: any) => !n.notif_isRead).length;
            setUnreadCount(count);
          }
        }
      } catch (error) {
        console.error('Error fetching unread notification count:', error);
      }
    };

    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);

  // Filter navigation items based on membership status
  const isPremium = user?.membershipStatus?.toLowerCase() === "premium";
  const filteredMainNav = data.mainNav.filter(item => !item.premium || isPremium);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.nutrientAssistant}
          groupLabel="Nutrient Assistant"
        />
        <NavMain items={filteredMainNav} groupLabel="Main Menu" unreadCount={unreadCount} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
