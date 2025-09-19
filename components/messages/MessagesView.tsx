"use client";

import { useMemo, useState } from "react";
import { ConversationList } from "@/components/messages/conversation-list";
import { ChatHeader } from "@/components/messages/chat-header";
import { MessageList } from "@/components/messages/message-list";
import { MessageInput } from "@/components/messages/message-input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export interface UserSummary {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  user: UserSummary; // the other participant
  lastMessage: string;
  lastTimestamp: string; // ISO
  unreadCount?: number;
  messages: Message[];
}

function createMockData(currentUserId: string): Conversation[] {
  const now = new Date();
  const toIso = (d: Date) => d.toISOString();
  const minutesAgo = (m: number) => toIso(new Date(now.getTime() - m * 60000));

  return [
    {
      id: "c1",
      user: { id: "u2", name: "Alex Johnson", isOnline: true, avatar: "/images/user1.png" },
      lastMessage: "Sure, pickup at 4 PM works!",
      lastTimestamp: minutesAgo(12),
      unreadCount: 2,
      messages: [
        { id: "m1", senderId: currentUserId, content: "Hi Alex, is the item still available?", timestamp: minutesAgo(120), status: "read" },
        { id: "m2", senderId: "u2", content: "Yes, still available.", timestamp: minutesAgo(110), status: "read" },
        { id: "m3", senderId: currentUserId, content: "Great! Can I pickup later today?", timestamp: minutesAgo(80), status: "read" },
        { id: "m4", senderId: "u2", content: "Sure, pickup at 4 PM works!", timestamp: minutesAgo(12), status: "delivered" },
      ],
    },
    {
      id: "c2",
      user: { id: "u3", name: "Maria Garcia", isOnline: false, avatar: "/images/user2.png" },
      lastMessage: "Thanks for the help!",
      lastTimestamp: minutesAgo(1440),
      messages: [
        { id: "m5", senderId: "u3", content: "Can you reserve 2kg for me?", timestamp: minutesAgo(2000), status: "read" },
        { id: "m6", senderId: currentUserId, content: "Reserved!", timestamp: minutesAgo(1800), status: "read" },
        { id: "m7", senderId: "u3", content: "Thanks for the help!", timestamp: minutesAgo(1440), status: "read" },
      ],
    },
  ];
}

export function MessagesView() {
  const currentUserId = "me";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(() => createMockData(currentUserId));
  const [activeId, setActiveId] = useState<string | null>(() => (conversations[0]?.id ?? null));

  const activeConversation = useMemo(() => conversations.find(c => c.id === activeId) || null, [conversations, activeId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c =>
      c.user.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const handleSend = (text: string) => {
    if (!activeConversation) return;
    const newMsg: Message = {
      id: Math.random().toString(36).slice(2),
      senderId: currentUserId,
      content: text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConversation.id) return c;
      const updated = { ...c };
      updated.messages = [...c.messages, newMsg];
      updated.lastMessage = text;
      updated.lastTimestamp = newMsg.timestamp;
      return updated;
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-3rem)] w-full rounded-md border bg-card">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:w-[320px] lg:w-[380px] xl:w-[420px] flex-col border-r">
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={(id: string) => setActiveId(id)}
          query={query}
          onQueryChange={setQuery}
        />
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
              <ConversationList
                conversations={filtered}
                activeId={activeId}
                onSelect={(id: string) => { setActiveId(id); setMobileOpen(false); }}
                query={query}
                onQueryChange={setQuery}
              />
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
              <MessageList
                messages={activeConversation.messages}
                currentUserId={currentUserId}
              />
            </div>
            <Separator />
            <div className="p-3">
              <MessageInput onSend={handleSend} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesView;


