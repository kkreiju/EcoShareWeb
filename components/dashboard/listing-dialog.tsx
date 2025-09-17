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
import { MapPin, Calendar, Star, MessageCircle, AlertCircle, Clock } from "lucide-react";
import { ChartPieLabel } from "./nutrient-analytics";

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

  const parseTags = (tagsString: string | string[] | undefined): string[] => {
    if (Array.isArray(tagsString)) {
      return tagsString;
    }
    if (typeof tagsString === "string") {
      try {
        return JSON.parse(tagsString) || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const tags = parseTags(listing.tags);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "1200px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Item Details
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
                    target.src = "/images/food-waste.jpg";
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
                    <Badge
                      className={`text-sm ${getTypeColor(listing.type)}`}
                    >
                      {listing.type}
                    </Badge>
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
                <h3 className="font-semibold text-foreground mb-2 uppercase">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
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
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm uppercase">
                      Location
                    </div>
                    <div className="text-sm text-muted-foreground break-words">
                      {listing.locationName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm uppercase">
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

              {/* Pickup Information */}
              <div className="space-y-4">
                {/* Pickup Availability */}
                {listing.pickupTimeAvailability && (
                  <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm uppercase">
                        Pickup Available
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {listing.pickupTimeAvailability}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pickup Instructions */}
                {listing.instructions && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm uppercase">
                        Instructions
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {listing.instructions}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Sections Below Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Maps Location */}
            {listing.latitude && listing.longitude && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 uppercase">
                  Location
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
                  {/* Get Directions Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-border hover:bg-background/80 hover:border-red-300 transition-all duration-200 cursor-pointer w-full"
                    >
                      <MapPin
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        fill="currentColor"
                      />
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">
                        Get Directions
                      </span>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Coordinates: {listing.latitude.toFixed(6)}{" "}
                  {listing.longitude.toFixed(6)}
                </div>
              </div>
            )}

            {/* Nutrient Analytics */}
            <ChartPieLabel />

            {/* Owner Info */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2 uppercase">
                  Posted by
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
                </div>
                {!isOwner(listing) && (
                  <div className="mt-4 space-y-3">
                    <Button
                      size="sm"
                      onClick={() => onContact(listing)}
                      className="bg-primary hover:bg-primary/90 w-full"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {listing.type === "Wanted" ? "Offer Item" : "Request Item"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // TODO: Implement report functionality
                        console.log("Report item:", listing.list_id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white w-full"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Report Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
