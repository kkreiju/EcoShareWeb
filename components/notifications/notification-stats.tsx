"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface NotificationStatsProps {
  totalCount: number;
  unreadCount: number;
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
}

export function NotificationStats({ totalCount, unreadCount, currentPage = 1, itemsPerPage = 10, totalPages = 1 }: NotificationStatsProps) {
  if (totalCount === 0) return null;

  const readCount = totalCount - unreadCount;

  // Calculate current page info
  const startItem = currentPage && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const endItem = currentPage && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalCount) : totalCount;

  return (
    <div className="flex justify-center px-4">
      {/* Mobile Stats */}
      <div className="block sm:hidden w-full space-y-3">
        {/* Page Info */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalCount} notifications
          {totalPages && totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-foreground">{totalCount}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">{unreadCount}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">{readCount}</div>
            <div className="text-xs text-muted-foreground">Read</div>
          </div>
        </div>
      </div>

      {/* Desktop Stats */}
      <div className="hidden sm:flex sm:flex-col sm:gap-2 sm:bg-muted/50 sm:rounded-lg sm:px-4 sm:py-3">
        {/* Page Info */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalCount} notifications
          {totalPages && totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Total: {totalCount}</span>
          <span>•</span>
          <span>Unread: {unreadCount}</span>
          <span>•</span>
          <span>Read: {readCount}</span>
        </div>
      </div>
    </div>
  );
}

export function NotificationStatsSkeleton() {
  return (
    <div className="flex justify-center px-4">
      {/* Mobile Stats Skeleton */}
      <div className="block sm:hidden w-full">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg px-2 py-2">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg px-2 py-2">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg px-2 py-2">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        </div>
      </div>

      {/* Desktop Stats Skeleton */}
      <div className="hidden sm:flex sm:items-center sm:gap-4 sm:text-sm sm:text-muted-foreground sm:bg-muted/50 sm:rounded-lg sm:px-4 sm:py-2">
        <Skeleton className="h-4 w-16" />
        <span>•</span>
        <Skeleton className="h-4 w-20" />
        <span>•</span>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
