"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation, Route, X } from "lucide-react";
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
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [isShowingDirections, setIsShowingDirections] = useState(false);
  const [selectedListingForDirections, setSelectedListingForDirections] = useState<Listing | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
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

    // Initialize directions service and renderer
    const directionsServiceInstance = new window.google.maps.DirectionsService();
    const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false, // Keep our custom markers
      polylineOptions: {
        strokeColor: "#2563EB",
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
      panel: null // We'll create our own info panel
    });

    directionsRendererInstance.setMap(mapInstance);

    setMap(mapInstance);
    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);

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
        
        // Set the selected listing for directions
        setSelectedListingForDirections(listing);
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

  const showDirections = (listing: Listing) => {
    if (!userLocation || !directionsService || !directionsRenderer || !listing.latitude || !listing.longitude) {
      console.error("Missing requirements for directions");
      return;
    }

    const request = {
      origin: userLocation,
      destination: { lat: listing.latitude, lng: listing.longitude },
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        setIsShowingDirections(true);
        
        // Extract route information
        const route = result.routes[0];
        const leg = route.legs[0];
        setRouteInfo({
          distance: leg.distance.text,
          duration: leg.duration.text
        });

        // Smooth transition to fit the route bounds
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(userLocation);
        bounds.extend({ lat: listing.latitude, lng: listing.longitude });
        
        map.fitBounds(bounds, {
          padding: { top: 100, right: 100, bottom: 100, left: 100 }
        });
        
        // Smooth zoom animation
        setTimeout(() => {
          if (map.getZoom() > 16) {
            map.setZoom(16);
          }
        }, 1000);
        
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
    setIsShowingDirections(false);
    setSelectedListingForDirections(null);
    setRouteInfo(null);
    
    // Smooth transition back to normal view
    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(14);
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
          {/* My Location Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-22 right-4 bg-white border border-gray-200 shadow-md rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
            onClick={centerOnUser}
          >
            <Navigation className="h-4 w-4" />
            My Location
          </Button>

          {/* Directions Button */}
          {selectedListingForDirections && userLocation && !isShowingDirections && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-32 right-4 bg-blue-600 border border-blue-600 shadow-md rounded-md px-3 py-2 text-white hover:bg-blue-700"
              onClick={() => showDirections(selectedListingForDirections)}
            >
              <Route className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          )}

          {/* Clear Directions Button */}
          {isShowingDirections && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-32 right-4 bg-red-600 border border-red-600 shadow-md rounded-md px-3 py-2 text-white hover:bg-red-700"
              onClick={clearDirections}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Route
            </Button>
          )}

          {/* Route Info Panel */}
          {isShowingDirections && routeInfo && (
            <div className="absolute top-42 right-4 bg-white border border-gray-200 rounded-md p-3 shadow-md min-w-[200px]">
              <h4 className="text-xs font-medium mb-2 text-gray-900 flex items-center">
                <Route className="h-3 w-3 mr-1 text-blue-600" />
                Route Info
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">Distance:</span>
                  <span className="font-medium text-gray-900">{routeInfo.distance}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-medium text-gray-900">{routeInfo.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
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
            onDirectionsClick={showDirections}
            hasUserLocation={!!userLocation}
            isShowingDirections={isShowingDirections}
          />
        </>
      )}
    </div>
  );
}
