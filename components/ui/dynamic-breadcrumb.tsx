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
  "/user/subscription-history": "Subscription History",
  "/user/transaction-management": "Transaction Management",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Check if we're on a listing detail page
  const isListingDetail = pathname.startsWith('/user/listing/') && pathname !== '/user/listing';

  let currentPageName = routeNames[pathname] || "Page";

  // Handle listing detail pages
  if (isListingDetail) {
    currentPageName = "Listing Details";
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/user/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/user/dashboard" && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            {isListingDetail ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/user/listings">Listings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
