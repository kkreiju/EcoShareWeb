"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Share2,
  Flag,
  MessageCircle,
  Handshake,
  ShoppingCart,
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { useState } from "react";

interface ItemActionsProps {
  listing: Listing;
  onRequestItem?: () => void;
  onMakeOffer?: () => void;
  onContactOwner?: () => void;
  onReport?: () => void;
}

export function ItemActions({
  listing,
  onRequestItem,
  onMakeOffer,
  onContactOwner,
  onReport,
}: ItemActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        });
        setIsShared(true);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const isSale = listing.type === "sale";
  const isWanted = listing.type === "wanted";
  const isFree = listing.type === "free";

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Actions</h3>

      {/* Primary Action Buttons */}
      <div className="space-y-3">
        {isFree && (
          <Button
            onClick={onRequestItem}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Handshake className="h-5 w-5 mr-2" />
            Request Item
          </Button>
        )}

        {isSale && (
          <Button
            onClick={onMakeOffer}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Make Offer
          </Button>
        )}

        {isWanted && (
          <Button
            onClick={onContactOwner}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />I Have This
          </Button>
        )}

        {/* Contact Owner for all types */}
        <Button
          onClick={onContactOwner}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Contact Owner
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex-1 ${
            isLiked ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
          {isLiked ? "Liked" : "Like"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex-1 text-muted-foreground"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isShared ? "Copied!" : "Share"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReport}
          className="flex-1 text-muted-foreground hover:text-red-500"
        >
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </div>

      {/* Status Information */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <Badge
            variant={listing.status === "Active" ? "default" : "secondary"}
            className="text-xs"
          >
            {listing.status}
          </Badge>
        </div>

        {listing.quantity > 0 && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{listing.quantity} available</span>
          </div>
        )}
      </div>
    </Card>
  );
}
