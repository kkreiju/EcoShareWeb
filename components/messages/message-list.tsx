"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  isOnline: boolean;
}

interface MessageListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export function MessageList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conversation) =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h2 className="text-base md:text-lg font-semibold">Messages</h2>
          {conversations.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
            </Badge>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
            <Users className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-medium text-muted-foreground mb-2">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground px-4">
              {searchQuery 
                ? "Try searching for a different name"
                : "Start a conversation by responding to a listing"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-1 md:p-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversationId === conversation.id
                    ? "bg-muted border-primary"
                    : "border-transparent"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <CardContent className="p-2 md:p-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback className="text-xs md:text-sm">
                          {conversation.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm md:text-base font-medium truncate pr-2">
                          {conversation.user.name}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(conversation.lastMessage.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm text-muted-foreground truncate pr-2">
                          {conversation.lastMessage.senderId === currentUserId && "You: "}
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs flex-shrink-0">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
