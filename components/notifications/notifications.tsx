"use client";

import { useState, useEffect } from "react";
import { NotificationHeader } from "./notification-header";
import { NotificationTable, NotificationTableSkeleton } from "./notification-table";
import { NotificationStats, NotificationStatsSkeleton } from "./notification-stats";
import { ReviewRequestsModal } from "@/components/listings/review-requests-modal";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
        // Sort notifications by date descending (newest first)
        const sortedNotifications = (data.data || []).sort((a: Notification, b: Notification) => {
          return new Date(b.notif_dateTime).getTime() - new Date(a.notif_dateTime).getTime();
        });
        setNotifications(sortedNotifications);
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

  const handleNotificationClick = async (notification: Notification) => {
    // First mark the notification as read if it's unread
    if (!notification.notif_isRead) {
      await markAsRead(notification.notif_id);
    }

    // Check if this is a review request notification based on the message content
    const isReviewRequest = notification.notif_message.toLowerCase().includes('review') || 
                           notification.notif_message.toLowerCase().includes('request') ||
                           notification.tran_id; // Has transaction ID

    if (isReviewRequest) {
      // Open the review requests modal
      setIsReviewRequestsModalOpen(true);
      toast.success("Opening review requests...", {
        duration: 2000,
      });
    } else {
      // For other notification types, you can add different handling here
      toast.info("Notification opened", {
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <NotificationHeader
          unreadCount={0}
          onMarkAllAsRead={() => {}}
        />

        <NotificationTableSkeleton />

        <NotificationStatsSkeleton />
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
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onNotificationClick={handleNotificationClick}
        isLoading={isLoading}
      />

      <NotificationStats
        totalCount={notifications.length}
        unreadCount={unreadCount}
      />

      <ReviewRequestsModal
        isOpen={isReviewRequestsModalOpen}
        onOpenChange={setIsReviewRequestsModalOpen}
      />
    </div>
  );
}
