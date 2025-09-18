"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertCircle, Star } from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { ListingReportDialog } from "./listing-report-dialog";
import { ListingContactDialog } from "./listing-contact-dialog";

interface ListingOwnerInfoProps {
  listing: Listing;
  isOwner: boolean;
  onContact: () => void;
}

export function ListingOwnerInfo({ listing, isOwner, onContact }: ListingOwnerInfoProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  const handleContact = () => {
    setIsContactDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Posted by</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={listing.User?.profileURL} />
            <AvatarFallback className="text-sm">
              {listing.User?.firstName?.[0]}
              {listing.User?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground text-base truncate">
              {listing.User?.firstName} {listing.User?.lastName}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {listing.User?.ratings || 0} rating
            </div>
          </div>
        </div>

        {!isOwner && (
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={handleContact}
              className="w-full font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              {listing.type === "Wanted" ? "Offer Item" : "Request Item"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 hover:shadow-md"
              onClick={handleReport}
            >
              <AlertCircle className="w-5 h-5" />
              Report Item
            </Button>
          </div>
        )}
      </CardContent>
      
      <ListingReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        listingId={listing.list_id}
        listingTitle={listing.title}
        listingImageURL={listing.imageURL}
      />
      
      <ListingContactDialog
        isOpen={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
        listingId={listing.list_id}
        listingTitle={listing.title}
        listingImageURL={listing.imageURL}
        listingType={listing.type}
        ownerName={`${listing.User?.firstName || ''} ${listing.User?.lastName || ''}`.trim() || 'Owner'}
      />
    </Card>
  );
}
