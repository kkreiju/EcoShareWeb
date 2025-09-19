"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Map } from "lucide-react";
import { GoogleMap } from "./google-map";

interface LocationSelectionSectionProps {
  currentLocation: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  onLocationSelect: (address: string, lat?: number, lng?: number) => void;
  isLoadingLocation: boolean;
  setIsLoadingLocation: (loading: boolean) => void;
  error?: string;
}

export function LocationSelectionSection({
  currentLocation,
  currentLatitude,
  currentLongitude,
  onLocationSelect,
  isLoadingLocation,
  setIsLoadingLocation,
  error,
}: LocationSelectionSectionProps) {
  const [showMap, setShowMap] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding using Google Maps API
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              onLocationSelect(address, latitude, longitude);
            } else {
              onLocationSelect(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude);
            }
          } else {
            onLocationSelect(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude);
          }
        } catch (error) {
          console.error("Error with reverse geocoding:", error);
          onLocationSelect(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, latitude, longitude);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);
        alert("Unable to get your current location. Please try again or select location on map.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleMapSelection = (address: string, lat: number, lng: number) => {
    onLocationSelect(address, lat, lng);
    setShowMap(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location *
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingLocation}
            className="flex-1 touch-manipulation h-10"
          >
            <Navigation className={`w-4 h-4 mr-2 flex-shrink-0 ${isLoadingLocation ? 'animate-spin' : ''}`} />
            <span className="truncate">
              {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="flex-1 touch-manipulation h-10"
          >
            <Map className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {showMap ? "Hide Map" : "View Map"}
            </span>
          </Button>
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="location">Location Address</Label>
          <Input
            id="location"
            placeholder="Use buttons above to set location"
            value={currentLocation}
            readOnly
            className={`bg-muted/50 ${error ? "border-red-500" : ""}`}
          />
          {currentLocation && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentLocation.includes("Location:") ? "Coordinates set" : "Address set automatically"}
              </p>
              {currentLatitude && currentLongitude && (
                <p className="text-xs text-muted-foreground/80">
                  Coordinates: {currentLatitude.toFixed(6)}, {currentLongitude.toFixed(6)}
                </p>
              )}
            </div>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Google Map Integration */}
        {showMap && (
          <GoogleMap
            onLocationSelect={handleMapSelection}
            apiKey="AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA"
            className="w-full"
            initialLat={currentLatitude}
            initialLng={currentLongitude}
          />
        )}
      </CardContent>
    </Card>
  );
}
