"use client";

import * as React from "react";
import {
  BookOpen,
  Building2,
  FileText,
  HelpCircle,
  Info,
  MessageSquare,
  Newspaper,
  Shield,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const docsNav = [
  {
    title: "About",
    items: [
      {
        title: "About Us",
        url: "/docs/about-us",
        icon: Info,
      },
      {
        title: "Our Mission",
        url: "/docs/our-mission",
        icon: Building2,
      },
      {
        title: "Team",
        url: "/docs/team",
        icon: Users,
      },
      {
        title: "Press",
        url: "/docs/press",
        icon: Newspaper,
      },
      {
        title: "Blog",
        url: "/docs/blog",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        url: "/docs/help-center",
        icon: HelpCircle,
      },
      {
        title: "Contact Us",
        url: "/docs/contact-us",
        icon: MessageSquare,
      },
      {
        title: "FAQs",
        url: "/docs/faqs",
        icon: FileText,
      },
      {
        title: "Community Guidelines",
        url: "/docs/community-guidelines",
        icon: Shield,
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        title: "Privacy Policy",
        url: "/docs/privacy-policy",
        icon: Shield,
      },
      {
        title: "Terms of Use",
        url: "/docs/terms-of-use",
        icon: FileText,
      },
    ],
  },
];

export function DocsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Documentation</h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about EcoShare
          </p>
        </div>
        {docsNav.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

// Export as AppSidebar for backward compatibility
export const AppSidebar = DocsSidebar;

