"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotificationRow } from "./notification-row";
import { NotificationEmptyState } from "./notification-empty-state";

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

interface NotificationTableProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationTable({ notifications, onMarkAsRead }: NotificationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  isMobile={true}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-0">Notification</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-0">Details</TableHead>
                    <TableHead className="hidden md:table-cell w-32">Time</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      isMobile={false}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
