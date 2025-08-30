"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ItemHeaderProps {
  listing: Listing;
}

const TYPE_BADGE_CONFIG = {
  free: { label: "Free", className: "bg-green-600 text-white" },
  sale: { label: "Sale", className: "bg-red-600 text-white" },
  wanted: { label: "Wanted", className: "bg-yellow-500 text-white" },
  default: { label: "Listing", className: "bg-muted text-foreground" },
} as const;

function getTypeBadgeFromListing(listing: Listing) {
  const listingType = (listing.type || "")
    .toString()
    .toLowerCase() as keyof typeof TYPE_BADGE_CONFIG;
  return TYPE_BADGE_CONFIG[listingType] || TYPE_BADGE_CONFIG.default;
}

export function ItemHeader({ listing }: ItemHeaderProps) {
  const typeBadge = getTypeBadgeFromListing(listing);
  const imageSource = listing.imageURL || listing.images?.[0];
  const postedDate = new Date(listing.postedDate);

  return (
    <Card className="overflow-hidden rounded-xl border bg-card">
      {/* Main Image Section */}
      <div className="relative h-80 w-full bg-muted/20">
        {imageSource ? (
          <img
            src={imageSource}
            alt={listing.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/40">
            <div className="h-20 w-20 rounded-lg bg-muted" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute left-4 top-4">
          <Badge className={`${typeBadge.className} text-sm px-3 py-1`}>
            {typeBadge.label}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="absolute right-4 top-4">
          <Badge
            variant={listing.status === "Active" ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {listing.status}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title and Price Row */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-tight text-foreground flex-1">
            {listing.title}
          </h1>
          {listing.type === "sale" && listing.price && (
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ₱{listing.price.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Price</div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-base text-muted-foreground leading-relaxed">
          {listing.description}
        </p>

        {/* Metadata Row */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{listing.locationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Posted {postedDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Available: {listing.pickupTimeAvailability}</span>
          </div>
        </div>

        {/* Tags */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
