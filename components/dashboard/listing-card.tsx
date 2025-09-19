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
}

export function ListingCard({
  listing,
  onContact,
  onViewDetails,
  isOwner = false,
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-0">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
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
          className={`absolute top-3 left-3 ${getTypeColor(
            listing.type
          )} font-medium`}
        >
          {listing.type}
        </Badge>
      </div>

      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex-1 space-y-3">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 leading-tight">
            {listing.title}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-card-foreground">
              {formatPrice(listing.price || 0, listing.type)}
            </div>
            {listing.quantity > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                {listing.quantity} available
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="h-10 flex items-start">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground hover:bg-muted/80 flex-shrink-0"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground flex-shrink-0"
              >
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Location and Time */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{listing.locationName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(listing.postedDate)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage src={listing.User?.profileURL} />
            <AvatarFallback className="text-xs bg-muted">
              {listing.User?.firstName?.[0]}
              {listing.User?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {listing.User?.firstName} {listing.User?.lastName}
            </p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {listing.User?.ratings || 0} rating
              </span>
            </div>
          </div>
        </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 pt-2 ${isOwner ? "justify-center" : ""}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted/50 flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(listing);
            }}
          >
            View Details
          </Button>
          {!isOwner && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(listing);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {listing.type === "Wanted" ? "Offer Item" : "Request Item"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
