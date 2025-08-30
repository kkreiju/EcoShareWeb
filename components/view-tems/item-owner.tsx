"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Star, MapPin, Phone, Mail } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ItemOwnerProps {
  listing: Listing;
  onContactOwner?: () => void;
}

export function ItemOwner({ listing, onContactOwner }: ItemOwnerProps) {
  const user = listing.User;
  const fallbackOwner = listing.owner;

  const userData = {
    name: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Unknown User"
      : fallbackOwner?.name || "Unknown User",
    avatar: user?.profileURL || fallbackOwner?.avatar,
    rating: user?.ratings ? parseFloat(user.ratings) || 0 : listing.rating || 0,
    contactNumber: user?.contactNumber,
    email: user?.email,
    bio: user?.bio,
    transactionCount: user?.transactionCount || 0,
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userData.avatar} alt={userData.name} />
          <AvatarFallback className="text-lg bg-primary/10">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {userData.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {userData.rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {userData.transactionCount} transactions
            </span>
          </div>

          {userData.bio && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {userData.bio}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 pt-2">
        {userData.contactNumber && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {userData.contactNumber}
            </span>
          </div>
        )}

        {userData.email && (
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{userData.email}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{listing.locationName}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onContactOwner}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Owner
        </Button>

        <Button variant="outline" className="flex-1">
          View Profile
        </Button>
      </div>
    </Card>
  );
}
