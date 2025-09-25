"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationRow } from "./notification-row";
import { NotificationEmptyState } from "./notification-empty-state";

interface Notification {
  notif_id: string;
  notif_message: string;
  notif_isRead: boolean;
  notif_dateTime: string;
  tran_id: string;
}

interface NotificationTableProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isLoading?: boolean;
}

export function NotificationTable({ notifications, onMarkAsRead, isLoading = false }: NotificationTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.notif_id}
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
                    <TableHead className="hidden md:table-cell w-32">Time</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <NotificationRow
                      key={notification.notif_id}
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

export function NotificationTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Mobile Card View Skeleton */}
        <div className="block md:hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-border last:border-b-0 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header with blue dot and timestamp */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  {/* Notification message */}
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5 mb-3" />
                  {/* Mark read button */}
                  <Skeleton className="h-7 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View Skeleton */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-0">Notification</TableHead>
                <TableHead className="hidden md:table-cell w-32">Time</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index} className="border-border hover:bg-muted/30">
                  {/* Main Content */}
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        </div>
                        <Skeleton className="h-4 w-full mt-1 mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </TableCell>
                  {/* Timestamp */}
                  <TableCell className="hidden md:table-cell py-4">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-8 w-8 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
