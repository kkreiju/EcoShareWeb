"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagsSelectionSectionProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  error?: string;
}

const availableTags = [
  "Food Waste",
  "Compostable",
  "Plant Based",
  "Kitchen Scraps",
  "Garden Waste",
  "Fertilizer",
  "Dried",
  "Clean",
  "Mixed",
  "Soil Enrichment",
  "Fruit Scraps",
];

export function TagsSelectionSection({
  selectedTags,
  onTagSelect,
  error,
}: TagsSelectionSectionProps) {
  return (
    <div className="space-y-6">
      {/* Tags Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tag className="h-4 w-4" style={{ color: "#A78BFA" }} />
          <span className="text-sm font-medium">Tags</span>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select all tags that apply to your item *
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "hover:bg-muted"
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
