"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TagsSelectionSectionProps {
  selectedTags: string[];
  onTagSelect?: (tag: string) => void;
  onTagsChange?: (tags: string[]) => void;
  error?: string;
  mode?: "add" | "edit";
  required?: boolean;
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
  onTagsChange,
  error,
  mode = "add",
  required = true,
}: TagsSelectionSectionProps) {
  const handleTagClick = (tag: string) => {
    if (onTagsChange) {
      // Edit mode: toggle in array
      if (selectedTags.includes(tag)) {
        onTagsChange(selectedTags.filter(t => t !== tag));
      } else {
        onTagsChange([...selectedTags, tag]);
      }
    } else if (onTagSelect) {
      // Add mode: single toggle callback
      onTagSelect(tag);
    }
  };

  const content = (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {required ? "Select all tags that apply to your item *" : "Select tags that apply to your item (optional)"}
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
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );

  if (mode === "edit") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tag className="h-4 w-4" style={{ color: "#A78BFA" }} />
          <span className="text-sm font-medium">Tags</span>
        </div>
        {content}
      </div>
    </div>
  );
}

