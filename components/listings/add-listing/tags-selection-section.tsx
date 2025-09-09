"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags *
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select all tags that apply to your item
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
      </CardContent>
    </Card>
  );
}
