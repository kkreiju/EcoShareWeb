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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Package, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface ListingContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingImageURL?: string;
  listingType: string;
  ownerName: string;
  ownerId: string;
}

export function ListingContactDialog({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  listingImageURL,
  listingType,
  ownerName,
  ownerId
}: ListingContactDialogProps) {
  const { userId, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<string>("1");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOffer = listingType.toLowerCase() === "wanted";
  const actionType = isOffer ? "Offer" : "Request";
  const actionVerb = isOffer ? "offering" : "requesting";

  const handleSubmit = async () => {
    if (!quantity || !userId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        list_id: listingId,
        user_id: userId,
        quantity: parseInt(quantity),
        message: message.trim() || '',
        request_type: isOffer ? 'offer' : 'request',
        status: 'pending',
        owner_id: ownerId,
      };

      let response;

      if (requestData.request_type === 'request') {
        response = await fetch('/api/transaction/request-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestData),
        });
      } else {
        response = await fetch('/api/transaction/offer-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestData),
        });
      }

      console.log('Response status:', response.status);
      const data = await response.json();

      if (response.ok && data.success) {
        // Reset form and close dialog
        setQuantity("1");
        setMessage("");
        onClose();

        // Show success toast
        toast.success(`${actionType} sent successfully!`, {
          description: "The owner will be notified of your request.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || `Failed to send ${actionType.toLowerCase()}`);
      }

    } catch (error) {
      console.error("Failed to submit contact:", error);
      toast.error(`Failed to send ${actionType.toLowerCase()}`, {
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setQuantity("1");
      setMessage("");
      onClose();
    }
  };

  const isFormValid = quantity && parseInt(quantity) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            {actionType} Item
          </DialogTitle>
          <DialogDescription>
            Send a message to {ownerName} {actionVerb} this item.
          </DialogDescription>
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-200 rounded-lg border border-gray-300">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border">
              <img
                src={listingImageURL || "/images/food-waste.jpg"}
                alt={listingTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/food-waste.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {listingTitle}
              </div>
              <div className="text-xs text-gray-600">
                {actionType} from {ownerName}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isSubmitting}
                className="pl-10"
                placeholder="Enter quantity"
              />
            </div>
            <div className="text-xs text-gray-500">
              How many items are you {actionVerb}?
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder={`Write your ${actionType.toLowerCase()} message to ${ownerName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {isOffer ? "Describe what you're offering and pickup details" : "Explain why you need this item"}
              </span>
              <span>{message.length}/500</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-pulse" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send {actionType}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
