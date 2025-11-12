"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Header Content */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Stay updated with your latest activities and messages
            </p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex sm:items-center gap-3">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
                {unreadCount} unread
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              className="shrink-0"
            >
              <CheckCheck className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Mark All as Read</span>
            </Button>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center justify-between gap-3">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
              {unreadCount} unread
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1"
          >
            <CheckCheck className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Mark All as Read</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
