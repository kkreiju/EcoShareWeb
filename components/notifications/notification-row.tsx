"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { CheckCheck, Clock, Eye } from "lucide-react";

interface Notification {
  notif_id: string;
  notif_message: string;
  notif_isRead: boolean;
  notif_dateTime: string;
  tran_id: string;
}

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNotificationClick?: (notification: Notification) => void;
  onReviewRequest?: (notification: Notification) => void;
  isMobile?: boolean;
}

const formatTimestamp = (timestamp: string) => {
  try {
    if (!timestamp) {
      return 'Recently';
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return 'Recently';
    }

    return formatDate(date);
  } catch (error) {
    return 'Recently';
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Handle future dates
  if (diffMs < 0) {
    return 'Just now';
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export function NotificationRow({ notification, onMarkAsRead, onNotificationClick, onReviewRequest, isMobile = false }: NotificationRowProps) {
  // Check if this is a review request notification
  const isReviewRequest = 
    notification.notif_message.toLowerCase().includes('request your listing') ||
    notification.notif_message.toLowerCase().includes('has request') ||
    notification.notif_message.toLowerCase().includes('requested your listing');

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div 
        className={`p-4 border-b last:border-b-0 transition-colors duration-200 ${
          !notification.notif_isRead
            ? 'bg-blue-50/30 dark:bg-blue-950/30'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {!notification.notif_isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(notification.notif_dateTime)}
                </span>
              </div>
            </div>

            <p className="text-foreground text-sm leading-relaxed mb-3">
              {notification.notif_message}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Review Request Button */}
              {isReviewRequest && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewRequest?.(notification);
                  }}
                  className="h-8 px-2 text-xs hover:bg-muted"
                  title="Review request"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Review
                </Button>
              )}

              {/* Mark as Read Button */}
              {!notification.notif_isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.notif_id);
                  }}
                  className="h-8 px-2 text-xs hover:bg-muted"
                  title="Mark as read"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Table Layout
  return (
    <TableRow
      className={`transition-colors duration-200 ${
        !notification.notif_isRead
          ? 'bg-blue-50/30 border-l-4 border-l-blue-500 dark:bg-blue-950/30'
          : ''
      }`}
    >
      {/* Main Content */}
      <TableCell className="py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {!notification.notif_isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-foreground text-sm leading-relaxed mt-1 line-clamp-2">
              {notification.notif_message}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Timestamp */}
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(notification.notif_dateTime)}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Review Request Button */}
          {isReviewRequest && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onReviewRequest?.(notification);
              }}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Review request"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {/* Mark as Read Button */}
          {!notification.notif_isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.notif_id);
              }}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Mark as read"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
