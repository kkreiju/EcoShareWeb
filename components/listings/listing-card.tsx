"use client";

import { Listing } from "@/lib/DataClass";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Package, MessageCircle, Trash2, Eye, EyeOff, Eye as ViewIcon, Edit, Share2 } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onDelete?: (listing: Listing) => void;
  onToggleVisibility?: (listing: Listing) => void;
  onViewDetails?: (listing: Listing) => void;
  onEditListing?: (listing: Listing) => void;
  onShare?: (listing: Listing) => void;
  isOwner?: boolean;
}

export function ListingCard({
  listing,
  onDelete,
  onToggleVisibility,
  onViewDetails,
  onEditListing,
  onShare,
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white dark:border-green-600";
      case "inactive":
        return "bg-gray-500 text-white border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-600";
      case "sold":
        return "bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:text-white dark:border-blue-600";
      case "unavailable":
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
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-0 cursor-pointer"
      onClick={() => onViewDetails?.(listing)}
    >
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={listing.imageURL}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/stock_veges.jpg"; // Fallback image
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

        {/* Status badge */}
        <Badge
          className={`absolute top-3 right-3 ${getStatusColor(
            listing.status
          )} font-medium`}
        >
          {listing.status}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
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
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground hover:bg-muted/80"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted text-muted-foreground"
              >
                +{tags.length - 3}
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


        {/* Action Buttons */}
        {isOwner && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className={
                listing.status === "Active"
                  ? "border-gray-500 text-gray-500 hover:bg-gray-50 hover:text-gray-600 flex-1"
                  : "border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 flex-1"
              }
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility?.(listing);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              {listing.status === "Active" ? "Hide" : "Show"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(listing);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-border/50">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(listing);
            }}
          >
            <ViewIcon className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditListing?.(listing);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-500 hover:bg-purple-50 hover:text-purple-600"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(listing);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
