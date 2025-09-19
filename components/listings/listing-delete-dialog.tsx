"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Listing } from "@/lib/DataClass";

interface ListingDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onConfirmDelete: (listingId: string) => void;
}

export function ListingDeleteDialog({
  isOpen,
  onClose,
  listing,
  onConfirmDelete,
}: ListingDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!listing) return;

    setIsDeleting(true);
    
    try {
      // Call the parent's delete handler
      await onConfirmDelete(listing.list_id);

      toast.success("Listing marked as unavailable", {
        description: "The listing has been disabled and will appear grayed out.",
        duration: 4000,
      });
      onClose();
    } catch (error) {
      toast.error("Failed to mark listing as unavailable", {
        description: "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-orange-500" />
            Mark Listing as Unavailable
          </DialogTitle>
          <DialogDescription>
            This will mark the listing as unavailable. The listing will remain visible but appear disabled and cannot be edited.
          </DialogDescription>
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-200 rounded-lg border border-gray-300">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border">
              <img
                src={listing.imageURL || "/images/stock_veges.jpg"}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/stock_veges.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {listing.title}
              </div>
              <div className="text-xs text-gray-600">
                Listing to be marked as unavailable
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-2">
                  Are you sure you want to mark this listing as unavailable?
                </h4>
                <p className="text-sm text-orange-700">
                  This will disable the listing and prevent further interactions.
                  The listing will remain visible in your listing management but appear disabled.
                  You can reactivate it later if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isDeleting ? (
              <>
                <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
                Marking as Unavailable...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Mark as Unavailable
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
