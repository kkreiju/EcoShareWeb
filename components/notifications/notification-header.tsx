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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Notifications
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Stay updated with your latest activities and messages
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
              {unreadCount} unread
            </Badge>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="w-full sm:w-auto justify-center sm:justify-start"
        >
          <CheckCheck className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Mark All as Read</span>
        </Button>
      </div>
    </div>
  );
}
