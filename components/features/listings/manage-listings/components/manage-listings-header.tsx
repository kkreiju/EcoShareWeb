"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddListingDialog } from "../../add-listing-dialog";

interface ManageListingsHeaderProps {
  isLoading: boolean;
  pendingRequestsCount: number;
  onRefresh: () => void;
  onReviewRequests: () => void;
  onListingCreated: () => void;
}

export function ManageListingsHeader({
  isLoading,
  pendingRequestsCount,
  onRefresh,
  onReviewRequests,
  onListingCreated,
}: ManageListingsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Manage Listings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage your eco-friendly items and services
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <AddListingDialog onListingCreated={onListingCreated}>
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Add Listing</span>
          </Button>
        </AddListingDialog>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/user/transaction-management")}
            className="border-border flex-1 sm:flex-initial justify-center sm:justify-start"
          >
            <Package className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate hidden sm:inline">Transactions</span>
            <span className="truncate sm:hidden">History</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReviewRequests}
            className="border-border flex-1 sm:flex-initial justify-center sm:justify-start relative"
          >
            <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate hidden sm:inline">Review Requests</span>
            <span className="truncate sm:hidden">Requests</span>
            {pendingRequestsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
              >
                {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-border flex-1 sm:flex-initial justify-center sm:justify-start"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 flex-shrink-0 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="truncate hidden sm:inline">Refresh</span>
            <span className="truncate sm:hidden">Sync</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

