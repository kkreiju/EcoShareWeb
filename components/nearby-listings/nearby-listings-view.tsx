"use client";

import { useState } from "react";
import { MapView } from "./map-view";
import { GoogleMapsProvider } from "./google-maps-provider";
import { useNearbyListings } from "./use-nearby-listings";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA";

export function NearbyListingsView() {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { 
    listings, 
    isLoading, 
    error, 
    totalCount,
    isOwner,
    formatDistance,
    refetch
  } = useNearbyListings({
    userLocation
  });

  const handleMarkerClick = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <GoogleMapsProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-full w-full">
        <MapView
          listings={listings}
          isLoading={isLoading}
          userLocation={userLocation}
          onMarkerClick={handleMarkerClick}
          onLocationChange={setUserLocation}
          formatDistance={formatDistance}
          selectedListingId={selectedListingId}
          onRefresh={refetch}
          totalCount={totalCount}
          isOwner={isOwner}
        />
      </div>
    </GoogleMapsProvider>
  );
}
