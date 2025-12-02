"use client";

import { useState, useEffect } from "react";
import { NotificationHeader } from "./notification-header";
import { NotificationTable, NotificationTableSkeleton } from "./notification-table";
import { ReviewRequestsModal } from "@/components/features/listings/review-requests-modal";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Notification interface matching API response
interface Notification {
  notif_id: string;
  notif_message: string;
  notif_isRead: boolean;
  notif_dateTime: string;
  tran_id: string;
}

export function Notifications() {
  const { userId, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewRequestsModalOpen, setIsReviewRequestsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch notifications when component mounts
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchNotifications();
    }
  }, [isAuthenticated, userId]);

  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/notification/get-notification?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Sort notifications: Unread first, then by date descending (newest first)
        const sortedNotifications = (data.data || []).sort((a: Notification, b: Notification) => {
          // First compare by read status (unread comes first)
          if (a.notif_isRead !== b.notif_isRead) {
            return a.notif_isRead ? 1 : -1;
          }
          // Then compare by date
          return new Date(b.notif_dateTime).getTime() - new Date(a.notif_dateTime).getTime();
        });
        setNotifications(sortedNotifications);

        // Reset to page 1 when notifications are refreshed
        setCurrentPage(1);
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.notif_isRead).length;

  // Pagination calculations
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  // Ensure current page is valid when notifications change
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageNotifications = notifications.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) return;

    try {
      const response = await fetch(`/api/notification/mark-all-as-read?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state - only mark the notifications that were actually marked as read by the API
        const updatedNotificationIds = (data.data || []).map((n: any) => n.notif_id);
        setNotifications(prev =>
          prev.map(notification =>
            updatedNotificationIds.includes(notification.notif_id)
              ? { ...notification, notif_isRead: true }
              : notification
          )
        );

        toast.success(`Successfully marked ${data.message.match(/\d+/)?.[0] || 'all'} notifications as read`, {
          duration: 3000,
        });
      } else {
        throw new Error(data.message || 'Failed to mark notifications as read');
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read", {
        description: error instanceof Error ? error.message : "Please try again.",
        duration: 4000,
      });
    }
  };

  const markAsRead = async (id: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/notification/read-notification?user_id=${userId}&notification_id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification.notif_id === id
              ? { ...notification, notif_isRead: true }
              : notification
          )
        );
      } else {
        throw new Error(data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Don't show toast for individual notification errors to avoid spam
    }
  };

  const handleReviewRequest = async (notification: Notification) => {
    // First mark the notification as read if it's unread
    if (!notification.notif_isRead) {
      await markAsRead(notification.notif_id);
    }

    // Open the review requests modal
    setIsReviewRequestsModalOpen(true);
    toast.success("Opening review requests...", {
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <NotificationHeader
          unreadCount={0}
          onMarkAllAsRead={() => { }}
        />

        <NotificationTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />

      <NotificationTable
        notifications={currentPageNotifications}
        onMarkAsRead={markAsRead}
        onReviewRequest={handleReviewRequest}
        isLoading={isLoading}
      />

      {/* Footer with pagination and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        {/* Left: Page info */}
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {startIndex + 1}-{Math.min(endIndex, notifications.length)} of {notifications.length} notifications
          {totalPages > 1 && ` (Page ${validCurrentPage} of ${totalPages})`}
        </div>

        {/* Center: Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2 order-1 sm:order-2">
          <span>Total: {notifications.length}</span>
          <span>•</span>
          <span>Unread: {unreadCount}</span>
          <span>•</span>
          <span>Read: {notifications.length - unreadCount}</span>
        </div>

        {/* Right: Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center sm:justify-end order-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, validCurrentPage - 1))}
                    className={validCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={validCurrentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, validCurrentPage + 1))}
                    className={validCurrentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <ReviewRequestsModal
        isOpen={isReviewRequestsModalOpen}
        onOpenChange={setIsReviewRequestsModalOpen}
      />
    </div>
  );
}
