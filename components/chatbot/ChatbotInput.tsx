"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search } from "lucide-react";

interface ChatbotInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isFindListingMode: boolean;
  onToggleFindMode: () => void;
  isTyping: boolean;
}

export function ChatbotInput({
  input,
  onInputChange,
  onSend,
  onKeyPress,
  isFindListingMode,
  onToggleFindMode,
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
    <div className="border-t px-4 py-3">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={
            isFindListingMode
              ? "Ask me to find items..."
              : "Type your message..."
          }
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          disabled={isTyping}
          rows={1}
        />
        <div className="flex gap-2">
          <Button
            variant={isFindListingMode ? "default" : "outline"}
            size="icon"
            onClick={onToggleFindMode}
            className={`shrink-0 h-10 w-10 transition-all duration-200 ${
              isFindListingMode
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "hover:bg-muted"
            }`}
            title={isFindListingMode ? "Disable Find Listing mode" : "Enable Find Listing mode"}
          >
            <Search className="h-4 w-4" />
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
