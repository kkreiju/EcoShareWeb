"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNames: Record<string, string> = {
  "/user/dashboard": "Dashboard",
  "/user/listings": "Listings",
  "/user/messages": "Messages",
  "/user/notifications": "Notifications",
  "/user/nearby-listings": "Nearby Listings",
  "/user/account-settings": "Account Settings",
  "/user/nutrient-assistant": "Nutrient Assistant",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const currentPageName = routeNames[pathname] || "Page";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/user/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/user/dashboard" && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
