"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ListingAdditionalInfoProps {
  listing: Listing;
  formatDate: (dateString: string) => string;
}

export function ListingAdditionalInfo({ listing, formatDate }: ListingAdditionalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground text-sm uppercase">
                Location
              </div>
              <div className="text-sm text-muted-foreground break-words">
                {listing.locationName}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground text-sm uppercase">
                Posted
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(listing.postedDate)}
              </div>
            </div>
          </div>

          {listing.pickupTimeAvailability && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground text-sm uppercase">
                  Pickup Available
                </div>
                <div className="text-sm text-muted-foreground">
                  {listing.pickupTimeAvailability}
                </div>
              </div>
            </div>
          )}

          {listing.instructions && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground text-sm uppercase">
                  Instructions
                </div>
                <div className="text-sm text-muted-foreground">
                  {listing.instructions}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
