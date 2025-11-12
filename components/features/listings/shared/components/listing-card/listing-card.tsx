"use client";

import { Listing } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Package,
  MessageCircle,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Share2,
  Star,
  Heart,
} from "lucide-react";
import { formatPrice, formatDate, getTypeColor, getStatusColor } from "../../utils";
import { parseTags } from "../../form-utils/helpers";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ListingContactDialog } from "@/components/features/view-listing/listing-contact-dialog";

export type ListingCardVariant = "manage" | "browse" | "nearby" | "default";

export interface ListingCardProps {
  listing: Listing;
  variant?: ListingCardVariant;
  
  // Owner/Management props
  isOwner?: boolean;
  onDelete?: (listing: Listing) => void;
  onToggleVisibility?: (listing: Listing) => void;
  onEditListing?: (listing: Listing) => void;
  onShare?: (listing: Listing) => void;
  
  // Browse props
  onContact?: (listing: Listing) => void;
  hideContactButton?: boolean;
  
  // Nearby props
  isSelected?: boolean;
  onCardClick?: (id: string) => void;
  formatDistance?: (listing: Listing) => string;
  
  // Common props
  onViewDetails?: (listing: Listing) => void;
  compact?: boolean;
  className?: string;
}

export function ListingCard({
  listing,
  variant = "default",
  isOwner = false,
  onDelete,
  onToggleVisibility,
  onViewDetails,
  onEditListing,
  onShare,
  onContact,
  hideContactButton = false,
  isSelected = false,
  onCardClick,
  formatDistance,
  compact = false,
  className,
}: ListingCardProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  const tags = parseTags(listing.tags);
  const isUnavailable = listing.status === "Unavailable";

  // Get type color with dark mode support
  const getTypeColorWithDark = (type: string) => {
    const baseColor = getTypeColor(type);
    if (variant === "nearby") {
      // Nearby variant uses different color scheme
      switch (type.toLowerCase()) {
        case "free":
          return "bg-green-50 text-green-700 border-green-200";
        case "sale":
          return "bg-blue-50 text-blue-700 border-blue-200";
        case "wanted":
          return "bg-amber-50 text-amber-700 border-amber-200";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200";
      }
    }
    // Default dark mode variants
    if (type.toLowerCase() === "free")
      return `${baseColor} dark:bg-green-600 dark:text-white dark:border-green-600`;
    if (type.toLowerCase() === "wanted")
      return `${baseColor} dark:bg-yellow-600 dark:text-white dark:border-yellow-600`;
    if (type.toLowerCase() === "sale")
      return `${baseColor} dark:bg-red-600 dark:text-white dark:border-red-600`;
    return baseColor;
  };

  const getStatusColorWithDark = (status: string) => {
    const baseColor = getStatusColor(status);
    if (status.toLowerCase() === "active")
      return `${baseColor} dark:bg-green-600 dark:text-white`;
    if (status.toLowerCase() === "inactive" || status.toLowerCase() === "sold") {
      return `${baseColor} dark:bg-gray-600 dark:text-white`;
    }
    if (status.toLowerCase() === "unavailable")
      return `${baseColor} dark:bg-red-600 dark:text-white`;
    return baseColor;
  };

  const getStatusDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Visible";
      case "inactive":
        return "Hidden";
      case "sold":
        return "Sold";
      case "unavailable":
        return "Unavailable";
      default:
        return status;
    }
  };

  const handleCardClick = () => {
    if (variant === "nearby" && onCardClick) {
      onCardClick(listing.list_id);
    } else if (onViewDetails) {
      onViewDetails(listing);
    }
  };

  const handleContact = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (variant === "nearby") {
      setContactDialogOpen(true);
    } else {
      onContact?.(listing);
    }
  };

  // Nearby variant uses custom div instead of Card component
  if (variant === "nearby") {
    return (
      <>
        <div
          className={cn(
            "group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200",
            "hover:border-blue-300 hover:shadow-md",
            isSelected && "border-blue-500 shadow-md ring-1 ring-blue-500/20",
            className
          )}
          onClick={handleCardClick}
        >
          <div className="relative mb-3">
            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
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
            <Badge
              className={cn(
                "absolute top-2 left-2 text-xs font-medium border",
                getTypeColorWithDark(listing.type)
              )}
            >
              {listing.type}
            </Badge>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                {listing.title}
              </h3>
              {listing.type.toLowerCase() === "sale" && (
                <span className="font-semibold text-blue-600 text-sm whitespace-nowrap">
                  ₱{(listing.price || 0).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 line-clamp-2">{listing.description}</p>

            {/* Location and Distance */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, "")}
              </span>
              {formatDistance && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">{formatDistance(listing)}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex gap-1 overflow-hidden">
                {tags.slice(0, 2).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs h-5 px-2 text-gray-600 border-gray-300 flex-shrink-0"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs h-5 px-2 text-gray-500 flex-shrink-0"
                  >
                    +{tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-700">
                    {listing.User?.firstName?.[0] || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {listing.User?.firstName || listing.User?.lastName
                      ? `${listing.User.firstName || ""} ${listing.User.lastName || ""}`.trim()
                      : "User"}
                  </p>
                  {listing.User?.ratings && Number(listing.User.ratings) > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">
                        {Number(listing.User.ratings).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/user/listing/${listing.list_id}`;
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                {!isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-green-50"
                    onClick={handleContact}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Dialog */}
        <ListingContactDialog
          isOpen={contactDialogOpen}
          onClose={() => setContactDialogOpen(false)}
          listingId={listing.list_id}
          listingTitle={listing.title}
          listingImageURL={listing.imageURL}
          listingType={listing.type}
          ownerName={`${listing.User?.firstName || ""} ${listing.User?.lastName || ""}`.trim() ||
            "Owner"}
          ownerId={listing.user_id}
        />
      </>
    );
  }

  // Default, Manage, and Browse variants use Card component
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 py-0 flex flex-col",
        variant === "manage" && "min-h-[400px]",
        variant === "browse" && compact && "hover:shadow-md",
        variant === "browse" && !compact && "hover:shadow-lg hover:-translate-y-1",
        variant === "manage" &&
          (isUnavailable
            ? "opacity-60 grayscale hover:shadow-none cursor-not-allowed"
            : "hover:shadow-lg hover:-translate-y-1"),
        className
      )}
    >
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "overflow-hidden",
            compact ? "h-32" : "aspect-video"
          )}
        >
          <img
            src={listing.imageURL}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/food-waste.jpg";
            }}
          />
        </div>

        {/* Type badge */}
        <Badge
          className={cn(
            "absolute font-medium",
            compact ? "top-2 left-2 text-xs px-2 py-0.5" : "top-3 left-3",
            getTypeColorWithDark(listing.type)
          )}
        >
          {listing.type}
        </Badge>

        {/* Status badge - only for manage variant */}
        {variant === "manage" && (
          <Badge
            className={cn(
              "absolute top-3 right-3 font-medium",
              getStatusColorWithDark(listing.status)
            )}
          >
            {getStatusDisplayText(listing.status)}
          </Badge>
        )}
      </div>

      <CardContent className={cn("p-4 flex flex-col h-full", compact && "p-2.5")}>
        <div className={cn("flex-1 flex flex-col", compact ? "space-y-1.5" : "space-y-3")}>
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-card-foreground line-clamp-2 leading-tight",
                compact ? "text-sm" : "text-lg"
              )}
            >
              {listing.title}
            </h3>
            <div className="text-right shrink-0">
              {listing.type.toLowerCase() === "sale" && (
                <div
                  className={cn(
                    "font-bold text-card-foreground",
                    compact ? "text-base" : "text-xl"
                  )}
                >
                  {formatPrice(listing.price || 0, listing.type)}
                </div>
              )}
              {listing.quantity > 0 && (
                <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Package className="h-3 w-3" />
                  {listing.quantity}
                  {variant === "manage" && !compact && " available"}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {(!compact || variant === "manage") && (
            <div className={cn("flex flex-col justify-start", variant === "manage" && "min-h-[2.75rem]")}>
              <p
                className={cn(
                  "text-muted-foreground line-clamp-2 leading-relaxed break-words whitespace-normal",
                  compact ? "text-xs" : "text-sm"
                )}
              >
                {listing.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1 overflow-hidden">
              {tags.slice(0, compact ? 1 : 2).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "bg-muted text-muted-foreground hover:bg-muted/80 flex-shrink-0",
                    compact ? "text-[10px] px-1.5 py-0" : "text-xs"
                  )}
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > (compact ? 1 : 2) && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "bg-muted text-muted-foreground flex-shrink-0",
                    compact ? "text-[10px] px-1.5 py-0" : "text-xs"
                  )}
                >
                  +{tags.length - (compact ? 1 : 2)}
                </Badge>
              )}
            </div>
          )}

          {/* Location and Time */}
          <div
            className={cn(
              "text-xs text-muted-foreground",
              compact ? "space-y-0.5" : "space-y-2",
              variant === "manage" && "mt-auto pb-2"
            )}
          >
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className={cn("line-clamp-1", compact && "text-[11px]")}>
                {listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, "")}
              </span>
            </div>
            {(!compact || variant === "manage") && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Posted {formatDate(listing.postedDate)}</span>
              </div>
            )}
          </div>

          {/* User Info - only for browse variant */}
          {variant === "browse" && (
            <div
              className={cn(
                "flex items-center gap-2 border-t border-border",
                compact ? "pt-1.5" : "pt-2"
              )}
            >
              <Avatar className={compact ? "h-6 w-6" : "h-8 w-8"}>
                <AvatarImage src={listing.User?.profileURL} />
                <AvatarFallback className="text-xs bg-muted">
                  {listing.User?.firstName?.[0]}
                  {listing.User?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-card-foreground truncate",
                    compact ? "text-xs" : "text-sm"
                  )}
                >
                  {listing.User?.firstName} {listing.User?.lastName}
                </p>
                <div className="flex items-center gap-0.5">
                  <Star
                    className={cn(
                      "fill-yellow-400 text-yellow-400",
                      compact ? "h-2.5 w-2.5" : "h-3 w-3"
                    )}
                  />
                  <span
                    className={cn(
                      "text-muted-foreground",
                      compact ? "text-[10px]" : "text-xs"
                    )}
                  >
                    {Number(listing.User?.ratings || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            "mt-auto border-t border-border/50",
            variant === "manage" && "pt-3 space-y-3",
            variant === "browse" && (compact ? "pt-1.5" : "pt-2")
          )}
        >
          {/* Owner Action Buttons - only for manage variant */}
          {variant === "manage" && isOwner && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isUnavailable}
                className={cn(
                  "flex-1 disabled:opacity-50 disabled:cursor-not-allowed",
                  listing.status === "Active"
                    ? "border-gray-500 text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                    : "border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                )}
                onClick={(e) => {
                  if (isUnavailable) return;
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
                disabled={isUnavailable}
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  if (isUnavailable) return;
                  e.stopPropagation();
                  onDelete?.(listing);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {listing.status === "Unavailable" ? "Unavailable" : "Delete"}
              </Button>
            </div>
          )}

          {/* Main Action Buttons */}
          <div
            className={cn(
              "flex gap-2",
              variant === "browse" && (isOwner || hideContactButton) && "justify-center"
            )}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={variant === "manage" && isUnavailable}
              className={cn(
                "border-border hover:bg-muted/50 flex-1",
                variant === "manage" && "disabled:opacity-50 disabled:cursor-not-allowed",
                variant === "browse" && compact && "text-xs h-8 px-3"
              )}
              onClick={(e) => {
                if (variant === "manage" && isUnavailable) return;
                e.stopPropagation();
                onViewDetails?.(listing);
              }}
            >
              View Details
            </Button>

            {/* Edit button - only for manage variant */}
            {variant === "manage" && isOwner && (
              <Button
                variant="outline"
                size="sm"
                disabled={isUnavailable}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  if (isUnavailable) return;
                  e.stopPropagation();
                  onEditListing?.(listing);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {/* Share button - only for manage variant */}
            {variant === "manage" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isUnavailable}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  if (isUnavailable) return;
                  e.stopPropagation();
                  onShare?.(listing);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}

            {/* Contact button - only for browse variant */}
            {variant === "browse" && !isOwner && !hideContactButton && (
              <Button
                size="sm"
                className={cn(
                  "flex-1 bg-green-600 hover:bg-green-700 text-white",
                  compact && "text-xs h-8 px-3"
                )}
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
        </div>
      </CardContent>
    </Card>
  );
}

