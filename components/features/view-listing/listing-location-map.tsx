"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Listing } from "@/lib/types";

interface ListingLocationMapProps {
  listing: Listing;
}

export function ListingLocationMap({ listing }: ListingLocationMapProps) {
  if (!listing.latitude || !listing.longitude) {
    return null;
  }

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[4/2] rounded-lg overflow-hidden border border-border relative">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${listing.latitude},${listing.longitude}&zoom=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Location of ${listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}`}
          />

          {/* Get Directions Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white border border-gray-200 shadow-md rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
              onClick={handleGetDirections}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Directions
            </Button>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Coordinates: {listing.latitude.toFixed(6)} {listing.longitude.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  );
}
