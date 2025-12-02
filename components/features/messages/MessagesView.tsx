"use client";

import { useState } from "react";
import { ConversationList } from "@/components/features/messages/conversation-list";
import { ChatHeader } from "@/components/features/messages/chat-header";
import { MessageList } from "@/components/features/messages/message-list";
import { MessageInput } from "@/components/features/messages/message-input";
import {
  ConversationListSkeleton,
  MessageListSkeleton,
  ChatHeaderSkeleton,
} from "@/components/features/messages/loading-skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMessages } from "./hooks/use-messages";

export interface UserSummary {
  id: string;
  name: string;
  avatar?: string;
}

export function MessagesView() {
  const { userId, loading: authLoading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    conversations,
    activeId,
    activeConversation,
    filtered,
    loading,
    error,
    messagesLoading,
    messagesError,
    sendingMessage,
    sendError,
    query: queryValue,
    currentUserId,
    setActiveId,
    setQuery,
    fetchConversations,
    fetchMessages,
    handleSend,
  } = useMessages(userId || "", isAuthenticated);

  // Ensure query always has a value
  const query = queryValue || "";

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full rounded-md border bg-card">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex md:w-[320px] lg:w-[380px] xl:w-[420px] flex-col border-r">
          <ConversationListSkeleton query={query} onQueryChange={setQuery} />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="hidden md:block">
            <ChatHeaderSkeleton />
          </div>
          <div className="flex-1 min-h-0">
            <MessageListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to view your messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full rounded-md border bg-card">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:w-[320px] lg:w-[380px] xl:w-[420px] flex-col border-r">
        {loading ? (
          <ConversationListSkeleton query={query} onQueryChange={setQuery} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchConversations} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : (
          <ConversationList
            conversations={filtered}
            activeId={activeId}
            onSelect={(id: string) => setActiveId(id)}
            query={query}
            onQueryChange={setQuery}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with menu */}
        <div className="md:hidden p-2 border-b flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[90%] sm:w-[400px]">
              <SheetHeader className="px-4 py-3">
                <SheetTitle>Messages</SheetTitle>
              </SheetHeader>
              <Separator />
              {loading ? (
                <ConversationListSkeleton
                  query={query}
                  onQueryChange={setQuery}
                />
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={fetchConversations}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <ConversationList
                  conversations={filtered}
                  activeId={activeId}
                  onSelect={(id: string) => {
                    setActiveId(id);
                    setMobileOpen(false);
                  }}
                  query={query}
                  onQueryChange={setQuery}
                />
              )}
            </SheetContent>
          </Sheet>
          <div className="font-semibold">
            {activeConversation?.user.name || "Messages"}
          </div>
        </div>

        {activeConversation ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="hidden md:block">
              <ChatHeader user={activeConversation.user} />
            </div>
            <div className="flex-1 min-h-0">
              {messagesLoading ? (
                <MessageListSkeleton />
              ) : messagesError ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {messagesError}
                  </p>
                  <Button
                    onClick={() => fetchMessages(activeId!)}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <MessageList
                  messages={activeConversation.messages}
                  currentUserId={currentUserId}
                />
              )}
            </div>
            <Separator />
            <div className="p-3">
              {sendError && (
                <div className="mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {sendError}
                </div>
              )}
              <MessageInput onSend={handleSend} disabled={false} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : conversations.length === 0 ? (
              "No conversations yet"
            ) : (
              "Select a conversation to start chatting"
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesView;
