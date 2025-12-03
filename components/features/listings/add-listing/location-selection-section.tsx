"use client";

import { useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Map } from "lucide-react";
import { GoogleMap } from "../shared/google-map";

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
    <div className="space-y-6">
      {/* Location Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" style={{ color: "#EF4444" }} />
          <span className="text-sm font-medium">Location</span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onGetCurrentLocation}
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
              <Map className="w-4 h-4 flex-shrink-0" />
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
              apiKey="AIzaSyDgXPEns32daYp9WblngrXGvO_tJeOaxfM"
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
