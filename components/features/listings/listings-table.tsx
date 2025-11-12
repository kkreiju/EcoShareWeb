"use client";

import { Listing } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Package, MessageCircle, Trash2, Eye, Edit, Share2 } from "lucide-react";
import { getStatusColor } from "./shared/utils";

interface ListingsTableProps {
  listings: Listing[];
  onDelete?: (listing: Listing) => void;
  onToggleVisibility?: (listing: Listing) => void;
  onEditListing?: (listing: Listing) => void;
  onShare?: (listing: Listing) => void;
  onViewDetails?: (listing: Listing) => void;
  isOwner: (listing: Listing) => boolean;
  formatPrice: (price: number, type: string) => string;
  formatDate: (dateString: string) => string;
  getTypeColor: (type: string) => string;
}

export function ListingsTable({
  listings,
  onDelete = undefined,
  onToggleVisibility = undefined,
  onEditListing,
  onShare,
  onViewDetails,
  isOwner,
  formatPrice,
  formatDate,
  getTypeColor,
}: ListingsTableProps) {
  const getStatusDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Visible";
      case "inactive":
        return "Hidden";
      case "sold":
        return "Sold";
      case "unavailable":
        return "Unavailable";
      default:
        return status;
    }
  };

  const getStatusColorWithDark = (status: string) => {
    const baseColor = getStatusColor(status);
    // Add dark mode variants for this component
    switch (status.toLowerCase()) {
      case "active":
        return `${baseColor} dark:bg-green-600 dark:text-white dark:border-green-600`;
      case "inactive":
        return "bg-gray-500 text-white border-gray-500 dark:bg-gray-600 dark:text-white dark:border-gray-600";
      case "sold":
        return "bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:text-white dark:border-blue-600";
      case "unavailable":
        return "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Type</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-24">Price</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-24">Posted</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const isUnavailable = listing.status === "Unavailable";

            return (
              <TableRow
                key={listing.list_id}
                className={`border-border hover:bg-muted/30 ${
                  isUnavailable ? "opacity-60" : ""
                }`}
              >
                <TableCell>
                  <div className={`w-12 h-12 rounded-md overflow-hidden bg-muted ${
                    isUnavailable ? "grayscale" : ""
                  }`}>
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
                <Badge className={`text-xs ${getStatusColorWithDark(listing.status)}`}>
                  {getStatusDisplayText(listing.status)}
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
                  <div className="flex gap-1">
                    {isOwner(listing) && onToggleVisibility && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 py-1"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && onToggleVisibility(listing)}
                        title={listing.status === "Active" ? "Hide" : "Show"}
                      >
                        <span className="text-xs font-medium">
                          {listing.status === "Active" ? "Hide" : "Show"}
                        </span>
                      </Button>
                    )}
                    {isOwner(listing) && onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && onDelete(listing)}
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                    {onShare && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && onShare(listing)}
                        title="Share"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    )}
                    {onEditListing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && onEditListing(listing)}
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && onViewDetails(listing)}
                        title="View Details"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}