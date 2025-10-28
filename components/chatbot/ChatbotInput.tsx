"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2 } from "lucide-react";

interface ChatbotInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClearConversation: () => void;
  isTyping: boolean;
}

export function ChatbotInput({
  input,
  onInputChange,
  onSend,
  onKeyPress,
  onClearConversation,
  isTyping
}: ChatbotInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea only when there's actual input content
  useEffect(() => {
    if (textareaRef.current && input.trim()) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    } else if (textareaRef.current && !input.trim()) {
      // Reset to minimum height when empty
      textareaRef.current.style.height = '40px';
    }
  }, [input]);

  return (
    <div className="border-t px-3 py-3">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          disabled={isTyping}
          rows={1}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onClearConversation}
            className="shrink-0 h-10 w-10 hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="shrink-0 h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  );
}
