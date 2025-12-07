"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotMessages, ChatMessage } from "./ChatbotMessages";
import { ChatbotInput } from "./ChatbotInput";
import { ChatbotService } from "@/lib/services/chatbotService";
import { useAuth } from "@/hooks/use-auth";
import { Listing } from "@/lib/types";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Storage key for chat messages
const CHAT_MESSAGES_KEY = "ecoshare_chatbot_messages";

export function Chatbot() {
  const { user, userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const sessionIdentifier = userId || user?.id || "anonymous";
  const storageKey = `${CHAT_MESSAGES_KEY}-${sessionIdentifier}`;

  // Load saved messages from localStorage on mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        } else {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: "👋 Hi! I'm your EcoShare assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading chat messages:", error);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "👋 Hi! I'm your EcoShare assistant. How can I help you today?",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setMessagesLoaded(true);
      }
    };

    setMessagesLoaded(false);
    loadMessages();
  }, [storageKey]);

  // Save messages to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (!messagesLoaded) {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  }, [messages, messagesLoaded, storageKey]);

  // Fetch user data including membership status
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && user?.email) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("User")
            .select("user_id, user_email, user_membershipStatus")
            .eq("user_email", user.email)
            .single();

          if (!error && data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId, user?.email]);


  const fetchListingById = async (listingId: string): Promise<Listing | null> => {
    try {
      const response = await fetch("/api/listing/view-listing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.statusText}`);
      }

      const data = await response.json();
      const listings = data.data || [];

      // Find the specific listing by ID
      const foundListing = listings.find((l: Listing) => l.list_id === listingId);
      
      if (foundListing) {
        // Transform the listing data similar to mobile app
        return {
          ...foundListing,
          location: foundListing.locationName?.trim() || "Unknown location",
          images: foundListing.images || (foundListing.imageURL ? [foundListing.imageURL] : []),
          rating: foundListing.User?.ratings ? Number(foundListing.User.ratings) : 0,
          description: foundListing.description || "",
        };
      }

      return null;
    } catch (error) {
      console.warn(`Failed to fetch listing ${listingId}:`, error);
      return null;
    }
  };

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
      const sessionId = sessionIdentifier;
      const resolvedUserId = userId || user?.id || "anonymous";
      const response = await ChatbotService.sendMessage(
        trimmed,
        sessionId,
        resolvedUserId
      );

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Handle listings data if present
      if (response.listings) {
        // Check if user is premium before showing listings
        const isPremium = userData?.user_membershipStatus?.toLowerCase() === "premium";
        
        if (!isPremium) {
          // Show premium upsell message for free users
          const premiumMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "🌟 The 'Find Listings' feature is exclusive to Premium members. Upgrade your account to get personalized listing recommendations!",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, premiumMessage]);
        } else {
          // Premium user - proceed with showing listings
          try {
            const listingIds = JSON.parse(response.listings);
            if (Array.isArray(listingIds) && listingIds.length > 0) {
              // Fetch full listing data for each ID
              const fetchedListings: Listing[] = [];
              for (const listingId of listingIds) {
                const listing = await fetchListingById(listingId);
                if (listing && listing.quantity > 0) {
                  fetchedListings.push(listing);
                }
              }

              if (fetchedListings.length > 0) {
                // Create a message with listings attached
                const listingsMessage: ChatMessage = {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: `I found ${fetchedListings.length} relevant listing${
                    fetchedListings.length > 1 ? "s" : ""
                  } for you:`,
                  timestamp: new Date(),
                  listings: fetchedListings,
                };
                setMessages((prev) => [...prev, listingsMessage]);
              }
            }
          } catch (parseError) {
            console.warn("Failed to parse listings data:", parseError);
          }
        }
      }
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

  const handleClearHistory = () => {
    // Clear messages and reset to welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your EcoShare assistant. How can I help you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // Clear localStorage for the current user
    try {
      localStorage.removeItem(storageKey);
      toast.success("Chat history cleared", {
        description: "Your conversation history has been cleared.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
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

      <SheetContent side="right" className="w-full sm:w-[380px] md:w-[400px] p-0 flex flex-col">
        <ChatbotHeader
          isTyping={isTyping}
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
          onClearConversation={handleClearHistory}
          isTyping={isTyping}
        />
      </SheetContent>
    </Sheet>
  );
}

export default Chatbot;
