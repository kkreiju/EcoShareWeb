"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessages, ChatMessage } from "./ChatbotMessages";
import { ChatbotInput } from "./ChatbotInput";
import { ChatbotService } from "@/lib/chatbotService";
import { toast } from "sonner";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your EcoShare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFindListingMode, setIsFindListingMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update welcome message when find listing mode changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      const welcomeMessage = isFindListingMode
        ? "🔍 I'm in Find Listing mode! Ask me to help you find specific items or browse categories."
        : "👋 Hi! I'm your EcoShare assistant. How can I help you today?";
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isFindListingMode]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await ChatbotService.sendMessage(trimmed);

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error getting chatbot response:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get response from chatbot";
      setError(errorMessage);

      // Show error message to user
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
      toast.error("Failed to get response from chatbot", {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Allow Shift+Enter for new line (default textarea behavior)
  };

  const handleToggleFindMode = () => {
    setIsFindListingMode(!isFindListingMode);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 z-50"
          aria-label="Open EcoShare Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <ChatbotHeader
          isTyping={isTyping}
          isFindListingMode={isFindListingMode}
        />
        <ChatbotMessages messages={messages} isTyping={isTyping} />
        {error && (
          <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
            <p className="text-xs text-destructive text-center">{error}</p>
          </div>
        )}
        <ChatbotInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          isFindListingMode={isFindListingMode}
          onToggleFindMode={handleToggleFindMode}
          isTyping={isTyping}
        />
      </SheetContent>
    </Sheet>
  );
}

export default Chatbot;
