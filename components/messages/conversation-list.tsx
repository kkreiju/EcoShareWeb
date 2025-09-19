"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "./MessagesView";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect, query, onQueryChange }: ConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-3 border-b">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search conversations..."
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {conversations.map((c) => (
            <button
              key={c.id}
              className={cn(
                "w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50",
                activeId === c.id && "bg-muted/70"
              )}
              onClick={() => onSelect(c.id)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={c.user.avatar} />
                <AvatarFallback>{c.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{c.user.name}</p>
                  {c.user.isOnline && (
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-muted-foreground">
                  {new Date(c.lastTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                {c.unreadCount ? (
                  <Badge className="px-1.5 py-0 h-5" variant="default">{c.unreadCount}</Badge>
                ) : null}
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-3 py-8 text-sm text-muted-foreground">No conversations</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ConversationList;


