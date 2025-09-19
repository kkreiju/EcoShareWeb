"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { CheckCheck, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "like" | "follow" | "listing" | "review";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  userName?: string;
  listingTitle?: string;
}

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMobile?: boolean;
}

export function NotificationRow({ notification, onMarkAsRead, isMobile = false }: NotificationRowProps) {
  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className={`p-4 border-b last:border-b-0 ${
        !notification.isRead
          ? 'bg-blue-50/30 dark:bg-blue-950/30'
          : 'hover:bg-muted/50'
      }`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {notification.avatar && (
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={notification.avatar} />
              <AvatarFallback className="text-sm">
                {notification.userName?.[0] || notification.title[0]}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground text-sm">
                  {notification.title}
                </h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {notification.message}
            </p>

            {/* User and Listing Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.userName && (
                  <span className="text-xs text-muted-foreground">
                    {notification.userName}
                  </span>
                )}
                {notification.listingTitle && (
                  <span className="text-xs text-muted-foreground">
                    • {notification.listingTitle}
                  </span>
                )}
              </div>

              {/* Mark as Read Button */}
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
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
      className={`${
        !notification.isRead
          ? 'bg-blue-50/30 border-l-4 border-l-blue-500 hover:bg-blue-50/50 dark:bg-blue-950/30'
          : 'hover:bg-muted/50'
      }`}
    >
      {/* Main Content */}
      <TableCell className="py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Details Column (User/Listing) */}
      <TableCell className="hidden lg:table-cell py-4">
        <div className="flex items-center gap-2">
          {notification.avatar && (
            <Avatar className="w-6 h-6">
              <AvatarImage src={notification.avatar} />
              <AvatarFallback className="text-xs">
                {notification.userName?.[0]}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0">
            {notification.userName && (
              <div className="text-sm font-medium text-foreground truncate">
                {notification.userName}
              </div>
            )}
            {notification.listingTitle && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground truncate">
                  • {notification.listingTitle}
                </span>
              </div>
            )}
          </div>
        </div>
      </TableCell>

      {/* Timestamp */}
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {notification.timestamp}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-4 text-right">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Mark as read"
          >
            <CheckCheck className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
