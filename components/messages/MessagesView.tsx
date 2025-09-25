"use client";

import { useMemo, useState, useEffect } from "react";
import { ConversationList } from "@/components/messages/conversation-list";
import { ChatHeader } from "@/components/messages/chat-header";
import { MessageList } from "@/components/messages/message-list";
import { MessageInput } from "@/components/messages/message-input";
import { ConversationListSkeleton, MessageListSkeleton, ChatHeaderSkeleton } from "@/components/messages/loading-skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ConversationService, Conversation } from "@/lib/conversationService";

export interface UserSummary {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO
  status?: "sent" | "delivered" | "read";
}



export function MessagesView() {
  const { userId, loading: authLoading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Stabilize current user id so it never flips to empty during visibility/auth rechecks
  const [stableUserId, setStableUserId] = useState<string>('');
  useEffect(() => {
    if (userId && !stableUserId) {
      setStableUserId(userId);
    }
  }, [userId, stableUserId]);

  // Use the first known user id for alignment and API calls
  const currentUserId = stableUserId || userId || '';

  // Fetch conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchConversations();
    }
  }, [isAuthenticated, currentUserId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeId && currentUserId) {
      fetchMessages(activeId);
    }
  }, [activeId, currentUserId]);

  const fetchConversations = async () => {
    if (!currentUserId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await ConversationService.getConversations(currentUserId);
      setConversations(data);
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!currentUserId) return;

    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const messages = await ConversationService.getMessages(conversationId, currentUserId);

      // Update the conversation with the fetched messages
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return { ...c, messages };
        }
        return c;
      }));
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const activeConversation = useMemo(() => conversations.find(c => c.id === activeId) || null, [conversations, activeId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      c.user.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const handleSend = async (text: string) => {
    if (!activeConversation || !currentUserId || sendingMessage) return;

    setSendingMessage(true);
    setSendError(null);

    // Optimistically add message to UI with truly unique temporary ID
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderId: currentUserId,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };

    setConversations(prev => prev.map(c => {
      if (c.id !== activeConversation.id) return c;
      const updated = { ...c };
      updated.messages = [...c.messages, optimisticMsg];
      updated.lastMessage = text;
      updated.lastTimestamp = new Date().toISOString();
      return updated;
    }));

    try {
      const response = await ConversationService.sendMessage(activeConversation.id, text, currentUserId);

      // Replace optimistic message with real message from API
      setConversations(prev => prev.map(c => {
        if (c.id !== activeConversation.id) return c;
        const updated = { ...c };
        // Replace the optimistic message with the real one
        const messageIndex = c.messages.findIndex(msg => msg.id === tempId);
        if (messageIndex !== -1) {
          const newMessages = [...c.messages];
          newMessages[messageIndex] = {
            id: response.id,
            senderId: response.mess_senderId,
            content: response.mess_content,
            timestamp: new Date(response.mess_sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent" as const,
          };
          updated.messages = newMessages;
        }
        return updated;
      }));
      // No need to refresh messages since we updated the specific message
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);

      // Remove optimistic message on failure
      setConversations(prev => prev.map(c => {
        if (c.id !== activeConversation.id) return c;
        const updated = { ...c };
        updated.messages = c.messages.filter(msg => msg.id !== tempId);
        return updated;
      }));
    } finally {
      setSendingMessage(false);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full rounded-md border bg-card">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex md:w-[320px] lg:w-[380px] xl:w-[420px] flex-col border-r">
          <ConversationListSkeleton
            query={query}
            onQueryChange={setQuery}
          />
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
          <p className="text-muted-foreground mb-4">Please log in to view your messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full rounded-md border bg-card">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:w-[320px] lg:w-[380px] xl:w-[420px] flex-col border-r">
        {loading ? (
          <ConversationListSkeleton
            query={query}
            onQueryChange={setQuery}
          />
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
                  <Button onClick={fetchConversations} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              ) : (
                <ConversationList
                  conversations={filtered}
                  activeId={activeId}
                  onSelect={(id: string) => { setActiveId(id); setMobileOpen(false); }}
                  query={query}
                  onQueryChange={setQuery}
                />
              )}
            </SheetContent>
          </Sheet>
          <div className="font-semibold">{activeConversation?.user.name || "Messages"}</div>
        </div>

        {activeConversation ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="hidden md:block">
              <ChatHeader
                user={activeConversation.user}
              />
            </div>
            <div className="flex-1 min-h-0">
              {messagesLoading ? (
                <MessageListSkeleton />
              ) : messagesError ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-sm text-muted-foreground mb-2">{messagesError}</p>
                  <Button onClick={() => fetchMessages(activeId!)} variant="outline" size="sm">
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
              <MessageInput onSend={handleSend} disabled={sendingMessage} />
              {sendingMessage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending message...
                </div>
              )}
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


