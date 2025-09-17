"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingsResponse } from "@/lib/DataClass";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

interface UseNearbyListingsProps {
  userLocation?: { lat: number; lng: number } | null;
}

export function useNearbyListings({
  userLocation
}: UseNearbyListingsProps = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [cachedUserEmail, setCachedUserEmail] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch user data for ownership checking
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
  const isOwner = (listing: Listing) => {
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
  };

  const fetchNearbyListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters - get active listings sorted by newest
      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("sort_by", "newest");

      const url = `/api/listing/view-listing?${params.toString()}`;

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

      // Apply location-based filtering if user location is available
      if (userLocation) {
        // Filter to only include listings with coordinates
        filteredData = filteredData.filter((listing) => {
          return listing.latitude && listing.longitude;
        });

        // Sort by distance
        filteredData.sort((a, b) => {
          const distanceA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.latitude,
            a.longitude
          );
          const distanceB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.latitude,
            b.longitude
          );
          return distanceA - distanceB;
        });
      } else {
        // If no user location, just filter to listings with coordinates
        filteredData = filteredData.filter((listing) => {
          return listing.latitude && listing.longitude;
        });
      }

      setListings(filteredData);
      setTotalCount(filteredData.length);
    } catch (err) {
      console.error("Error fetching nearby listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load nearby listings");
      setListings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    fetchNearbyListings();
  }, [fetchNearbyListings]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const formatDistance = (listing: Listing): string => {
    if (!userLocation || !listing.latitude || !listing.longitude) {
      return "Distance unknown";
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      listing.latitude,
      listing.longitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  return {
    listings,
    isLoading,
    error,
    totalCount,
    isOwner,
    formatDistance,
    refetch: fetchNearbyListings,
  };
}
