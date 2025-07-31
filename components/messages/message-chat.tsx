"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface MessageChatProps {
  conversation: {
    id: string;
    user: User;
    messages: Message[];
  };
  currentUserId: string;
  onSendMessage: (content: string, type?: "text" | "image" | "file") => void;
  onMarkAsRead: (messageIds: string[]) => void;
}

export function MessageChat({
  conversation,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
}: MessageChatProps) {
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  useEffect(() => {
    // Mark messages as read when conversation is opened
    const unreadMessages = conversation.messages
      .filter(msg => msg.senderId !== currentUserId && msg.status !== "read")
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      onMarkAsRead(unreadMessages);
    }
  }, [conversation.messages, currentUserId, onMarkAsRead]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, "HH:mm");
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, "HH:mm")}`;
    } else {
      return format(timestamp, "MMM dd, HH:mm");
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = format(message.timestamp, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header - Hidden on mobile when parent already shows header */}
      <div className="hidden md:flex p-3 md:p-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={conversation.user.avatar} />
                <AvatarFallback className="text-xs md:text-sm">
                  {conversation.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {conversation.user.isOnline && (
                <div className="absolute bottom-0 right-0 h-2 w-2 md:h-3 md:w-3 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">{conversation.user.name}</h3>
              <p className="text-xs text-muted-foreground">
                {conversation.user.isOnline 
                  ? "Online" 
                  : conversation.user.lastSeen 
                    ? `Last seen ${formatDistanceToNow(conversation.user.lastSeen, { addSuffix: true })}`
                    : "Offline"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
              <Phone className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
              <Video className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
                  <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4"
      >
        {Object.entries(messageGroups).map(([dateKey, messages]) => (
          <div key={dateKey}>
            {/* Date Header */}
            <div className="flex justify-center mb-3 md:mb-4">
              <Badge variant="secondary" className="text-xs">
                {formatDateHeader(dateKey)}
              </Badge>
            </div>
            
            {/* Messages for this date */}
            <div className="space-y-1.5 md:space-y-2">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUserId;
                const showAvatar = !isCurrentUser && (
                  index === 0 || 
                  messages[index - 1].senderId !== message.senderId
                );

                return (
                  <div
                    key={message.id}
                    className={`flex gap-1.5 md:gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isCurrentUser && (
                      <div className="w-6 md:w-8 flex-shrink-0">
                        {showAvatar && (
                          <Avatar className="h-6 w-6 md:h-8 md:w-8">
                            <AvatarImage src={conversation.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {conversation.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isCurrentUser ? "order-1" : ""}`}>
                      {/* Reply context */}
                      {message.replyTo && (
                        <div className="mb-1">
                          <Card className="border-l-4 border-l-primary bg-muted/50">
                            <CardContent className="p-1.5 md:p-2">
                              <p className="text-xs text-muted-foreground">
                                {message.replyTo.senderName}
                              </p>
                              <p className="text-xs md:text-sm truncate">
                                {message.replyTo.content}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <Card 
                        className={`${
                          isCurrentUser 
                            ? "bg-primary text-primary-foreground ml-auto" 
                            : "bg-muted"
                        }`}
                      >
                        <CardContent className="p-2 md:p-3">
                          <p className="text-xs md:text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          
                          <div className={`flex items-center justify-between mt-1 gap-2 ${
                            isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            <span className="text-xs">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            
                            {isCurrentUser && (
                              <div className="flex items-center">
                                {message.status === "sent" && <Check className="h-3 w-3" />}
                                {message.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                                {message.status === "read" && <CheckCheck className="h-3 w-3 text-blue-500" />}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-3 md:px-4 py-2 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                Replying to {replyingTo.senderId === currentUserId ? "yourself" : conversation.user.name}
              </p>
              <p className="text-xs md:text-sm truncate">{replyingTo.content}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setReplyingTo(null)}
              className="text-xs px-2 py-1 h-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-2 md:p-4 border-t border-border bg-background/95 backdrop-blur">
        <div className="flex items-end gap-1.5 md:gap-2">
          <div className="flex gap-0.5 md:gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
              <Paperclip className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8">
              <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-8 md:pr-10 text-sm md:text-base h-8 md:h-9"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0.5 md:right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6"
            >
              <Smile className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
          >
            <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
