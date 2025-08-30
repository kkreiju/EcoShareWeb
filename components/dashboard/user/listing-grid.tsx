"use client";

import { useState, useEffect, useCallback } from "react";
import { ListingCard } from "./listing-card";
import { ListingSearch } from "./listing-search";
import { ListingSkeleton } from "./listing-skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Listing, ListingFilters, ListingsResponse } from "@/lib/DataClass";

type CategoryType = NonNullable<ListingFilters["type"]> | "all";
type PriceRangeType = NonNullable<ListingFilters["price"]> | "all";
type SortType = "recent" | "nearby";

interface SearchFilters extends Omit<ListingFilters, "type" | "price"> {
  query: string;
  category: CategoryType;
  priceRange: PriceRangeType;
}

// Fetch listings from API
async function fetchListings(filters: {
  list_type?: string;
  list_price?: string;
  sort_by?: string;
}): Promise<ListingsResponse> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api-ecoshare.vercel.app";
  const params = new URLSearchParams();

  if (filters.list_type && filters.list_type !== "all") {
    params.append("list_type", filters.list_type);
  }
  if (filters.list_price && filters.list_price !== "all") {
    params.append("list_price", filters.list_price);
  }
  if (filters.sort_by) {
    params.append("sort_by", filters.sort_by);
  }

  const url = `${API_BASE_URL}/api/listing/view-listing?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }

  return response.json();
}

// Price range bounds mapping
const PRICE_RANGES: Record<PriceRangeType, [number, number]> = {
  under25: [0, 25],
  "25-50": [25, 50],
  "50-100": [50, 100],
  over100: [100, Number.MAX_SAFE_INTEGER],
  all: [0, Number.MAX_SAFE_INTEGER],
};

// Category mapping for consistent filtering
const CATEGORY_MAP: Record<CategoryType, string> = {
  all: "",
  sale: "sale",
  free: "free",
  wanted: "wanted",
};

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<SortType>("recent");
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    priceRange: "all",
  });

  // Load initial data
  useEffect(() => {
    loadListings();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    if (listings.length > 0) {
      applyFilters();
    }
  }, [listings, currentFilters, tab]);

  const loadListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchListings({
        sort_by: "newest",
      });

      if (response.data) {
        setListings(response.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load listings";
      setError(errorMessage);
      console.error("Error loading listings:", err);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply client-side sorting based on tab selection
  const applySorting = useCallback(
    (items: Listing[], sortType: SortType): Listing[] => {
      const sorted = [...items];

      switch (sortType) {
        case "recent":
          return sorted.sort(
            (a, b) =>
              new Date(b.postedDate).getTime() -
              new Date(a.postedDate).getTime()
          );
        case "nearby":
          return sorted.sort((a, b) =>
            a.locationName.localeCompare(b.locationName)
          );
        default:
          return sorted;
      }
    },
    []
  );

  // Centralized filtering and sorting logic
  const applyFilters = useCallback(() => {
    let filtered = [...listings];

    // Search query filter
    if (currentFilters.query.trim()) {
      const searchTerm = currentFilters.query.toLowerCase();
      filtered = filtered.filter((listing) => {
        const tagsArray = Array.isArray(listing.tags)
          ? listing.tags
          : typeof listing.tags === "string"
          ? [listing.tags]
          : [];

        const searchableFields = [
          listing.title,
          listing.description,
          ...tagsArray,
          listing.User
            ? `${listing.User.firstName} ${listing.User.lastName}`
            : "",
        ].map((field) => field.toLowerCase());

        return searchableFields.some((field) => field.includes(searchTerm));
      });
    }

    // Category filter
    if (currentFilters.category !== "all") {
      const targetType = CATEGORY_MAP[currentFilters.category];
      filtered = filtered.filter((listing) => {
        const listingType = (listing.type || "").toString().toLowerCase();
        return listingType === targetType;
      });
    }

    // Price range filter
    if (currentFilters.priceRange !== "all") {
      const [minPrice, maxPrice] = PRICE_RANGES[currentFilters.priceRange];
      filtered = filtered.filter((listing) => {
        const price = listing.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply sorting
    const sorted = applySorting(filtered, tab);
    setFilteredListings(sorted);
  }, [listings, currentFilters, tab, applySorting]);

  // Handle search filter updates
  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  return (
    <div className="space-y-6">
      <ListingSearch onSearch={handleSearch} listings={listings} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "recent" | "nearby")}>
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <ListingGridContent
            isLoading={isLoading}
            listings={filteredListings}
          />
        </TabsContent>
        <TabsContent value="nearby">
          <ListingGridContent
            isLoading={isLoading}
            listings={filteredListings}
          />
        </TabsContent>
      </Tabs>

      {error && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Listings
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={loadListings}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No listings found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}

// Extracted grid content component to reduce duplication
function ListingGridContent({
  isLoading,
  listings,
}: {
  isLoading: boolean;
  listings: Listing[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {isLoading
        ? Array.from({ length: 12 }).map((_, i) => (
            <ListingSkeleton key={`skeleton-${i}`} />
          ))
        : listings.map((listing) => (
            <ListingCard key={listing.list_id} listing={listing} />
          ))}
    </div>
  );
}
