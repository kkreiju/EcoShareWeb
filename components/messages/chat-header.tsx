"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, X } from "lucide-react";
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
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
          <CheckCircle className="h-4 w-4 mr-1" />
          Mark Complete
        </Button>
        <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
          <X className="h-4 w-4 mr-1" />
          Cancel Transaction
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;


