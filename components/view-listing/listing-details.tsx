"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ListingDetailsProps {
  listing: Listing;
  tags: string[];
}

export function ListingDetails({ listing, tags }: ListingDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              {listing.title}
            </CardTitle>
            
            <div className="flex items-center gap-2 mb-4">
              {listing.quantity > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  {listing.quantity} available
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2 uppercase text-sm">
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2 uppercase text-sm">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-2 py-1 border-primary/20 text-primary hover:bg-primary/5"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
