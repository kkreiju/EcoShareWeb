"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Crosshair } from "lucide-react";
import { useGoogleMaps } from "./google-maps-provider";

interface GoogleMapProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  apiKey: string;
  className?: string;
  initialLat?: number | null;
  initialLng?: number | null;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap: () => void;
  }
}

export function GoogleMap({ 
  onLocationSelect, 
  apiKey, 
  className = "",
  initialLat,
  initialLng 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && !map) {
      initializeMap();
    }
  }, [isLoaded, map]);

  const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Use initial coordinates if provided, otherwise default to Philippines (Manila area)
      const defaultCenter = { 
        lat: initialLat || 14.5995, 
        lng: initialLng || 120.9842 
      };

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: defaultCenter,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Create a marker
      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: defaultCenter,
      });

      // Geocoder for reverse geocoding
      const geocoder = new window.google.maps.Geocoder();

      // Function to reverse geocode and update location
      const updateLocation = (position: any) => {
        geocoder.geocode({ location: position }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            setSelectedLocation({
              address,
              lat: position.lat,
              lng: position.lng
            });
          }
        });
      };

      // Add click listener to map
      mapInstance.addListener('click', (event: any) => {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        markerInstance.setPosition(position);
        updateLocation(position);
      });

      // Add drag listener to marker
      markerInstance.addListener('dragend', (event: any) => {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        updateLocation(position);
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      // If initial coordinates are provided, use them and update location
      if (initialLat && initialLng) {
        const initialPosition = { lat: initialLat, lng: initialLng };
        updateLocation(initialPosition);
      } else {
        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              mapInstance.setCenter(userLocation);
              markerInstance.setPosition(userLocation);
              updateLocation(userLocation);
            },
            (error) => {
              console.log("Could not get user location:", error);
              // Update with default location
              updateLocation(defaultCenter);
            }
          );
        } else {
          // Update with default location
          updateLocation(defaultCenter);
        }
      }
    };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.address, selectedLocation.lat, selectedLocation.lng);
    }
  };

  const centerOnUser = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          map.setCenter(userLocation);
          marker.setPosition(userLocation);
          
          // Geocoder for reverse geocoding
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: userLocation }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address;
              setSelectedLocation({
                address,
                lat: userLocation.lat,
                lng: userLocation.lng
              });
            }
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
          alert("Could not get your current location. Please try again.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  };

  if (loadError) {
    return (
      <div className={`p-4 text-center text-red-500 ${className}`}>
        <p>Error loading Google Maps: {loadError}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-48 sm:h-56 md:h-64 rounded-lg border shadow-md"
          style={{ minHeight: '200px' }}
        />

        {isLoaded && !loadError && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={centerOnUser}
            className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm"
          >
            <Crosshair className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {selectedLocation && (
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Selected Location:</p>
                <p className="text-xs text-muted-foreground break-words">
                  {selectedLocation.address}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleConfirmLocation}
            className="w-full touch-manipulation"
            size="sm"
          >
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Use This Location</span>
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Click anywhere on the map or drag the marker to select your location
      </div>
    </div>
  );
}
