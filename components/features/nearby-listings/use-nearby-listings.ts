"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingsResponse } from "@/lib/types";
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        if (!cachedUserEmail && !userData) setUserDataLoading(false);
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

        if (error && !userData) setUserData(null);
        else if (!error) {
          setUserData(data);
          setCachedUserEmail(user.email);
        }
      } catch (err) {
        if (!userData) setUserData(null);
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email, cachedUserEmail, userData]);

  const isOwner = (listing: Listing) => {
    if (userDataLoading || !userData) return false;
    return String(userData.user_id) === String(listing.user_id);
  };

  const fetchNearbyListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("sort_by", "newest");

      const response = await fetch(`/api/listing/view-listing?${params}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
      }

      const data: ListingsResponse = await response.json();
      let filteredData = data.data || [];

      // Filter out the current user's own listings to show only other users' listings
      if (userData?.user_id) {
        filteredData = filteredData.filter((listing: any) => listing.user_id !== userData.user_id);
      }

      if (userLocation) {
        filteredData = filteredData.filter(listing => listing.latitude && listing.longitude);
        filteredData.sort((a, b) => {
          const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
          const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
          return distanceA - distanceB;
        });
      } else {
        filteredData = filteredData.filter(listing => listing.latitude && listing.longitude);
      }

      setListings(filteredData);
      setTotalCount(filteredData.length);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load nearby listings");
      setListings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, userData]);

  useEffect(() => {
    fetchNearbyListings();
  }, [fetchNearbyListings]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => (value * Math.PI) / 180;

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
