"use client";

export function TransactionManagementSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
          <div className="w-8 h-8 bg-muted rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-48" />
            </div>
            <div className="h-3 bg-muted rounded animate-pulse w-32" />
          </div>
          <div className="h-6 bg-muted rounded animate-pulse w-16" />
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded animate-pulse w-16" />
              <div className="h-3 bg-muted rounded animate-pulse w-20" />
            </div>
          </div>
          <div className="h-3 bg-muted rounded animate-pulse w-16" />
          <div className="w-8 h-8 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
