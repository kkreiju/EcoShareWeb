"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Eye,
  MessageCircle,
  Route,
  Star
} from "lucide-react";
import { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SidebarListingCardProps {
  listing: Listing;
  isSelected?: boolean;
  isOwner?: boolean;
  onCardClick?: (id: string) => void;
  formatDistance?: (listing: Listing) => string;
  onContactClick?: (listing: Listing) => void;
  onDirectionsClick?: (listing: Listing) => void;
  hasUserLocation?: boolean;
  isShowingDirections?: boolean;
}

export const SidebarListingCard = forwardRef<HTMLDivElement, SidebarListingCardProps>(({
  listing,
  isSelected = false,
  isOwner = false,
  onCardClick,
  formatDistance,
  onContactClick,
  onDirectionsClick,
  hasUserLocation,
  isShowingDirections
}, ref) => {
  const handleClick = () => {
    onCardClick?.(listing.list_id);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'free':
        return 'bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white dark:border-green-600';
      case 'wanted':
        return 'bg-yellow-500 text-white border-yellow-500 dark:bg-yellow-600 dark:text-white dark:border-yellow-600';
      case 'sale':
        return 'bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === 'free') return '';
    if (type.toLowerCase() === 'wanted') return '';
    return `₱${price.toLocaleString()}`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-200",
        "hover:border-blue-300 hover:shadow-md",
        isSelected && "border-blue-500 shadow-md ring-1 ring-blue-500/20",
        "w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] mx-auto"
      )}
      onClick={handleClick}
    >
      <div className="p-3">
        {/* Image and Type Badge */}
        <div className="relative mb-3">
          <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={listing.imageURL || "/images/stock_veges.jpg"}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Badge
            className={cn(
              "absolute top-2 left-2 text-xs font-medium border px-2 py-1",
              getTypeColor(listing.type)
            )}
          >
            {listing.type}
          </Badge>

          {/* Directions Button */}
          {hasUserLocation && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "absolute top-2 right-2 h-8 w-8 p-0 transition-colors duration-200 shadow-md",
                isShowingDirections
                  ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
                  : "bg-white/90 backdrop-blur-sm border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDirectionsClick?.(listing);
              }}
            >
              <Route className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-gray-900 text-sm flex-1 leading-tight line-clamp-2">
              {listing.title}
            </h3>
            {formatPrice(listing.price || 0, listing.type) && (
              <span className="font-bold text-red-600 text-sm whitespace-nowrap flex-shrink-0">
                {formatPrice(listing.price || 0, listing.type)}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="flex-1 truncate">{listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}</span>
            {formatDistance && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-blue-600 font-medium">
                  {formatDistance(listing)}
                </span>
              </>
            )}
          </div>

          {/* Tags (limited) */}
          {Array.isArray(listing.tags) && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 text-gray-600 border-gray-300 bg-gray-50"
                >
                  {tag}
                </Badge>
              ))}
              {listing.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 text-gray-500 border-gray-300 bg-gray-50">
                  +{listing.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {listing.User?.profileURL ? (
                  <img
                    src={listing.User.profileURL}
                    alt={`${listing.User.firstName || 'User'} profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-xs font-medium text-gray-600">${listing.User?.firstName?.[0] || 'U'}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-600">
                    {listing.User?.firstName?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {listing.User?.firstName || listing.User?.lastName
                    ? `${listing.User.firstName || ''} ${listing.User.lastName || ''}`.trim()
                    : 'User'
                  }
                </p>
                {listing.User?.ratings && Number(listing.User.ratings) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">
                      {Number(listing.User.ratings).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <Button
                variant="default"
                size="sm"
                className="h-7 px-2 bg-gray-600 text-white hover:bg-gray-700 hover:text-white transition-colors duration-200 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/user/listing/${listing.list_id}`;
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>

              {!isOwner && (
                <Button
                  variant="default"
                  size="sm"
                  className="h-7 px-2 text-white hover:text-white transition-colors duration-200 bg-green-600 hover:bg-green-700 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick?.(listing);
                  }}
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SidebarListingCard.displayName = "SidebarListingCard";
