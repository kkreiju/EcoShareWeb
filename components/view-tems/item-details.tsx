"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Info, Clock, MapPin } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ItemDetailsProps {
  listing: Listing;
}

export function ItemDetails({ listing }: ItemDetailsProps) {
  const postedDate = new Date(listing.postedDate);

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Item Details</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Quantity */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">Quantity</div>
            <div className="text-sm text-muted-foreground">
              {listing.quantity} available
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Info className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">Status</div>
            <Badge
              variant={listing.status === "Active" ? "default" : "secondary"}
              className="text-xs"
            >
              {listing.status}
            </Badge>
          </div>
        </div>

        {/* Posted Date */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">Posted</div>
            <div className="text-sm text-muted-foreground">
              {postedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">Location</div>
            <div className="text-sm text-muted-foreground">
              {listing.locationName}
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Instructions */}
      {listing.instructions && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Pickup Instructions
          </h4>
          <div className="p-4 rounded-lg bg-muted/30 border-l-4 border-l-primary">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {listing.instructions}
            </p>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Availability</h4>
        <div className="p-4 rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {listing.pickupTimeAvailability}
          </p>
        </div>
      </div>

      {/* Coordinates (if needed for development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Coordinates</h4>
          <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded">
            Lat: {listing.latitude}, Lng: {listing.longitude}
          </div>
        </div>
      )}
    </Card>
  );
}
