"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { ListingCard } from "@/components/dashboard/listing-card";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  listings?: Listing[];
}

interface ChatbotMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatbotMessages({ messages, isTyping }: ChatbotMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleViewDetails = (listing: Listing) => {
    router.push(`/user/listing/${listing.list_id}`);
  };

  const handleContact = (listing: Listing) => {
    // Navigate to messages or open contact dialog
    console.log("Contact listing owner:", listing.list_id);
  };

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 py-2 h-[calc(100vh-240px)]">
      <div className="space-y-3 pr-1">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[75%] sm:max-w-[280px] p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm leading-relaxed break-words overflow-hidden prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="my-1 break-words" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold break-words" {...props} />,
                      ul: ({ node, ...props }) => <ul className="my-1 list-disc pl-4 break-words" {...props} />,
                      li: ({ node, ...props }) => <li className="my-0.5 break-words" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-secondary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Render listing cards if present */}
            {message.listings && message.listings.length > 0 && (
              <div className="space-y-2 px-4">
                {message.listings.map((listing) => (
                  <div key={listing.list_id} className="max-w-[85%] mx-auto">
                    <ListingCard
                      listing={listing}
                      onViewDetails={handleViewDetails}
                      onContact={handleContact}
                      hideContactButton={true}
                      isOwner={false}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
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
