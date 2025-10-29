"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  groupLabel,
  unreadCount,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
  groupLabel?: string;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname === item.url}
            >
              <a href={item.url} className="flex items-center gap-2">
                {item.icon && <item.icon />}
                <span className="flex-1">{item.title}</span>
                {item.title === "Notifications" && (unreadCount ?? 0) > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {(unreadCount ?? 0) > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
