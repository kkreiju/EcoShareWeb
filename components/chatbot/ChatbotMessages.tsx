"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatbotMessages({ messages, isTyping }: ChatbotMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2 h-[calc(100vh-240px)]">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}

            <Card
              className={`max-w-[85%] sm:max-w-[280px] p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Card>

            {message.role === "user" && (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-secondary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <Card className="bg-muted max-w-[85%] sm:max-w-[280px] p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
