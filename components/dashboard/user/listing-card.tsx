"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ListingCardProps {
  listing: Listing;
}

// Type badge configuration - consistent with other components
const TYPE_BADGE_CONFIG = {
  free: { label: "Free", className: "bg-green-600 text-white" },
  sale: { label: "Sale", className: "bg-red-600 text-white" },
  wanted: { label: "Wanted", className: "bg-yellow-500 text-white" },
  default: { label: "Listing", className: "bg-muted text-foreground" },
} as const;

function getTypeBadgeFromListing(listing: Listing) {
  const listingType = (listing.type || "")
    .toString()
    .toLowerCase() as keyof typeof TYPE_BADGE_CONFIG;
  return TYPE_BADGE_CONFIG[listingType] || TYPE_BADGE_CONFIG.default;
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();

  // Memoized computed values for performance
  const typeBadge = useMemo(
    () => getTypeBadgeFromListing(listing),
    [listing.type]
  );
  const listingType = useMemo(
    () => (listing.type || "").toString().toLowerCase(),
    [listing.type]
  );

  // Memoized user data extraction
  const userData = useMemo(() => {
    const user = listing.User;
    const fallbackOwner = listing.owner;

    return {
      name: user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown User"
        : fallbackOwner?.name || "Unknown User",
      avatar: user?.profileURL || fallbackOwner?.avatar,
      rating: user?.ratings
        ? parseFloat(user.ratings) || 0
        : listing.rating || 0,
    };
  }, [listing.User, listing.owner, listing.rating]);

  // Memoized image source
  const imageSource = useMemo(() => {
    return listing.imageURL || listing.images?.[0];
  }, [listing.imageURL, listing.images]);

  // Memoized location display
  const locationDisplay = useMemo(() => {
    return listing.locationName || listing.location || "Unknown";
  }, [listing.locationName, listing.location]);

  const handleCardClick = () => {
    router.push(`/user/item/${listing.list_id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 p-0 cursor-pointer group"
    >
      {/* Media Section */}
      <div className="relative h-40 w-full">
        {imageSource ? (
          <img
            src={imageSource}
            alt={listing.title}
            className="h-full w-full object-cover rounded-t-xl"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/40 rounded-t-xl">
            <div className="h-10 w-10 rounded-md bg-muted" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge className={typeBadge.className}>{typeBadge.label}</Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-2 p-3">
        {/* Title and Price Row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight">
            {listing.title}
          </h3>
          {listingType === "sale" && listing.price && (
            <Badge className="bg-white text-gray-900 shadow-sm border">
              ₱{listing.price.toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Description - Reserve height for consistency */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {listing.description || "\u00A0"}
        </p>

        {/* User and Metadata Row */}
        <div className="flex items-center justify-between pt-1 min-h-[2rem]">
          {/* User Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-[10px] bg-primary/10">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate">
              {userData.name}
            </span>
          </div>

          {/* Location and Rating */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground max-w-20">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{locationDisplay}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{userData.rating.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
