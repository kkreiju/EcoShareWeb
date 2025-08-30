"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Listing } from "@/lib/DataClass";
import {
  ItemHeader,
  ItemOwner,
  ItemDetails,
  ItemActions,
} from "@/components/view-tems";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemId = params.id as string;

  useEffect(() => {
    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/listing/view-listing?list_id=${itemId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch item: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setListing(data.data[0]);
      } else {
        throw new Error("Item not found");
      }
    } catch (err) {
      console.error("Error fetching item:", err);
      setListing(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactOwner = () => {
    // TODO: Implement contact owner functionality
    console.log("Contact owner clicked");
  };

  const handleRequestItem = () => {
    // TODO: Implement request item functionality
    console.log("Request item clicked");
  };

  const handleMakeOffer = () => {
    // TODO: Implement make offer functionality
    console.log("Make offer clicked");
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report clicked");
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading item...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Listings
            </Button>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Item not found
            </h3>
            <p className="text-muted-foreground mb-4">
              The item you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ItemHeader listing={listing} />
          <ItemDetails listing={listing} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <ItemActions
            listing={listing}
            onRequestItem={handleRequestItem}
            onMakeOffer={handleMakeOffer}
            onContactOwner={handleContactOwner}
            onReport={handleReport}
          />
          <ItemOwner listing={listing} onContactOwner={handleContactOwner} />
        </div>
      </div>
    </div>
  );
}
