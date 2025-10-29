"use client";

import { type LucideIcon, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
    premium?: boolean;
  }[];
  groupLabel?: string;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.premium ? (
              <SidebarMenuButton
                tooltip={`${item.title} (Premium)`}
                onClick={() => router.push("/user/subscription")}
                className="opacity-60 hover:opacity-100"
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon />}
                  <span className="flex-1">{item.title}</span>
                  <Lock className="h-3 w-3 ml-auto text-amber-500" />
                </div>
              </SidebarMenuButton>
            ) : (
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
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
