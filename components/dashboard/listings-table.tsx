"use client";

import { Listing } from "@/lib/DataClass";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Package, MessageCircle } from "lucide-react";

interface ListingsTableProps {
  listings: Listing[];
  onContact: (listing: Listing) => void;
  onViewDetails: (listing: Listing) => void;
  isOwner: (listing: Listing) => boolean;
  formatPrice: (price: number, type: string) => string;
  formatDate: (dateString: string) => string;
  getTypeColor: (type: string) => string;
}

export function ListingsTable({
  listings,
  onContact,
  onViewDetails,
  isOwner,
  formatPrice,
  formatDate,
  getTypeColor,
}: ListingsTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Type</TableHead>
            <TableHead className="w-24">Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-24">Posted</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow
              key={listing.list_id}
              className="border-border hover:bg-muted/30"
            >
              <TableCell>
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <img
                    src={listing.imageURL}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/food-waste.jpg";
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <div className="font-medium text-foreground truncate">
                    {listing.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {listing.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs ${getTypeColor(listing.type)}`}>
                  {listing.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground">
                  {listing.type.toLowerCase() === "sale"
                    ? formatPrice(listing.price || 0, listing.type)
                    : "-"
                  }
                </div>
                {listing.quantity > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {listing.quantity}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-32">
                    {listing.locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(listing.postedDate)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={listing.User?.profileURL} />
                    <AvatarFallback className="text-xs">
                      {listing.User?.firstName?.[0]}
                      {listing.User?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-muted-foreground truncate max-w-24">
                    {listing.User?.firstName} {listing.User?.lastName}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={`flex gap-1 ${
                    isOwner(listing) ? "justify-center" : ""
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => onViewDetails(listing)}
                  >
                    View
                  </Button>
                  {!isOwner(listing) && (
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-primary hover:bg-primary/90"
                      onClick={() => onContact(listing)}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
