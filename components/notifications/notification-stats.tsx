"use client";

interface NotificationStatsProps {
  totalCount: number;
  unreadCount: number;
}

export function NotificationStats({ totalCount, unreadCount }: NotificationStatsProps) {
  if (totalCount === 0) return null;

  const readCount = totalCount - unreadCount;

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
        <span>Total: {totalCount}</span>
        <span>•</span>
        <span>Unread: {unreadCount}</span>
        <span>•</span>
        <span>Read: {readCount}</span>
      </div>
    </div>
  );
}
