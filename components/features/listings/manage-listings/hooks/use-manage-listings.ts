"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingFilters } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

interface UseManageListingsReturn {
  // State
  listings: Listing[];
  allListings: Listing[];
  filters: ListingFilters;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  viewMode: "grid" | "list";
  userData: any;
  userDataLoading: boolean;
  pendingRequestsCount: number;
  
  // Actions
  setFilters: (filters: ListingFilters) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  fetchListings: () => Promise<void>;
  fetchPendingRequestsCount: () => Promise<void>;
  isOwner: (listing: Listing) => boolean;
  updateListingStatus: (listingId: string, status: "Active" | "Inactive" | "Sold" | "Unavailable") => void;
}

/**
 * Custom hook for managing listings
 * Handles fetching, filtering, and user data management
 */
export function useManageListings(): UseManageListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

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
          .select("user_id")
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

      if (!userData?.user_id) {
        return;
      }

      const url = `/api/listing/manage-listing?user_id=${userData.user_id}`;

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

      const data = await response.json();
      const listingsData = data.data || [];

      const mappedListings = listingsData.map((apiListing: any) => {
        return {
          user_id: apiListing.user_id,
          list_id: apiListing.list_id,
          title: apiListing.title,
          type: apiListing.type,
          imageURL: apiListing.imageURL,
          description: apiListing.description,
          tags: apiListing.tags ? JSON.parse(apiListing.tags) : [],
          price: apiListing.price,
          quantity: apiListing.quantity,
          pickupTimeAvailability: apiListing.pickupTimeAvailability,
          instructions: apiListing.instructions,
          locationName: apiListing.locationName,
          latitude: apiListing.latitude,
          longitude: apiListing.longitude,
          status: apiListing.status?.trim() || "Active",
          category: apiListing.type,
          postedDate: apiListing.postedDate,
        };
      });

      setAllListings(mappedListings);
      setTotalCount(mappedListings.length);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
      setAllListings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.user_id]);

  const fetchPendingRequestsCount = useCallback(async () => {
    if (!userData?.user_id) return;

    try {
      const response = await fetch(
        `/api/transaction/review-requests?user_id=${userData.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.requests) {
          const pendingCount = data.requests.filter((req: any) => req.status === "Pending").length;
          setPendingRequestsCount(pendingCount);
        }
      }
    } catch (error) {
      console.error("Error fetching pending requests count:", error);
    }
  }, [userData?.user_id]);

  // Fetch pending requests count when user data is available
  useEffect(() => {
    if (userData?.user_id && !userDataLoading) {
      fetchPendingRequestsCount();
    }
  }, [userData?.user_id, userDataLoading, fetchPendingRequestsCount]);

  // Filter and process listings whenever allListings changes
  useEffect(() => {
    if (!allListings.length) {
      setListings([]);
      return;
    }

    let filteredData = [...allListings];
    let filteredCount = allListings.length;

    // Apply client-side search filtering
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

    // Apply client-side category filtering
    if (filters.type && filters.type !== "all") {
      filteredData = filteredData.filter((item) => item.type === filters.type);
      filteredCount = filteredData.length;
    }

    // Apply client-side sorting
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
    } else {
      // Default sorting by newest, with unavailable items at the bottom
      filteredData.sort((a, b) => {
        const statusA = a.status?.trim();
        const statusB = b.status?.trim();
        if (statusA === "Active" && statusB !== "Active") return -1;
        if (statusA !== "Active" && statusB === "Active") return 1;
        if (statusA === "Unavailable" && statusB !== "Unavailable") return 1;
        if (statusA !== "Unavailable" && statusB === "Unavailable") return -1;
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      });
    }

    setListings(filteredData);
    setTotalCount(filteredCount);
  }, [allListings, searchQuery, filters]);

  // Initial load
  useEffect(() => {
    if (userData && !userDataLoading) {
      fetchListings();
    }
  }, [fetchListings, userData, userDataLoading]);

  const updateListingStatus = useCallback((listingId: string, status: "Active" | "Inactive" | "Sold" | "Unavailable") => {
    setAllListings((prevListings) =>
      prevListings.map((listing) =>
        listing.list_id === listingId ? { ...listing, status } : listing
      )
    );
  }, []);

  return {
    listings,
    allListings,
    filters,
    searchQuery,
    isLoading,
    error,
    totalCount,
    viewMode,
    userData,
    userDataLoading,
    pendingRequestsCount,
    setFilters,
    setSearchQuery,
    setViewMode,
    fetchListings,
    fetchPendingRequestsCount,
    isOwner,
    updateListingStatus,
  };
}

