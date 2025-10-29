"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useEffect, useState } from "react";

interface UserLayoutWrapperProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatar: string;
    membershipStatus: string;
  };
}

export function UserLayoutWrapper({ children, user }: UserLayoutWrapperProps) {
  const { isOpen, isLoaded, setIsOpen } = useSidebarState();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component only fully renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use default sidebar state during SSR and initial render to prevent hydration mismatch
  const sidebarProps = isMounted && isLoaded 
    ? { open: isOpen, onOpenChange: setIsOpen }
    : { defaultOpen: true };

  return (
    <SidebarProvider {...sidebarProps}>
      <AppSidebar user={user} />
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
        <Chatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
