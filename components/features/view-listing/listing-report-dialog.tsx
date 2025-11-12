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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Flag } from "lucide-react";
import { toast } from "sonner";

interface ListingReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingImageURL?: string;
}

const REPORT_REASONS = [
  "Inappropriate behavior",
  "Spam or scam", 
  "False or misleading information",
  "Harassment or abuse",
  "Other (please specify)"
];

export function ListingReportDialog({ 
  isOpen, 
  onClose, 
  listingId, 
  listingTitle,
  listingImageURL
}: ListingReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }

    if (selectedReason === "Other (please specify)" && !otherReason.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        list_id: listingId,
        reason: selectedReason,
        otherComments: selectedReason === "Other (please specify)" ? otherReason.trim() : "",
      };

      const response = await fetch('/api/listing/report-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reset form and close dialog
        setSelectedReason("");
        setOtherReason("");
        onClose();

        // Show success toast
        toast.success("Listing reported successfully", {
          description: data.message || "Thank you for helping keep our community safe.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || `Failed to report listing`);
      }

    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error("Failed to submit report", {
        description: "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason("");
      setOtherReason("");
      onClose();
    }
  };

  const isFormValid = selectedReason && 
    (selectedReason !== "Other (please specify)" || otherReason.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            Report Listing
          </DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting inappropriate content.
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
                Listing being reported
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Why are you reporting this listing? <span className="text-red-500">*</span>
            </Label>
            
            <RadioGroup 
              value={selectedReason} 
              onValueChange={setSelectedReason}
              className="space-y-3"
            >
              {REPORT_REASONS.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={reason} 
                    id={reason}
                    disabled={isSubmitting}
                  />
                  <Label 
                    htmlFor={reason}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Other (please specify)" && (
            <div className="space-y-2">
              <Label htmlFor="other-reason" className="text-sm font-medium">
                Please specify <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="other-reason"
                placeholder="Please provide details about your concern..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {otherReason.length}/500 characters
              </div>
            </div>
          )}
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
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flag className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
