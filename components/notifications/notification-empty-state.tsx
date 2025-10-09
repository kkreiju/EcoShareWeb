"use client";

import { Bell } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No notifications yets
      </h3>
      <p className="text-muted-foreground text-center max-w-sm">
        When you receive messages, likes, or other activities, they'll appear here.
      </p>
    </div>
  );
}
