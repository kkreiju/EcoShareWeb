"use client";

interface NotificationStatsProps {
  totalCount: number;
  unreadCount: number;
}

export function NotificationStats({ totalCount, unreadCount }: NotificationStatsProps) {
  if (totalCount === 0) return null;

  const readCount = totalCount - unreadCount;

  return (
    <div className="flex justify-center px-4">
      {/* Mobile Stats */}
      <div className="block sm:hidden w-full">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-foreground">{totalCount}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">{unreadCount}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg px-2 py-2">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">{readCount}</div>
            <div className="text-xs text-muted-foreground">Read</div>
          </div>
        </div>
      </div>

      {/* Desktop Stats */}
      <div className="hidden sm:flex sm:items-center sm:gap-4 sm:text-sm sm:text-muted-foreground sm:bg-muted/50 sm:rounded-lg sm:px-4 sm:py-2">
        <span>Total: {totalCount}</span>
        <span>•</span>
        <span>Unread: {unreadCount}</span>
        <span>•</span>
        <span>Read: {readCount}</span>
      </div>
    </div>
  );
}
