"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES = {
  "Smileys & People": [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "😣", "😖",
    "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯"
  ],
  "Animals & Nature": [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒",
    "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇"
  ],
  "Food & Drink": [
    "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈",
    "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦",
    "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔"
  ],
  "Activities": [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳"
  ],
  "Travel & Places": [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
    "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛹", "🛼"
  ],
  "Objects": [
    "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️",
    "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥"
  ]
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  children?: React.ReactNode;
}

export function EmojiPicker({ onEmojiSelect, children }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState("Smileys & People");

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={5}
      >
        <div className="flex flex-col h-80">
          {/* Category tabs */}
          <div className="flex border-b">
            <div className="flex overflow-x-auto scrollbar-hide">
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    selectedCategory === category
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Recent emojis section */}
          <div className="border-t p-2">
            <p className="text-xs text-muted-foreground mb-1">Recently used</p>
            <div className="flex gap-1">
              {["😊", "👍", "❤️", "😂", "😍"].map((emoji, index) => (
                <button
                  key={`recent-${emoji}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
