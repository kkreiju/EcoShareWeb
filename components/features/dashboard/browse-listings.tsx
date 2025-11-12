"use client";

import { useState } from "react";
import { Listing, ListingFilters } from "@/lib/types";
import { ListingCard, ListingFiltersComponent } from "../listings/shared";
import { ListingsTable } from "./listings-table";
import { ListingContactDialog } from "@/components/features/view-listing/listing-contact-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { formatPrice, formatDate, getTypeColor } from "../listings/shared/utils";
import { useBrowseListings } from "../listings/shared/hooks/use-browse-listings";
import { EmptyState, LoadingSkeleton, TableSkeleton, SearchBar } from "../listings/shared";

interface BrowseListingsProps {
  className?: string;
}

export function BrowseListings({ className = "" }: BrowseListingsProps) {
  const {
    listings,
    filters,
    searchQuery,
    isLoading,
    error,
    totalCount,
    viewMode,
    userData,
    userDataLoading,
    setFilters,
    setSearchQuery,
    setViewMode,
    fetchListings,
    isOwner,
  } = useBrowseListings({ excludeOwnListings: true });

  // Contact dialog state
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchListings();
  };

  const handleContactListing = (listing: Listing) => {
    // Only allow contact if user is not the owner
    if (!isOwner(listing)) {
      setSelectedListing(listing);
      setIsContactDialogOpen(true);
    }
  };

  const handleViewDetails = (listing: Listing) => {
    // Navigate to listing details page
    window.location.href = `/user/listing/${listing.list_id}`;
  };


  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Browse Listings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Find sustainable items shared by your community
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-border w-full sm:w-auto justify-center sm:justify-start"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 flex-shrink-0 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="truncate">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for items, descriptions, locations..."
            isLoading={isLoading}
            showSuggestions={true}
          />
          {searchQuery && !isLoading && (
            <div className="text-sm text-muted-foreground">
              Found {totalCount} result{totalCount !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Filters */}
        <ListingFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={totalCount}
          isLoading={isLoading}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          userMembershipStatus={userData?.user_membershipStatus?.toLowerCase()}
          showPriceFilter={true}
          showSortFilter={false}
          showAvailabilityFilter={false}
          showNearbyButton={true}
        />

        {/* Error State */}
        {error && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="flex-1">{error}</span>
              <Button
                variant="link"
                size="sm"
                onClick={handleRefresh}
                className="p-0 h-auto hover:text-destructive self-start sm:self-center"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {userDataLoading || isLoading ? (
          viewMode === "grid" ? (
            <LoadingSkeleton />
          ) : (
            <TableSkeleton />
          )
        ) : listings.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.list_id}
                variant="browse"
                listing={listing}
                onContact={handleContactListing}
                onViewDetails={handleViewDetails}
                isOwner={isOwner(listing)}
              />
            ))}
          </div>
        ) : (
          <ListingsTable
            listings={listings}
            onContact={handleContactListing}
            onViewDetails={handleViewDetails}
            isOwner={isOwner}
            formatPrice={formatPrice}
            formatDate={formatDate}
            getTypeColor={getTypeColor}
          />
        )}

        {/* Load More - Future Enhancement */}
        {listings.length > 0 && listings.length < totalCount && (
          <div className="text-center pt-6 sm:pt-8">
            <Button variant="outline" className="border-border w-full sm:w-auto">
              Load More Listings
            </Button>
          </div>
        )}
      </div>

      {/* Contact Dialog */}
      {selectedListing && (
        <ListingContactDialog
          isOpen={isContactDialogOpen}
          onClose={() => {
            setIsContactDialogOpen(false);
            setSelectedListing(null);
          }}
          listingId={selectedListing.list_id}
          listingTitle={selectedListing.title}
          listingImageURL={selectedListing.imageURL}
          listingType={selectedListing.type}
          ownerName={`${selectedListing.User?.firstName || ''} ${selectedListing.User?.lastName || ''}`.trim() || 'Owner'}
          ownerId={selectedListing.user_id}
        />
      )}

    </>
  );
}
