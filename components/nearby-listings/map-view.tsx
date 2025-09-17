"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation, Plus, Minus } from "lucide-react";
import { useGoogleMaps } from "./google-maps-provider";
import { FloatingListingsSidebar } from "./floating-listings-sidebar";
import { Listing } from "@/lib/DataClass";

interface MapViewProps {
  listings: Listing[];
  isLoading: boolean;
  userLocation?: { lat: number; lng: number } | null;
  onMarkerClick?: (listingId: string) => void;
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  formatDistance?: (listing: Listing) => string;
  // Panel props
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
  onMarkerClick, 
  onLocationChange,
  formatDistance,
  // Panel props
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

  // Update markers when listings change
  useEffect(() => {
    if (map && listings) {
      clearMarkers();
      addListingMarkers(map);
    }
  }, [map, listings]);

  // Update user location when prop changes
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
      if (map) {
        map.setCenter(propUserLocation);
        updateUserLocationMarker(propUserLocation);
      }
    }
  }, [propUserLocation, map]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default to Philippines (Manila area)
    const defaultCenter = { lat: 14.5995, lng: 120.9842 };

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: defaultCenter,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false, // We'll add custom controls
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    setMap(mapInstance);

    // Try to get user's current location if not provided
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
          console.log("Could not get user location:", error);
        }
      );
    } else if (userLocation) {
      updateUserLocationMarker(userLocation);
    }

    // Add markers for nearby listings
    if (listings && listings.length > 0) {
      addListingMarkers(mapInstance);
    }
  };

  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.infoWindow?.close();
      marker.setMap(null);
    });
    setMarkers([]);
  };

  const updateUserLocationMarker = (location: { lat: number; lng: number }) => {
    if (!map || !window.google) return;

    // Remove existing user marker if any
    markers.forEach(marker => {
      if (marker.title === "Your Location") {
        marker.setMap(null);
      }
    });

    // Add user location marker
    new window.google.maps.Marker({
      position: location,
      map: map,
      title: "Your Location",
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
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
      // Skip listings without coordinates
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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C11.582 4 8 7.582 8 12c0 6 8 16 8 16s8-10 8-16c0-4.418-3.582-8-8-8z" fill="${getMarkerColor(listing.type)}" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="16" cy="12" r="4" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        }
      });

      // Create info window with real data
      const distance = formatDistance ? formatDistance(listing) : "Distance unknown";
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[220px]">
            <h4 class="font-semibold text-sm mb-2">${listing.title}</h4>
            <div class="flex items-center justify-between mb-2">
              <span class="inline-block px-2 py-1 text-xs rounded-full text-white" style="background-color: ${getMarkerColor(listing.type)}">
                ${listing.type}
              </span>
              <span class="text-sm font-medium">
                ${formatPrice(listing.price, listing.type)}
              </span>
            </div>
            <p class="text-xs text-gray-600 mb-2">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>${listing.locationName}</span>
              <span>${distance}</span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close all other info windows
        newMarkers.forEach(m => m.infoWindow?.close());
        
        infoWindow.open(mapInstance, marker);
        onMarkerClick?.(listing.list_id);
      });

      marker.infoWindow = infoWindow;
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
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  return (
    <div className="relative h-full w-full bg-muted/20 rounded-lg border border-border overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full relative">
        {/* Loading/Error States */}
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
                    Initializing nearby listings map view
                  </p>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Custom Map Controls */}
      {isLoaded && !loadError && (
        <>
          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-background/95 backdrop-blur border-border shadow-md"
              onClick={zoomIn}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-background/95 backdrop-blur border-border shadow-md"
              onClick={zoomOut}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* User Location Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-background/95 backdrop-blur border-border shadow-md"
            onClick={centerOnUser}
          >
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur border border-border rounded-md p-3 shadow-md">
            <h4 className="text-xs font-medium mb-2 text-foreground">Legend</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Sale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Wanted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Location</span>
              </div>
            </div>
          </div>

          {/* Floating Listings Sidebar */}
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
