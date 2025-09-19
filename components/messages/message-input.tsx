"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="ghost" size="icon" className="shrink-0">
        <Paperclip className="h-4 w-4" />
      </Button>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <Button type="button" onClick={submit} className="shrink-0">
        <Send className="h-4 w-4 mr-1" />
        Send
      </Button>
    </div>
  );
}

export default MessageInput;


