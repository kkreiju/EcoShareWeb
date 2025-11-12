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
import { Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
import { Listing } from "@/lib/types";

interface ListingVisibilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onConfirmToggle: (listingId: string) => void;
}

export function ListingVisibilityDialog({
  isOpen,
  onClose,
  listing,
  onConfirmToggle,
}: ListingVisibilityDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!listing) return null;

  const isActive = listing.status === "Active";
  const actionText = isActive ? "Hide" : "Show";
  const actionIcon = isActive ? EyeOff : Eye;
  const ActionIcon = actionIcon;

  const handleToggle = async () => {
    if (!listing) return;

    setIsUpdating(true);
    
    try {
      // Call the parent's toggle handler
      await onConfirmToggle(listing.list_id);
      
      toast.success(`Listing ${isActive ? "hidden" : "shown"} successfully`, {
        description: isActive 
          ? "Your listing is now inactive and hidden from other users." 
          : "Your listing is now active and visible to other users.",
        duration: 4000,
      });
      onClose();
    } catch (error) {
      toast.error(`Failed to ${actionText.toLowerCase()} listing`, {
        description: "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ActionIcon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-green-500'}`} />
            {actionText} Listing
          </DialogTitle>
          <DialogDescription>
            {isActive 
              ? "This will hide your listing from other users. You can show it again anytime."
              : "This will make your listing visible to other users again."
            }
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
              Currently {isActive ? "visible" : "hidden"}
            </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className={`p-4 rounded-lg border ${
            isActive 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                isActive ? 'text-orange-600' : 'text-green-600'
              }`} />
              <div>
                <h4 className={`text-sm font-medium mb-2 ${
                  isActive ? 'text-orange-800' : 'text-green-800'
                }`}>
                  {isActive 
                    ? "Hide this listing from others?" 
                    : "Show this listing to others?"
                  }
                </h4>
                <p className={`text-sm ${
                  isActive ? 'text-orange-700' : 'text-green-700'
                }`}>
                  {isActive 
                    ? "Other users won't be able to see or contact you about this listing. You can make it visible again anytime from your listings page."
                    : "Other users will be able to see and contact you about this listing. You can hide it again anytime if needed."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleToggle}
            disabled={isUpdating}
            className={
              isActive 
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }
          >
            {isUpdating ? (
              <>
                <Info className="w-4 h-4 mr-2 animate-pulse" />
                Updating...
              </>
            ) : (
              <>
                <ActionIcon className="w-4 h-4 mr-2" />
                {actionText} Listing
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
