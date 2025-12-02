"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Message } from "./hooks/use-messages";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
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
                  isMe ? "bg-primary text-primary-foreground" : "bg-muted",
                  m.status === 'sending' && "opacity-70"
                )}
              >
                <p className="break-words whitespace-pre-wrap">{m.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px] opacity-70",
                    isMe ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {/* API returns formatted time like "2:30 PM", display as-is */}
                  {m.status === 'sending' ? (
                    <span className="flex items-center gap-1">
                      Sending...
                    </span>
                  ) : (
                    m.timestamp
                  )}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

export default MessageList;
