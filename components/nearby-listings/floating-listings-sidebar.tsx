"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronRight,
  X,
  MapPin,
  RefreshCw,
  Eye,
  MessageCircle,
  Star,
  Clock
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, forwardRef } from "react";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected listing when it changes
  useEffect(() => {
    if (selectedListingId && selectedItemRef.current && scrollAreaRef.current) {
      // Small delay to ensure the DOM is updated
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [selectedListingId]);

  // Filter listings based on search
  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Toggle Button - Only show when sidebar is closed */}
      {!isVisible && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 z-30 bg-background/95 backdrop-blur border border-border shadow-md rounded-md px-3 py-2"
          onClick={onToggle}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Floating Sidebar */}
      <div className={cn(
        "absolute top-4 left-4 bottom-4 w-96 md:w-[28rem] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 z-20",
        "flex flex-col overflow-hidden min-w-0",
        "text-gray-900", // Force light mode text
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Nearby Listings</h2>
              <p className="text-sm text-gray-600">
                {isLoading ? "Loading..." : `${totalCount} items found`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search listings..."
              className="pl-10 h-9 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <MapPin className="h-3 w-3 mr-1" />
              {filteredListings.length} nearby
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                Filtered
              </Badge>
            )}
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-6 w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-500 mb-3" />
                <p className="text-sm text-gray-600">Loading nearby listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">
                  {searchQuery ? "No matching listings" : "No listings found"}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
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
                    className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors duration-200"
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
                    ref={selectedListingId === listing.list_id ? selectedItemRef : null}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50/80">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Updated now</span>
          </div>
        </div>
      </div>
    </>
  );
}

interface ListingItemProps {
  listing: Listing;
  isSelected?: boolean;
  isOwner?: boolean;
  onCardClick?: (id: string) => void;
  formatDistance?: (listing: Listing) => string;
}

const ListingItem = forwardRef<HTMLDivElement, ListingItemProps>(({
  listing,
  isSelected = false,
  isOwner = false,
  onCardClick,
  formatDistance
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
        "w-full"
      )}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="relative mb-3">
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
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

        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-gray-900 text-base flex-1 leading-tight">
              {listing.title}
            </h3>
            {formatPrice(listing.price || 0, listing.type) && (
            <span className="font-bold text-red-600 text-lg whitespace-nowrap flex-shrink-0">
              {formatPrice(listing.price || 0, listing.type)}
            </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {listing.description}
          </p>

          {/* Location and Distance */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{listing.locationName}</span>
            {formatDistance && (
              <>
              <span className="text-gray-400">•</span>
              <span className="text-blue-600 font-medium">
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
                  className="text-xs px-2 py-1 text-gray-600 border-gray-300 bg-gray-50"
                >
                  {tag}
                </Badge>
              ))}
              {listing.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500 border-gray-300 bg-gray-50">
                  +{listing.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* User Info and Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {listing.User?.profileURL ? (
                  <img
                    src={listing.User.profileURL}
                    alt={`${listing.User.firstName || 'User'} profile`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to letter avatar if image fails to load
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-medium text-gray-600">${listing.User?.firstName?.[0] || 'U'}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {listing.User?.firstName?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {listing.User?.firstName || listing.User?.lastName
                    ? `${listing.User.firstName || ''} ${listing.User.lastName || ''}`.trim()
                    : 'User'
                  }
                </p>
                {listing.User?.ratings && Number(listing.User.ratings) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">
                      {Number(listing.User.ratings).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 px-3 bg-gray-600 text-white hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {!isOwner && (
                  <Button
                    variant="default"
                    size="sm"
                    className={`h-9 px-3 text-white hover:text-white transition-colors duration-200 ${
                      listing.type.toLowerCase() === 'wanted'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {listing.type.toLowerCase() === 'wanted' ? 'Offer' : 'Request'}
                  </Button>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

ListingItem.displayName = "ListingItem";
