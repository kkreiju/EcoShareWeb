"use client";

import { useState, useEffect } from "react";
import { Listing } from "@/lib/DataClass";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

import { ListingHeader } from "./listing-header";
import { ListingImage } from "./listing-image";
import { ListingOwnerInfo } from "./listing-owner-info";
import { ListingLocationMap } from "./listing-location-map";

interface ListingViewProps {
  listingId: string;
}

export function ListingView({ listingId }: ListingViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [cachedUserEmail, setCachedUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try to get all listings and find the specific one
        const response = await fetch('/api/listing/view-listing', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        const listings = data.data || [];
        
        // Find the specific listing by ID
        const foundListing = listings.find((l: Listing) => l.list_id === listingId);
        
        if (!foundListing) {
          throw new Error("Listing not found");
        }

        setListing(foundListing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // Fetch user data for ownership check - using same pattern as dashboard
  useEffect(() => {
    const fetchUserData = async () => {
      // If user.email is undefined but we have cached data, keep current state
      if (!user?.email) {
        if (!cachedUserEmail && !userData) {
          setUserDataLoading(false);
        }
        return;
      }

      // If email hasn't changed and we already have data, skip fetch
      if (user.email === cachedUserEmail && userData) {
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", user.email)
          .single();

        if (error) {
          // Don't clear existing data on error
          if (!userData) {
            setUserData(null);
          }
        } else {
          setUserData(data);
          setCachedUserEmail(user.email);
        }
      } catch (err) {
        // Don't clear existing data on error
        if (!userData) {
          setUserData(null);
        }
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email, cachedUserEmail, userData]);

  const isOwner = () => {
    // If still loading, return false
    if (userDataLoading) {
      return false;
    }

    // If no user data and no cached email, return false
    if (!userData && !cachedUserEmail) {
      return false;
    }

    // If we have user data, use it for ownership check
    if (userData && listing) {
      const currentUserId = String(userData.user_id);
      const listingUserId = String(listing.user_id);
      return currentUserId === listingUserId;
    }

    // Conservative fallback: return false if no userData but have cached email
    return false;
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === "free") return "Free";
    if (type.toLowerCase() === "wanted") return "Wanted";
    return `₱${price?.toFixed(2) || "0.00"}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-500 text-white border-green-500";
      case "wanted":
        return "bg-yellow-500 text-white border-yellow-500";
      case "sale":
        return "bg-red-500 text-white border-red-500";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleContact = () => {
    if (!isOwner()) {
      // TODO: Implement contact functionality
      console.log("Contact listing owner:", listing?.list_id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const parseTags = (tagsString: string | string[] | undefined): string[] => {
    if (Array.isArray(tagsString)) {
      return tagsString;
    }
    if (typeof tagsString === "string") {
      try {
        return JSON.parse(tagsString) || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ListingHeader onShare={handleShare} isOwner={false} />
        
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Listing Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "This listing may have been removed or doesn't exist."}
            </p>
            <Button onClick={() => router.push("/user/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tags = parseTags(listing.tags);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header with Back Button */}
      <ListingHeader onShare={handleShare} isOwner={isOwner()} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image and Details Side by Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image and Details Combined */}
          <ListingImage 
            listing={listing}
            getTypeColor={getTypeColor}
            formatPrice={formatPrice}
            tags={tags}
            formatDate={formatDate}
          />
        </div>

        {/* Right Column - User Info and Actions */}
        <div className="space-y-6">
          {/* Owner Info */}
          <ListingOwnerInfo 
            listing={listing}
            isOwner={isOwner()}
            onContact={handleContact}
          />

          {/* Location Map */}
          <ListingLocationMap listing={listing} />
        </div>
      </div>
    </div>
  );
}
