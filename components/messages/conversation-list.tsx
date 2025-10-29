"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/conversationService";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  query,
  onQueryChange,
}: ConversationListProps) {
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
                "w-full px-3 py-2 flex items-start gap-3 hover:bg-muted/50",
                activeId === c.id && "bg-muted/70"
              )}
              onClick={() => onSelect(c.id)}
            >
              <Avatar className="h-9 w-9 flex-shrink-0">
                {c.user.avatar && 
                 c.user.avatar !== "null" && 
                 c.user.avatar !== "undefined" && 
                 c.user.avatar.trim() !== "" ? (
                  <AvatarImage src={c.user.avatar} />
                ) : null}
                <AvatarFallback>{c.user.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{c.user.name}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {/* Display relative time from API (e.g., "2h ago", "now") */}
                      {c.timestamp}
                    </p>
                    {c.unreadCount ? (
                      <Badge
                        className="px-1.5 py-0 h-5 text-[10px]"
                        variant="default"
                      >
                        {c.unreadCount}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {c.lastMessage}
                </p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="px-3 py-8 text-sm text-muted-foreground">
              No conversations
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ConversationList;
