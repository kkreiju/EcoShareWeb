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
  Clock,
  Route
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { ListingContactDialog, SidebarListingCard } from "@/components/view-listing";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onDirectionsClick?: (listing: Listing) => void;
  hasUserLocation?: boolean;
  isShowingDirections?: boolean;
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
  formatDistance,
  onDirectionsClick,
  hasUserLocation,
  isShowingDirections
}: FloatingListingsSidebarProps) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedContactListing, setSelectedContactListing] = useState<Listing | null>(null);

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
        "absolute bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 z-20",
        "flex flex-col overflow-hidden min-w-0",
        "text-gray-900", // Force light mode text
        isMobile
          ? [
              // Mobile: Full width with small margins, slide from bottom
              "left-2 right-2 top-2 bottom-2",
              "max-h-[90vh]", // Leave some space at top for status bar
              isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            ]
          : [
              // Desktop: Fixed width sidebar, slide from left
              "top-4 left-4 bottom-4 w-96 md:w-[28rem]",
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            ]
      )}>
        
        {/* Header */}
        <div className={cn(
          "border-b border-gray-200 bg-gray-50/50",
          isMobile ? "p-4" : "p-6"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h2 className={cn(
                "font-semibold text-gray-900 truncate",
                isMobile ? "text-base" : "text-lg"
              )}>
                Nearby Listings
              </h2>
              <p className="text-sm text-gray-600">
                {isLoading ? "Loading..." : `${totalCount} items found`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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
            <div className={cn(
              "w-full",
              isMobile ? "p-4 space-y-4" : "p-6 space-y-6"
            )}>
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
                  <SidebarListingCard
                    key={listing.list_id}
                    listing={listing}
                    isSelected={selectedListingId === listing.list_id}
                    isOwner={isOwner ? isOwner(listing) : false}
                    onCardClick={onCardClick}
                    formatDistance={formatDistance}
                    onContactClick={(listing) => {
                      setSelectedContactListing(listing);
                      setContactDialogOpen(true);
                    }}
                    onDirectionsClick={onDirectionsClick}
                    hasUserLocation={hasUserLocation}
                    isShowingDirections={isShowingDirections}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className={cn(
          "flex-shrink-0 border-t border-gray-200 bg-gray-50/80",
          isMobile ? "p-4" : "p-6"
        )}>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Updated now</span>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      {selectedContactListing && (
        <ListingContactDialog
          isOpen={contactDialogOpen}
          onClose={() => {
            setContactDialogOpen(false);
            setSelectedContactListing(null);
          }}
          listingId={selectedContactListing.list_id}
          listingTitle={selectedContactListing.title}
          listingImageURL={selectedContactListing.imageURL}
          listingType={selectedContactListing.type}
          ownerName={`${selectedContactListing.User?.firstName || ''} ${selectedContactListing.User?.lastName || ''}`.trim() || 'Owner'}
        />
      )}
    </>
  );
}

