"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ConversationListSkeletonProps {
  query?: string;
  onQueryChange?: (value: string) => void;
}

export function ConversationListSkeleton({ query = "", onQueryChange }: ConversationListSkeletonProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Functional search bar */}
      <div className="p-3 border-b">
        <Input
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search conversations..."
        />
      </div>

      {/* Conversation items skeleton */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-full px-3 py-2 flex items-center gap-3"
            >
              {/* Avatar skeleton */}
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />

              {/* Content skeleton */}
              <div className="flex-1 min-w-0 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Timestamp and badge skeleton */}
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-3 w-12" />
                {/* Unread count badge - show for some items */}
                {index % 4 === 0 && (
                  <Skeleton className="h-5 w-6 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, index) => {
          // Alternate between sent and received messages
          const isSent = index % 2 === 1;

          return (
            <div
              key={index}
              className={cn("flex", isSent ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 shadow-sm",
                  isSent ? "bg-primary" : "bg-muted"
                )}
              >
                {/* Message content skeleton - vary length */}
                <Skeleton
                  className={cn(
                    "h-4 mb-1",
                    index % 3 === 0 ? "w-48" : index % 3 === 1 ? "w-32" : "w-64"
                  )}
                />
                {/* Show second line for some messages */}
                {index % 4 === 0 && (
                  <Skeleton className="h-4 w-24 mb-1" />
                )}
                {/* Timestamp skeleton */}
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      {/* User info skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-36" />
      </div>
    </div>
  );
}
