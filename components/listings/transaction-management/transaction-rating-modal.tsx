"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  listingTitle: string;
  onRatingSubmitted?: () => void;
}

export function TransactionRatingModal({
  isOpen,
  onClose,
  transactionId,
  listingTitle,
  onRatingSubmitted,
}: TransactionRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating before submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/transaction/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tran_id: transactionId,
          rate_score: rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit rating");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Rating submitted!", {
          description: `You rated this transaction ${rating} star${rating !== 1 ? "s" : ""}.`,
          duration: 4000,
        });
        
        if (onRatingSubmitted) {
          onRatingSubmitted();
        }
        
        handleClose();
      } else {
        throw new Error(data.message || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit rating"
      );
      toast.error("Failed to submit rating", {
        description: err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rate Transaction
          </DialogTitle>
          <DialogDescription>
            How was your experience with "{listingTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Rate your experience from 1 to 5 stars
            </p>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110 focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-lg font-semibold text-foreground">
                {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Your rating helps improve the community experience</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

