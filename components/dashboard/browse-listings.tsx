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
import { ListingContactDialog } from "@/components/view-listing/listing-contact-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/api";

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

  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [cachedUserEmail, setCachedUserEmail] = useState<string | null>(null);
  const { user } = useAuth();

  // Contact dialog state
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);


  // Fetch user data when user changes, with caching to prevent data loss
  useEffect(() => {
    const fetchUserData = async () => {
      // If user.email is undefined but we have cached data, keep current state
      if (!user?.email) {
        if (!cachedUserEmail && !userData) {
          setUserDataLoading(false);
        }
        return;
      }

      // If email hasn't changed and we already have data, skip fetch
      if (user.email === cachedUserEmail && userData) {
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", user.email)
          .single();

        if (error) {
          // Don't clear existing data on error
          if (!userData) {
            setUserData(null);
          }
        } else {
          setUserData(data);
          setCachedUserEmail(user.email);
        }
      } catch (err) {
        // Don't clear existing data on error
        if (!userData) {
          setUserData(null);
        }
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email, cachedUserEmail, userData]);

  // Check if current user owns the listing
  const isOwner = (listing: Listing) => {
    // If still loading, return false
    if (userDataLoading) {
      return false;
    }

    // If no user data and no cached email, return false
    if (!userData && !cachedUserEmail) {
      return false;
    }

    // If we have user data, use it for ownership check
    if (userData) {
      const currentUserId = String(userData.user_id);
      const listingUserId = String(listing.user_id);
      return currentUserId === listingUserId;
    }

    // Conservative fallback: return false if no userData but have cached email
    return false;
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

      if (filters.sort_by) {
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

      // Apply client-side price filtering if needed
      if (filters.price && filters.price !== "all") {
        // Filter by price range
        filteredData = filteredData.filter((item) => {
          if (
            item.price === null ||
            item.price === undefined ||
            item.price === 0
          ) {
            // Free items - only show in "Under ₱25" range
            return filters.price === "under25";
          }

          switch (filters.price) {
            case "under25":
              return item.price > 0 && item.price < 25;
            case "25-50":
              return item.price >= 25 && item.price < 50;
            case "50-100":
              return item.price >= 50 && item.price < 100;
            case "over100":
              return item.price >= 100;
            default:
              return true;
          }
        });

        filteredCount = filteredData.length;
      }

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

      setListings(filteredData);
      setTotalCount(filteredCount);
    } catch (err) {
      console.error("Error fetching listings:", err);
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
              Found {totalCount} result{totalCount !== 1 ? "s" : ""} for "
              <span className="truncate inline-block max-w-32 sm:max-w-none">{searchQuery}</span>"
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
        {isLoading ? (
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
        />
      )}

    </>
  );
}
