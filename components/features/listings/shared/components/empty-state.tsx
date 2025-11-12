"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface EmptyStateProps {
  onRefresh: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-4">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <MapPin className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            No listings found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your search criteria or filters to find more listings.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

