"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingFilters, ListingsResponse } from "@/lib/DataClass";
import { useAuth } from "@/hooks/use-auth";
import { ListingCard } from "./listing-card";
import { ListingFiltersComponent } from "./listing-filters";
import { SearchBar } from "./search-bar";
import { LoadingSkeleton, TableSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";
import { ListingsTable } from "./listings-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";

interface BrowseListingsProps {
  className?: string;
}

export function BrowseListings({ className = "" }: BrowseListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { user } = useAuth();

  // Check if current user owns the listing
  const isOwner = (listing: Listing) => {
    return user?.id === listing.user_id;
  };

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.type && filters.type !== "all") {
        params.append("list_type", filters.type);
      }

      if (filters.availabilityStatus && filters.availabilityStatus !== "all") {
        params.append("status", filters.availabilityStatus);
      }

      if (filters.sort_by && filters.sort_by !== null) {
        params.append("sort_by", filters.sort_by);
      }

      const url = `/api/listing/view-listing${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data: ListingsResponse = await response.json();

      let filteredData = data.data || [];
      let filteredCount = data.total_count || 0;


      // Apply client-side search filtering if needed
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();

        filteredData = filteredData.filter((item) => {
          // Search in title
          if (item.title.toLowerCase().includes(searchTerm)) {
            return true;
          }

          // Search in description
          if (item.description.toLowerCase().includes(searchTerm)) {
            return true;
          }

          // Search in tags (if they exist)
          if (item.tags && Array.isArray(item.tags)) {
            return item.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm)
            );
          }

          // Search in location name
          if (item.locationName.toLowerCase().includes(searchTerm)) {
            return true;
          }

          // Search in category/type
          if (item.type.toLowerCase().includes(searchTerm)) {
            return true;
          }

          return false;
        });

        filteredCount = filteredData.length;
      }

      // Apply client-side sorting if needed
      if (filters.sort_by && filters.sort_by !== null) {
        filteredData = filteredData.sort((a, b) => {
          switch (filters.sort_by) {
            case "newest":
              return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            case "oldest":
              return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
            case "price_high":
              return (b.price || 0) - (a.price || 0);
            case "price_low":
              return (a.price || 0) - (b.price || 0);
            default:
              return 0;
          }
        });
      }

      setListings(filteredData);
      setTotalCount(filteredCount);
    } catch (err) {
      console.error("❌ Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
      setListings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchQuery]);

  // Initial load and refetch when filters/search changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchListings();
  };

  const handleDeleteListing = (listing: Listing) => {
    // Only allow delete if user is the owner
    if (isOwner(listing)) {
      // TODO: Implement delete functionality
      console.log("Delete listing:", listing.list_id);
    }
  };

  const handleToggleVisibility = (listing: Listing) => {
    // Only allow toggle visibility if user is the owner
    if (isOwner(listing)) {
      // TODO: Implement toggle visibility functionality
      console.log("Toggle visibility for listing:", listing.list_id);
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === "free") return "Free";
    if (type.toLowerCase() === "wanted") return "Wanted";
    return `₱${price?.toFixed(2) || "0.00"}`;
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-500 text-white";
      case "wanted":
        return "bg-yellow-500 text-white";
      case "sale":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "sold":
        return "bg-gray-500 text-white";
      case "unavailable":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Browse Listings
            </h1>
            <p className="text-muted-foreground mt-1">
              Find sustainable items shared by your community
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-border"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
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
              Found {totalCount} result{totalCount !== 1 ? "s" : ""} for "
              {searchQuery}"
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
        />

        {/* Error State */}
        {error && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={handleRefresh}
                className="ml-2 p-0 h-auto hover:text-destructive"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {isLoading ? (
          viewMode === "grid" ? (
            <LoadingSkeleton />
          ) : (
            <TableSkeleton />
          )
        ) : listings.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.list_id}
                listing={listing}
                onDelete={handleDeleteListing}
                onToggleVisibility={handleToggleVisibility}
                isOwner={isOwner(listing)}
              />
            ))}
          </div>
        ) : (
          <ListingsTable
            listings={listings}
            onDelete={handleDeleteListing}
            onToggleVisibility={handleToggleVisibility}
            isOwner={isOwner}
            formatPrice={formatPrice}
            formatDate={formatDate}
            getTypeColor={getTypeColor}
          />
        )}

        {/* Load More - Future Enhancement */}
        {listings.length > 0 && listings.length < totalCount && (
          <div className="text-center pt-8">
            <Button variant="outline" className="border-border">
              Load More Listings
            </Button>
          </div>
        )}
      </div>

    </>
  );
}
