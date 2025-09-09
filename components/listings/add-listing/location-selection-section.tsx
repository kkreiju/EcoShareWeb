"use client";

import { useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Map } from "lucide-react";
import { GoogleMap } from "./google-map";

interface LocationSelectionSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  currentLocation: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  isLoadingLocation: boolean;
  onLocationUpdate: (address: string, lat: number, lng: number) => void;
  onGetCurrentLocation: () => void;
}

export function LocationSelectionSection({
  register,
  setValue,
  errors,
  currentLocation,
  currentLatitude,
  currentLongitude,
  isLoadingLocation,
  onLocationUpdate,
  onGetCurrentLocation,
}: LocationSelectionSectionProps) {
  const [showMap, setShowMap] = useState(false);

  const handleMapSelection = (address: string, lat: number, lng: number) => {
    onLocationUpdate(address, lat, lng);
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
            onClick={onGetCurrentLocation}
            disabled={isLoadingLocation}
            className="flex-1 touch-manipulation"
            size="sm"
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
            className="flex-1 touch-manipulation"
            size="sm"
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
            {...register("location")}
            className={`bg-muted/50 ${errors.location ? "border-red-500" : ""}`}
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
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message as string}</p>
          )}
        </div>

        {/* Google Map Integration */}
        {showMap && (
          <GoogleMap
            onLocationSelect={handleMapSelection}
            apiKey="AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}
