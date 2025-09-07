"use client";

import { Listing } from "@/lib/DataClass";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, MessageCircle } from "lucide-react";

interface ListingDialogProps {
  listing: Listing | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (listing: Listing) => void;
  isOwner: (listing: Listing) => boolean;
  formatPrice: (price: number, type: string) => string;
  formatDate: (dateString: string) => string;
  getTypeColor: (type: string) => string;
}

export function ListingDialog({
  listing,
  isOpen,
  onOpenChange,
  onContact,
  isOwner,
  formatPrice,
  formatDate,
  getTypeColor,
}: ListingDialogProps) {
  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "1200px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Listing Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Content Grid - Landscape Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-muted">
                <img
                  src={listing.imageURL}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/stock_veges.jpg";
                  }}
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Header with Title and Price */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {listing.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    {listing.type === "Sale" && (
                      <Badge
                        className={`text-sm ${getTypeColor(listing.type)}`}
                      >
                        {listing.type}
                      </Badge>
                    )}
                    {listing.quantity > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {listing.quantity} available
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {listing.type === "Sale" && (
                    <div className="text-3xl font-bold text-foreground">
                      {formatPrice(listing.price || 0, listing.type)}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm">
                      Location
                    </div>
                    <div className="text-sm text-muted-foreground break-words">
                      {listing.locationName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm">
                      Posted
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(listing.postedDate)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const postedDate = new Date(listing.postedDate);
                        const now = new Date();
                        const diffTime = Math.abs(
                          now.getTime() - postedDate.getTime()
                        );
                        const diffDays = Math.floor(
                          diffTime / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays === 0) return "Posted today";
                        if (diffDays === 1) return "1 day ago";
                        if (diffDays < 7) return `${diffDays} days ago`;
                        if (diffDays < 30)
                          return `${Math.floor(diffDays / 7)} weeks ago`;
                        if (diffDays < 365)
                          return `${Math.floor(diffDays / 30)} months ago`;
                        return `${Math.floor(diffDays / 365)} years ago`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections Below Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Maps Location */}
            {listing.latitude && listing.longitude && (
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-foreground mb-3">
                  Location Map
                </h3>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-border relative">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA&q=${listing.latitude},${listing.longitude}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Location of ${listing.locationName}`}
                  ></iframe>
                  {/* Location Pin Indicator */}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-border">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                      />
                      <span className="text-xs font-medium text-foreground">
                        Item Location
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Coordinates: {listing.latitude.toFixed(6)}{" "}
                  {listing.longitude.toFixed(6)}
                </div>
              </div>
            )}

            {/* Pickup Availability & Owner Info */}
            <div className="space-y-4">
              {/* Pickup Availability */}
              {listing.pickupTimeAvailability && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Pickup Availability
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-foreground">
                        Available for pickup
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {listing.pickupTimeAvailability}
                    </p>
                  </div>
                </div>
              )}

              {/* Owner Info */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Listed by
                </h4>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={listing.User?.profileURL} />
                    <AvatarFallback className="text-xs">
                      {listing.User?.firstName?.[0]}
                      {listing.User?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">
                      {listing.User?.firstName} {listing.User?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {listing.User?.ratings || 0} rating
                    </div>
                  </div>
                  {!isOwner(listing) && (
                    <Button
                      size="sm"
                      onClick={() => onContact(listing)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions and Tags Row */}
          {(listing.instructions ||
            (listing.tags &&
              Array.isArray(listing.tags) &&
              listing.tags.length > 0)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-border pt-6">
              {/* Instructions */}
              {listing.instructions && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Pickup Instructions
                  </h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      {listing.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {listing.tags &&
                Array.isArray(listing.tags) &&
                listing.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Item Tags
                    </h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {listing.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-2 py-1 border-primary/20 text-primary hover:bg-primary/5"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {listing.tags.length} tag
                        {listing.tags.length !== 1 ? "s" : ""} • Click tags to
                        search similar items
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
