"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Eye,
  MessageCircle,
  Star,
  Clock,
  Route,
  Navigation,
  X
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { ListingContactDialog } from "@/components/view-listing/listing-contact-dialog";

interface ListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  formatDistance?: (listing: Listing) => string;
  isOwner?: boolean;
  onDirectionsClick?: (listing: Listing) => void;
  hasUserLocation?: boolean;
  isShowingDirections?: boolean;
}

export function ListingModal({
  listing,
  isOpen,
  onClose,
  formatDistance,
  isOwner = false,
  onDirectionsClick,
  hasUserLocation,
  isShowingDirections
}: ListingModalProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  if (!listing) return null;

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'free': return 'bg-green-500 text-white border-green-500';
      case 'wanted': return 'bg-yellow-500 text-white border-yellow-500';
      case 'sale': return 'bg-red-500 text-white border-red-500';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === 'free') return 'Free';
    if (type.toLowerCase() === 'wanted') return 'Wanted';
    return `₱${price.toLocaleString()}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-8">
              <MapPin className="h-5 w-5 text-foreground" />
              Listing Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Image */}
            <div className="relative">
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                {listing.imageURL ? (
                  <img
                    src={listing.imageURL}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-muted-foreground text-sm ${
                    listing.imageURL ? 'hidden' : 'flex'
                  }`}
                >
                  Image not available
                </div>
              </div>
              <Badge
                className={`absolute top-3 left-3 text-sm font-medium border ${getTypeColor(listing.type)}`}
              >
                {listing.type}
              </Badge>
            </div>

            {/* Title and Price */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-foreground leading-tight">
                  {listing.title}
                </h2>
                {listing.type.toLowerCase() === "sale" && (
                  <span className="text-2xl font-bold text-foreground whitespace-nowrap">
                    {formatPrice(listing.price || 0, listing.type)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            <Separator />

            {/* Location and Distance */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-foreground" />
              <span>{listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}</span>
              {formatDistance && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">
                    {formatDistance(listing)}
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {Array.isArray(listing.tags) && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs text-muted-foreground border-border"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Owner Info */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">
                  {listing.User?.firstName?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {listing.User?.firstName || listing.User?.lastName
                    ? `${listing.User.firstName || ''} ${listing.User.lastName || ''}`.trim()
                    : 'User'
                  }
                </p>
                {listing.User?.ratings && Number(listing.User.ratings) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {Number(listing.User.ratings).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1 w-full sm:w-auto"
                onClick={() => window.location.href = `/user/listing/${listing.list_id}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

              {hasUserLocation && !isShowingDirections && onDirectionsClick && (
                <Button
                  variant="outline"
                  onClick={() => onDirectionsClick(listing)}
                  className="flex-1 w-full sm:w-auto"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              )}

              {!isOwner && (
                <Button
                  onClick={() => setContactDialogOpen(true)}
                  className="flex-1 w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <ListingContactDialog
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        listingId={listing.list_id}
        listingTitle={listing.title}
        listingImageURL={listing.imageURL}
        listingType={listing.type}
        ownerName={`${listing.User?.firstName || ''} ${listing.User?.lastName || ''}`.trim() || 'Owner'}
        ownerId={listing.user_id}
      />
    </>
  );
}
