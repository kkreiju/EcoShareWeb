"use client";

import { Listing } from "@/lib/types";
import { ListingCard, ListingFiltersComponent } from "../../shared";
import { ListingsTable } from "../../listings-table";
import { LoadingSkeleton, TableSkeleton, EmptyState, SearchBar } from "../../shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ListingFilters } from "@/lib/types";
import { formatPrice, formatDate, getTypeColor } from "../../shared/utils";

interface ManageListingsContentProps {
  listings: Listing[];
  filters: ListingFilters;
  searchQuery: string;
  totalCount: number;
  viewMode: "grid" | "list";
  isLoading: boolean;
  userDataLoading: boolean;
  error: string | null;
  isOwner: (listing: Listing) => boolean;
  onFiltersChange: (filters: ListingFilters) => void;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onRefresh: () => void;
  onDelete: (listing: Listing) => void;
  onToggleVisibility: (listing: Listing) => void;
  onEdit: (listing: Listing) => void;
  onViewDetails: (listing: Listing) => void;
  onShare: (listing: Listing) => void;
}

export function ManageListingsContent({
  listings,
  filters,
  searchQuery,
  totalCount,
  viewMode,
  isLoading,
  userDataLoading,
  error,
  isOwner,
  onFiltersChange,
  onSearchChange,
  onViewModeChange,
  onRefresh,
  onDelete,
  onToggleVisibility,
  onEdit,
  onViewDetails,
  onShare,
}: ManageListingsContentProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="space-y-2">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search for items, descriptions, locations..."
          isLoading={isLoading || userDataLoading}
          showSuggestions={true}
        />
        {searchQuery && !isLoading && !userDataLoading && (
          <div className="text-sm text-muted-foreground">
            Found {totalCount} result{totalCount !== 1 ? "s" : ""} for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Filters */}
      <ListingFiltersComponent
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalCount={totalCount}
        isLoading={isLoading || userDataLoading}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showPriceFilter={false}
        showSortFilter={true}
        showAvailabilityFilter={true}
        showNearbyButton={false}
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
              onClick={onRefresh}
              className="p-0 h-auto hover:text-destructive self-start sm:self-center"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {isLoading || userDataLoading ? (
        viewMode === "grid" ? (
          <LoadingSkeleton />
        ) : (
          <TableSkeleton />
        )
      ) : listings.length === 0 ? (
        <EmptyState onRefresh={onRefresh} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.list_id}
              variant="manage"
              listing={listing}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              onEditListing={onEdit}
              onViewDetails={onViewDetails}
              onShare={onShare}
              isOwner={isOwner(listing)}
            />
          ))}
        </div>
      ) : (
        <ListingsTable
          listings={listings}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
          onEditListing={onEdit}
          onShare={onShare}
          onViewDetails={onViewDetails}
          isOwner={isOwner}
          formatPrice={formatPrice}
          formatDate={formatDate}
          getTypeColor={getTypeColor}
        />
      )}
    </>
  );
}

