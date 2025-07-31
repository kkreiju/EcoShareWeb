"use client";

import { useState, useEffect } from "react";
import { MessageList } from "./message-list";
import { MessageChat, Message, User } from "./message-chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, ArrowLeft } from "lucide-react";

// Mock data - replace with actual API calls
const mockConversations = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Sarah Johnson",
      avatar: "/images/img_avatar1.png",
    },
    lastMessage: {
      content: "Hi! Is the compost still available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      senderId: "user1",
    },
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Mike Chen",
      avatar: "/images/img_avatar2.png",
    },
    lastMessage: {
      content: "Thanks for the vegetables! My garden will love them.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      senderId: "user2",
    },
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Emma Wilson",
      avatar: "/images/img_avatar3.png",
    },
    lastMessage: {
      content: "Perfect! I'll pick them up tomorrow morning.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      senderId: "current-user",
    },
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "msg1",
      content: "Hello! I saw your listing for organic compost. Is it still available?",
      senderId: "user1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: "text",
      status: "read",
    },
    {
      id: "msg2",
      content: "Yes, it's still available! It's a mix of kitchen scraps and yard waste, perfect for garden beds.",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      type: "text",
      status: "read",
    },
    {
      id: "msg3",
      content: "That sounds perfect! When would be a good time to pick it up?",
      senderId: "user1",
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      type: "text",
      status: "read",
    },
    {
      id: "msg4",
      content: "I'm available this afternoon after 3 PM or tomorrow morning. What works better for you?",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      type: "text",
      status: "read",
    },
    {
      id: "msg5",
      content: "Hi! Is the compost still available?",
      senderId: "user1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: "text",
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "msg6",
      content: "Thank you so much for the fresh vegetables!",
      senderId: "user2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      type: "text",
      status: "read",
    },
    {
      id: "msg7",
      content: "You're very welcome! I'm glad they'll be put to good use.",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
      type: "text",
      status: "read",
    },
    {
      id: "msg8",
      content: "Thanks for the vegetables! My garden will love them.",
      senderId: "user2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "text",
      status: "read",
    },
  ],
  "3": [
    {
      id: "msg9",
      content: "Hi Emma! The tomatoes are ready for pickup whenever you're available.",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
      type: "text",
      status: "read",
    },
    {
      id: "msg10",
      content: "Perfect! I'll pick them up tomorrow morning.",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "text",
      status: "read",
    },
  ],
};

interface MessagingInterfaceProps {
  currentUserId?: string;
}

export function MessagingInterface({ currentUserId = "current-user" }: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(mockMessages);

  const selectedConversation = selectedConversationId
    ? {
        id: selectedConversationId,
        user: {
          ...conversations.find(c => c.id === selectedConversationId)!.user,
          isOnline: conversations.find(c => c.id === selectedConversationId)!.isOnline,
          lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago for offline users
        },
        messages: messages[selectedConversationId] || [],
      }
    : null;

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (content: string, type: "text" | "image" | "file" = "text") => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: currentUserId,
      timestamp: new Date(),
      type,
      status: "sent",
    };

    // Add message to the conversation
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }));

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date(),
                senderId: currentUserId,
              },
            }
          : conv
      )
    );

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId]?.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        ) || [],
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId]?.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        ) || [],
      }));
    }, 3000);
  };

  const handleMarkAsRead = (messageIds: string[]) => {
    if (!selectedConversationId) return;

    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: prev[selectedConversationId]?.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, status: "read" } : msg
      ) || [],
    }));
  };

  return (
    <div className="h-full flex relative">
      {/* Desktop Sidebar - Message List */}
      <div className="hidden md:flex w-80 lg:w-96 border-r border-border flex-shrink-0">
        <MessageList
          conversations={conversations}
          selectedConversationId={selectedConversationId || undefined}
          onSelectConversation={handleSelectConversation}
          currentUserId={currentUserId}
        />
      </div>

      {/* Mobile: Show Message List OR Chat based on selection */}
      <div className="flex md:hidden w-full">
        {!selectedConversation ? (
          // Show message list on mobile when no conversation is selected
          <div className="w-full">
            <MessageList
              conversations={conversations}
              selectedConversationId={selectedConversationId || undefined}
              onSelectConversation={handleSelectConversation}
              currentUserId={currentUserId}
            />
          </div>
        ) : (
          // Show chat on mobile when conversation is selected
          <div className="w-full flex flex-col">
            {/* Mobile Header with Back Button */}
            <div className="flex items-center gap-2 p-3 border-b border-border bg-background">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversationId(null)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {selectedConversation.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  {selectedConversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 border border-background rounded-full" />
                  )}
                </div>
                <span className="font-medium text-sm">{selectedConversation.user.name}</span>
              </div>
            </div>
            
            <MessageChat
              conversation={selectedConversation}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        )}
      </div>

      {/* Desktop: Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col min-w-0">
        {selectedConversation ? (
          <MessageChat
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Welcome to EcoShare Messages
                </h3>
                <p className="text-sm text-muted-foreground px-4">
                  Select a conversation from the sidebar to start chatting, or connect 
                  with other users through listings to begin new conversations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
