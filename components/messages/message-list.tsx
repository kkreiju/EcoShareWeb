"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Message } from "./MessagesView";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {messages.map((m, index) => {
          const isMe = m.senderId === currentUserId;
          // Use a stable key that doesn't change during optimistic updates
          const stableKey = `${m.senderId}_${m.content}_${m.timestamp}_${index}`;
          return (
            <div
              key={stableKey}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                  isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <p className="break-words whitespace-pre-wrap">{m.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px] opacity-70",
                    isMe ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default MessageList;
