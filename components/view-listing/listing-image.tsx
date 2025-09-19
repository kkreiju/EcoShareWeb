"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, MapPin, Calendar, Clock, AlertCircle, MessageCircle, Star } from "lucide-react";
import { Listing } from "@/lib/DataClass";

interface ListingImageProps {
  listing: Listing;
  getTypeColor: (type: string) => string;
  formatPrice: (price: number, type: string) => string;
  tags: string[];
  formatDate: (dateString: string) => string;
  isOwner: boolean;
  onContact: () => void;
  onReport: () => void;
}

export function ListingImage({ listing, getTypeColor, formatPrice, tags, formatDate, isOwner, onContact, onReport }: ListingImageProps) {
  return (
    <Card className="py-0 min-h-[300px]">
      <CardContent className="p-0 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
          {/* Image Side */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={listing.imageURL || "/images/food-waste.jpg"}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/food-waste.jpg";
              }}
            />
            
            {/* Type Badge */}
            <Badge
              className={`absolute top-4 left-4 ${getTypeColor(listing.type)} font-medium text-sm`}
            >
              {listing.type}
            </Badge>
            
            {/* Price Badge */}
            {listing.type.toLowerCase() === "sale" && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="font-bold text-red-600 text-lg">
                  {formatPrice(listing.price || 0, listing.type)}
                </span>
              </div>
            )}
          </div>
          
          {/* Details Side */}
          <div className="p-8 h-full flex flex-col">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <CardTitle className="text-2xl font-bold text-foreground mb-3">
                  {listing.title}
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  {listing.quantity > 0 && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      <Package className="h-4 w-4 mr-2" />
                      {listing.quantity} available
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 uppercase text-sm tracking-wide">
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {listing.description}
                </p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 uppercase text-sm tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm px-3 py-1.5 border-primary/20 text-primary hover:bg-primary/5 font-medium"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 uppercase text-sm tracking-wide">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                        Location
                      </div>
                      <div className="text-sm text-muted-foreground break-words leading-relaxed">
                        {listing.locationName}
                      </div>
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                        Posted
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {formatDate(listing.postedDate)}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Time */}
                  {listing.pickupTimeAvailability && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          Pickup Available
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {listing.pickupTimeAvailability}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  {listing.instructions && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          Pickup Instructions
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {listing.instructions}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Posted By Section */}
              <div className="pt-6">
                <h3 className="font-semibold text-foreground mb-3 uppercase text-sm tracking-wide">
                  Posted by
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
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
              </div>

              {/* Action Buttons */}
              {!isOwner && (
                <div className="pt-6">
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      onClick={onContact}
                      className="flex-1 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      {listing.type === "Wanted" ? "Offer Item" : "Request Item"}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 hover:shadow-md"
                      onClick={onReport}
                    >
                      <AlertCircle className="w-5 h-5 mr-3" />
                      Report Item
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
