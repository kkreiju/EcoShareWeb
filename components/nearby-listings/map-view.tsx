"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useGoogleMaps } from "./google-maps-provider";
import { FloatingListingsSidebar } from "./floating-listings-sidebar";
import { Listing } from "@/lib/DataClass";

interface MapViewProps {
  listings: Listing[];
  isLoading: boolean;
  userLocation?: { lat: number; lng: number } | null;
  mapCenter?: { lat: number; lng: number } | null;
  onMarkerClick?: (listingId: string) => void;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  formatDistance?: (listing: Listing) => string;
  isPanelVisible?: boolean;
  onTogglePanel?: () => void;
  selectedListingId?: string | null;
  onCardClick?: (id: string) => void;
  onRefresh?: () => void;
  totalCount?: number;
  isOwner?: (listing: Listing) => boolean;
}

export function MapView({
  listings,
  isLoading: dataLoading,
  userLocation: propUserLocation,
  mapCenter,
  onMarkerClick,
  onLocationChange,
  formatDistance,
  isPanelVisible = false,
  onTogglePanel,
  selectedListingId,
  onCardClick,
  onRefresh,
  totalCount = 0,
  isOwner
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(propUserLocation || null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && !map) {
      initializeMap();
    }
  }, [isLoaded, map]);

  useEffect(() => {
    if (map && listings) {
      clearMarkers();
      addListingMarkers(map);
    }
  }, [map, listings]);

  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
      if (map) {
        map.setCenter(propUserLocation);
        updateUserLocationMarker(propUserLocation);
      }
    }
  }, [propUserLocation, map]);

  // Center map when mapCenter changes (when user clicks on sidebar item)
  useEffect(() => {
    if (mapCenter && map) {
      map.setCenter(mapCenter);
      map.setZoom(16); // Slightly zoomed in to focus on the selected marker
    }
  }, [mapCenter, map]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultCenter = { lat: 14.5995, lng: 120.9842 };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      styles: [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }]
    });

    setMap(mapInstance);

    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(userPos);
          mapInstance.setCenter(userPos);
          onLocationChange?.(userPos);
          updateUserLocationMarker(userPos);
        },
        (error) => {
          console.error("Location access failed:", error);
        }
      );
    } else if (userLocation) {
      updateUserLocationMarker(userLocation);
    }

    if (listings && listings.length > 0) {
      addListingMarkers(mapInstance);
    }
  };

  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  const updateUserLocationMarker = (location: { lat: number; lng: number }) => {
    if (!map || !window.google) return;

    markers.forEach(marker => {
      if (marker.title === "Your Location") marker.setMap(null);
    });

    new window.google.maps.Marker({
      position: location,
      map: map,
      title: "Your Location",
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
      }
    });
  };

  const addListingMarkers = (mapInstance: any) => {
    if (!listings || listings.length === 0) return;

    const newMarkers: any[] = [];

    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const getMarkerColor = (type: string) => {
        switch (type.toLowerCase()) {
          case "free": return "#10B981"; // green
          case "wanted": return "#F59E0B"; // yellow
          case "sale": return "#EF4444"; // red
          default: return "#6B7280"; // gray
        }
      };

      const formatPrice = (price: number | undefined, type: string) => {
        if (type.toLowerCase() === "free") return "Free";
        if (type.toLowerCase() === "wanted") return "Wanted";
        return `₱${(price || 0).toFixed(2)}`;
      };

      const marker = new window.google.maps.Marker({
        position: { lat: listing.latitude, lng: listing.longitude },
        map: mapInstance,
        title: listing.title,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8C23.164 8 16 15.164 16 24c0 12 16 32 16 32s16-20 16-32c0-8.836-7.164-16-16-16z" fill="${getMarkerColor(listing.type)}" stroke="#FFFFFF" stroke-width="4"/>
              <circle cx="32" cy="24" r="13" fill="#FFFFFF" fill-opacity="0.9"/>
              <text x="32" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${getMarkerColor(listing.type)}">
                ${listing.type.charAt(0).toUpperCase()}
              </text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(64, 64),
          anchor: new window.google.maps.Point(32, 64),
        }
      });

      marker.addListener('click', () => {
        onMarkerClick?.(listing.list_id);
        // Center map on the clicked marker
        if (mapInstance && listing.latitude && listing.longitude) {
          mapInstance.setCenter({ lat: listing.latitude, lng: listing.longitude });
          mapInstance.setZoom(16); // Slightly zoomed in to focus on the marker
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(prev => [...prev, ...newMarkers]);
  };

  const centerOnUser = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          map.setCenter(userPos);
          map.setZoom(15);
          setUserLocation(userPos);
          onLocationChange?.(userPos);
          updateUserLocationMarker(userPos);
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  return (
    <div className="relative h-full w-full bg-muted/20 rounded-lg border border-border overflow-hidden">
      <div ref={mapRef} className="h-full w-full relative">
        {(!isLoaded || loadError) && (
          <div className="absolute inset-0 bg-muted/80 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              {loadError ? (
                <>
                  <div className="text-red-500 mb-2">❌</div>
                  <p className="text-sm text-red-500">Failed to load map</p>
                  <p className="text-xs text-muted-foreground mt-1">{loadError}</p>
                </>
              ) : (
                <>
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-2" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    Loading Map...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Initializing map view
                  </p>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {isLoaded && !loadError && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-22 right-4 bg-white border border-gray-200 shadow-md rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
            onClick={centerOnUser}
          >
            <Navigation className="h-4 w-4" />
            My Location
          </Button>

          <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-md p-3 shadow-md">
            <h4 className="text-xs font-medium mb-2 text-gray-900">Legend</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Sale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Wanted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Location</span>
              </div>
            </div>
          </div>

          <FloatingListingsSidebar
            listings={listings}
            isLoading={dataLoading}
            totalCount={totalCount}
            isVisible={isPanelVisible}
            onToggle={onTogglePanel || (() => {})}
            selectedListingId={selectedListingId}
            onCardClick={onCardClick}
            onRefresh={onRefresh}
            isOwner={isOwner}
            formatDistance={formatDistance}
          />
        </>
      )}
    </div>
  );
}
