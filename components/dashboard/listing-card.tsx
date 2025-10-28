"use client";

import { Listing } from "@/lib/DataClass";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Package, Star, MessageCircle } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onContact?: (listing: Listing) => void;
  onViewDetails?: (listing: Listing) => void;
  isOwner?: boolean;
  hideContactButton?: boolean;
  compact?: boolean;
}

export function ListingCard({
  listing,
  onContact,
  onViewDetails,
  isOwner = false,
  hideContactButton = false,
  compact = false,
}: ListingCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white dark:border-green-600";
      case "wanted":
        return "bg-yellow-500 text-white border-yellow-500 dark:bg-yellow-600 dark:text-white dark:border-yellow-600";
      case "sale":
        return "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === "free") return "Free";
    if (type.toLowerCase() === "wanted") return "Wanted";
    return `₱${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

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
    <Card className={`group overflow-hidden transition-all duration-300 py-0 ${compact ? 'hover:shadow-md' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <div className="relative">
        <div className={compact ? "h-32 overflow-hidden" : "aspect-video overflow-hidden"}>
          <img
            src={listing.imageURL}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/food-waste.jpg"; // Fallback image
            }}
          />
        </div>

        {/* Type badge */}
        <Badge
          className={`absolute ${compact ? 'top-2 left-2 text-xs px-2 py-0.5' : 'top-3 left-3'} ${getTypeColor(
            listing.type
          )} font-medium`}
        >
          {listing.type}
        </Badge>
      </div>

      <CardContent className={compact ? "p-2.5 flex flex-col h-full" : "p-4 flex flex-col h-full"}>
        <div className={`flex-1 ${compact ? 'space-y-1.5' : 'space-y-3'}`}>
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-semibold text-card-foreground line-clamp-2 leading-tight ${compact ? 'text-sm' : 'text-lg'}`}>
            {listing.title}
          </h3>
          <div className="text-right shrink-0">
            {listing.type.toLowerCase() === "sale" && (
              <div className={`font-bold text-card-foreground ${compact ? 'text-base' : 'text-xl'}`}>
                {formatPrice(listing.price || 0, listing.type)}
              </div>
            )}
            {listing.quantity > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                <Package className="h-3 w-3" />
                {listing.quantity}
              </div>
            )}
          </div>
        </div>

        {/* Description - hide in compact mode */}
        {!compact && (
          <div className="h-10 flex items-start">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}

        {/* Tags - show only first tag in compact mode */}
        {tags.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {tags.slice(0, compact ? 1 : 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`${compact ? 'text-[10px] px-1.5 py-0' : 'text-xs'} bg-muted text-muted-foreground hover:bg-muted/80 flex-shrink-0`}
              >
                {tag}
              </Badge>
            ))}
            {tags.length > (compact ? 1 : 2) && (
              <Badge
                variant="secondary"
                className={`${compact ? 'text-[10px] px-1.5 py-0' : 'text-xs'} bg-muted text-muted-foreground flex-shrink-0`}
              >
                +{tags.length - (compact ? 1 : 2)}
              </Badge>
            )}
          </div>
        )}

        {/* Location and Time */}
        <div className={`text-xs text-muted-foreground ${compact ? 'space-y-0.5' : 'space-y-2'}`}>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1 text-[11px]">{listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Posted {formatDate(listing.postedDate)}</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className={`flex items-center gap-2 ${compact ? 'pt-1.5 border-t border-border' : 'pt-2 border-t border-border'}`}>
          <Avatar className={compact ? "h-6 w-6" : "h-8 w-8"}>
            <AvatarImage src={listing.User?.profileURL} />
            <AvatarFallback className="text-xs bg-muted">
              {listing.User?.firstName?.[0]}
              {listing.User?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-card-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {listing.User?.firstName} {listing.User?.lastName}
            </p>
            <div className="flex items-center gap-0.5">
              <Star className={`fill-yellow-400 text-yellow-400 ${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
              <span className={compact ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>
                {listing.User?.ratings || 0}
              </span>
            </div>
          </div>
        </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 ${compact ? 'pt-1.5' : 'pt-2'} ${isOwner || hideContactButton ? "justify-center" : ""}`}>
          <Button
            variant="outline"
            size={compact ? "sm" : "sm"}
            className={`${hideContactButton ? "flex-1" : "flex-1"} border-border hover:bg-muted/50 ${compact ? 'text-xs h-8 px-3' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(listing);
            }}
          >
            View Details
          </Button>
          {!isOwner && !hideContactButton && (
            <Button
              size="sm"
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white ${compact ? 'text-xs h-8 px-3' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(listing);
              }}
            >
              <MessageCircle className={compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"} />
              {listing.type === "Wanted" ? "Offer Item" : "Request Item"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
