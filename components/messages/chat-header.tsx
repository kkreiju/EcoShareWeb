"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Video, MoreVertical } from "lucide-react";
import { UserSummary } from "./MessagesView";

interface ChatHeaderProps {
  user: UserSummary;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost"><Phone className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost"><Video className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export default ChatHeader;


