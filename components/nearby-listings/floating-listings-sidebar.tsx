"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw,
  Heart,
  Eye,
  MessageCircle,
  Star,
  Clock
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FloatingListingsSidebarProps {
  listings: Listing[];
  isLoading: boolean;
  totalCount: number;
  isVisible: boolean;
  onToggle: () => void;
  selectedListingId?: string | null;
  onCardClick?: (id: string) => void;
  onRefresh?: () => void;
  isOwner?: (listing: Listing) => boolean;
  formatDistance?: (listing: Listing) => string;
}

export function FloatingListingsSidebar({ 
  listings, 
  isLoading, 
  totalCount,
  isVisible,
  onToggle,
  selectedListingId, 
  onCardClick,
  onRefresh,
  isOwner,
  formatDistance 
}: FloatingListingsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter listings based on search
  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
        "absolute top-4 z-30 bg-background/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300",
        isVisible ? "left-96 md:left-[28rem]" : "left-4"
        )}
        onClick={onToggle}
      >
        {isVisible ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Floating Sidebar */}
      <div className={cn(
        "absolute top-4 left-4 bottom-4 w-96 md:w-[28rem] bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl transition-all duration-300 z-20",
        "flex flex-col overflow-hidden min-w-0",
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}>
        
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Nearby Listings</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${totalCount} items found`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              className="pl-10 h-9 border-input focus:border-primary focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <MapPin className="h-3 w-3 mr-1" />
              {filteredListings.length} nearby
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="text-xs border-border">
                Filtered
              </Badge>
            )}
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="p-6 space-y-6 w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Loading nearby listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-medium text-foreground mb-1">
                  {searchQuery ? "No matching listings" : "No listings found"}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Check back later for new items in your area"
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="border-border hover:bg-accent"
                  >
                    Clear search
                  </Button>
                )}
              </div>
              ) : (
                filteredListings.map((listing) => (
                  <ListingItem 
                    key={listing.list_id}
                    listing={listing}
                    isSelected={selectedListingId === listing.list_id}
                    isOwner={isOwner ? isOwner(listing) : false}
                    onCardClick={onCardClick}
                    formatDistance={formatDistance}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Always Visible */}
        <div className="flex-shrink-0 p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updated now</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-accent">
              <SlidersHorizontal className="h-3 w-3 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Inline ListingItem component - Fully Responsive
interface ListingItemProps {
  listing: Listing;
  isSelected?: boolean;
  isOwner?: boolean;
  onCardClick?: (id: string) => void;
  formatDistance?: (listing: Listing) => string;
}

function ListingItem({
  listing,
  isSelected = false,
  isOwner = false,
  onCardClick,
  formatDistance
}: ListingItemProps) {
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
    if (type.toLowerCase() === 'free') return 'Free';
    if (type.toLowerCase() === 'wanted') return 'Wanted';
    return `₱${price.toLocaleString()}`;
  };

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg cursor-pointer transition-all duration-200",
        "hover:border-primary hover:shadow-md",
        isSelected && "border-primary shadow-md ring-1 ring-primary/20",
        "w-full" // Ensure full width like search and filter
      )}
      onClick={handleClick}
    >
      <div className="p-4"> {/* Same padding as header and footer */}
        {/* Image and Type Badge */}
        <div className="relative mb-3">
          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
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

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Toggle favorite:", listing.list_id);
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Fully Responsive */}
        <div className="space-y-3">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-card-foreground text-base flex-1 leading-tight">
              {listing.title}
            </h3>
            <span className="font-bold text-primary text-lg whitespace-nowrap flex-shrink-0">
              {formatPrice(listing.price || 0, listing.type)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {listing.description}
          </p>

          {/* Location and Distance */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{listing.locationName}</span>
            {formatDistance && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-primary font-medium">
                  {formatDistance(listing)}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {Array.isArray(listing.tags) && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-1 text-muted-foreground border-border"
                >
                  {tag}
                </Badge>
              ))}
              {listing.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground border-border">
                  +{listing.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* User Info and Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {listing.User?.firstName?.[0] || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {listing.User ?
                    `${listing.User.firstName || ''} ${listing.User.lastName || ''}`.trim() || 'User'
                    : 'User'
                  }
                </p>
                {listing.User?.ratings && parseFloat(listing.User.ratings) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {parseFloat(listing.User.ratings).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 hover:bg-accent border-border"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("View listing:", listing.list_id);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 hover:bg-accent border-border"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Contact owner:", listing.list_id);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted 2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
