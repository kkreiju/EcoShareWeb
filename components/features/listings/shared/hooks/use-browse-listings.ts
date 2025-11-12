"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingFilters, ListingsResponse } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

interface UseBrowseListingsReturn {
  // State
  listings: Listing[];
  filters: ListingFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  viewMode: "grid" | "list";
  userData: any;
  userDataLoading: boolean;
  
  // Actions
  setFilters: (filters: ListingFilters) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  fetchListings: () => Promise<void>;
  isOwner: (listing: Listing) => boolean;
}

interface UseBrowseListingsOptions {
  excludeOwnListings?: boolean;
  endpoint?: string;
}

/**
 * Custom hook for browsing public listings
 * Handles fetching, filtering, and user data management for public listing views
 */
export function useBrowseListings(options: UseBrowseListingsOptions = {}): UseBrowseListingsReturn {
  const { excludeOwnListings = true, endpoint = "/api/listing/view-listing" } = options;
  
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

  // Fetch user data when user changes, with caching to prevent data loss
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        if (!cachedUserEmail && !userData) {
          setUserDataLoading(false);
        }
        return;
      }

      if (user.email === cachedUserEmail && userData) {
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id, user_membershipStatus")
          .eq("user_email", user.email)
          .single();

        if (error) {
          if (!userData) {
            setUserData(null);
          }
        } else {
          setUserData(data);
          setCachedUserEmail(user.email);
        }
      } catch (err) {
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
  const isOwner = useCallback((listing: Listing) => {
    if (userDataLoading) {
      return false;
    }

    if (!userData && !cachedUserEmail) {
      return false;
    }

    if (userData) {
      const currentUserId = String(userData.user_id);
      const listingUserId = String(listing.user_id);
      return currentUserId === listingUserId;
    }

    return false;
  }, [userData, userDataLoading, cachedUserEmail]);

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

      const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url, {
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

      // Filter out the current user's own listings if excludeOwnListings is true
      if (excludeOwnListings && userData?.user_id) {
        filteredData = filteredData.filter((listing: any) => listing.user_id !== userData.user_id);
        filteredCount = filteredData.length;
      }

      // Apply client-side price filtering if needed
      if (filters.price && filters.price !== "all") {
        filteredData = filteredData.filter((item) => {
          if (
            item.price === null ||
            item.price === undefined ||
            item.price === 0
          ) {
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
          if (item.title.toLowerCase().includes(searchTerm)) return true;
          if (item.description.toLowerCase().includes(searchTerm)) return true;
          if (item.tags && Array.isArray(item.tags)) {
            if (item.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) return true;
          }
          if (item.locationName.toLowerCase().includes(searchTerm)) return true;
          if (item.type.toLowerCase().includes(searchTerm)) return true;
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
  }, [filters, searchQuery, userData?.user_id, excludeOwnListings, endpoint]);

  // Initial load and refetch when filters/search/userData changes
  useEffect(() => {
    if (!excludeOwnListings || userData?.user_id) {
      fetchListings();
    }
  }, [fetchListings, userData?.user_id, excludeOwnListings]);

  return {
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
  };
}

