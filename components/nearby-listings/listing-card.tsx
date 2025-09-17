"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Eye, 
  MessageCircle, 
  Heart,
  Clock,
  Star
} from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  isSelected?: boolean;
  isOwner?: boolean;
  onCardClick?: (id: string) => void;
  formatDistance?: (listing: Listing) => string;
}

export function ListingCard({
  listing,
  isSelected = false,
  isOwner = false,
  onCardClick,
  formatDistance
}: ListingCardProps) {
  const handleCardClick = () => {
    onCardClick?.(listing.list_id);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'free': return 'bg-green-50 text-green-700 border-green-200';
      case 'sale': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'wanted': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === 'free') return 'Free';
    if (type.toLowerCase() === 'wanted') return 'Wanted';
    return `₱${price.toLocaleString()}`;
  };

  return (
    <div 
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200",
        "hover:border-blue-300 hover:shadow-md",
        isSelected && "border-blue-500 shadow-md ring-1 ring-blue-500/20"
      )}
      onClick={handleCardClick}
    >
      {/* Image and Type Badge */}
      <div className="relative mb-3">
        <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={listing.imageURL || "/images/stock_veges.jpg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <Badge 
          className={cn(
            "absolute top-2 left-2 text-xs font-medium border",
            getTypeColor(listing.type)
          )}
        >
          {listing.type}
        </Badge>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-7 w-7 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Toggle favorite:", listing.list_id);
          }}
        >
          <Heart className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
            {listing.title}
          </h3>
          <span className="font-semibold text-blue-600 text-sm whitespace-nowrap">
            {formatPrice(listing.price || 0, listing.type)}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {listing.description}
        </p>

        {/* Location and Distance */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{listing.locationName}</span>
          {formatDistance && (
            <>
              <span>•</span>
              <span className="text-blue-600 font-medium">
                {formatDistance(listing)}
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(listing.tags) && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.tags.slice(0, 2).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs h-5 px-2 text-gray-600 border-gray-300"
              >
                {tag}
              </Badge>
            ))}
            {listing.tags.length > 2 && (
              <Badge variant="outline" className="text-xs h-5 px-2 text-gray-500">
                +{listing.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {listing.User?.firstName?.[0] || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {listing.User ? 
                  `${listing.User.firstName || ''} ${listing.User.lastName || ''}`.trim() || 'User' 
                  : 'User'
                }
              </p>
              {listing.User?.ratings && parseFloat(listing.User.ratings) > 0 && (
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {parseFloat(listing.User.ratings).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                console.log("View listing:", listing.list_id);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {!isOwner && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Contact owner:", listing.list_id);
                }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Time stamp */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>2 hours ago</span>
        </div>
      </div>
    </div>
  );
}
