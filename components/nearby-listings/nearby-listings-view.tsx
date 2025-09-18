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
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

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
    setIsPanelVisible(true); // Show panel when marker is clicked
  };

  const handleCardClick = (listingId: string) => {
    setSelectedListingId(listingId);
    // Center map on the selected listing marker
    centerMapOnListing(listingId);
  };

  const centerMapOnListing = (listingId: string) => {
    const listing = listings.find(l => l.list_id === listingId);
    if (listing && listing.latitude && listing.longitude) {
      // This will be handled by the MapView component
      setMapCenter({ lat: listing.latitude, lng: listing.longitude });
    }
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
          mapCenter={mapCenter}
          onMarkerClick={handleMarkerClick}
          onLocationChange={setUserLocation}
          formatDistance={formatDistance}
          // Panel props
          isPanelVisible={isPanelVisible}
          onTogglePanel={() => setIsPanelVisible(!isPanelVisible)}
          selectedListingId={selectedListingId}
          onCardClick={handleCardClick}
          onRefresh={refetch}
          totalCount={totalCount}
          isOwner={isOwner}
        />
      </div>
    </GoogleMapsProvider>
  );
}
