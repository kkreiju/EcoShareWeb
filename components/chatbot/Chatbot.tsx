"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessages, ChatMessage } from "./ChatbotMessages";
import { ChatbotInput } from "./ChatbotInput";


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

  // Update welcome message when find listing mode changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
      const welcomeMessage = isFindListingMode
        ? "🔍 I'm in Find Listing mode! Ask me to help you find specific items or browse categories."
        : "👋 Hi! I'm your EcoShare assistant. How can I help you today?";
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
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

    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      const findListingResponses = [
        "🔍 I'm searching for listings that match your criteria...",
        "Let me help you find the perfect item! What type of listing are you looking for?",
        "I can help you browse available listings. What category interests you?",
        "Great! I can search our database for items matching your description.",
      ];

      const generalResponses = [
        "Thanks for your question! Let me help you with that.",
        "That's a great question about EcoShare. Here's what I can tell you:",
        "I understand you're looking for information about our platform. Let me assist you.",
        "Great question! EcoShare is designed to make sharing resources easy and sustainable.",
      ];

      const responses = isFindListingMode ? findListingResponses : generalResponses;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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
        <ChatbotHeader isTyping={isTyping} isFindListingMode={isFindListingMode} />
        <ChatbotMessages messages={messages} isTyping={isTyping} />
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
