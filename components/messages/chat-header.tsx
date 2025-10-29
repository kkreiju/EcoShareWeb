"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSummary } from "./MessagesView";

interface ChatHeaderProps {
  user: UserSummary;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center px-4 py-2 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {user.avatar &&
           user.avatar !== "null" &&
           user.avatar !== "undefined" &&
           user.avatar.trim() !== "" ? (
            <AvatarImage src={user.avatar} />
          ) : null}
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium leading-none">{user.name}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;


