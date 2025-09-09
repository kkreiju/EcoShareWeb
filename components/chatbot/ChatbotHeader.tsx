"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bot } from "lucide-react";

interface ChatbotHeaderProps {
  isTyping: boolean;
  isFindListingMode: boolean;
}

export function ChatbotHeader({ isTyping, isFindListingMode }: ChatbotHeaderProps) {
  return (
    <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <SheetTitle className="text-lg font-semibold">EcoShare Assistant</SheetTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {isTyping ? "Typing..." : "Ready to help"}
            </span>
            {isFindListingMode && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                🔍 Find Mode
              </span>
            )}
          </div>
        </div>
      </div>
    </SheetHeader>
  );
}
