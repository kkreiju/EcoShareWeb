"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, X, Eye, Camera, Image as ImageIcon, Star, CheckCircle, Loader2 } from "lucide-react";
import { CameraCaptureModal } from "./camera-capture-modal";
import { ViewTransactionImageModal } from "./view-transaction-image-modal";
import { TransactionRatingModal } from "./transaction-rating-modal";

interface TransactionActionsProps {
  type: "contributor" | "receiver";
  transactionId: string;
  transactionStatus: string;
  listingTitle: string;
  listingId: string;
  onUploadImage?: (transactionId: string, imageBase64: string) => void;
  onComplete?: (transactionId: string) => Promise<void>;
  onReturn?: (transactionId: string) => Promise<void>;
  onCancel?: (transactionId: string) => void;
  onViewDetails?: (listingId: string) => void;
}

export function TransactionActions({
  type,
  transactionId,
  transactionStatus,
  listingTitle,
  listingId,
  onUploadImage,
  onComplete,
  onReturn,
  onCancel,
  onViewDetails,
}: TransactionActionsProps) {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isViewImageModalOpen, setIsViewImageModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [checkingRating, setCheckingRating] = useState(false);
  const [hasVerificationImage, setHasVerificationImage] = useState<boolean | null>(null);
  const [isCheckingImage, setIsCheckingImage] = useState(false);

  const status = transactionStatus.toLowerCase();
  const isOngoing = status === "ongoing";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";

  // Check if transaction has been rated (only for completed receiver transactions)
  useEffect(() => {
    if (isCompleted && type === "receiver") {
      checkRatingStatus();
    }
  }, [isCompleted, type, transactionId]);

  const checkRatingStatus = async () => {
    setCheckingRating(true);
    try {
      const response = await fetch(
        `/api/transaction/rating/check-rating?tran_id=${transactionId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHasRated(data.hasRated);
        }
      }
    } catch (error) {
      console.error("Error checking rating status:", error);
    } finally {
      setCheckingRating(false);
    }
  };

  const checkVerificationImage = async () => {
    if (hasVerificationImage !== null) return;
    setIsCheckingImage(true);
    try {
      const response = await fetch(
        `/api/transaction/transaction-image?transactionId=${transactionId}`
      );
      if (response.ok) {
        const data = await response.json();
        setHasVerificationImage(data.success);
      } else {
        setHasVerificationImage(false);
      }
    } catch (error) {
      console.error("Error checking verification image:", error);
      setHasVerificationImage(false);
    } finally {
      setIsCheckingImage(false);
    }
  };

  const handleUploadClick = () => {
    setIsCameraModalOpen(true);
  };

  const handleImageCapture = async (imageBase64: string) => {
    if (onUploadImage) {
      setIsUploading(true);
      try {
        await onUploadImage(transactionId, imageBase64);
      } finally {
        setIsUploading(false);
        setIsCameraModalOpen(false);
      }
    }
  };

  const handleRatingSubmitted = () => {
    setHasRated(true);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(listingId);
    } else {
      // Fallback: open in new tab directly
      window.open(`/user/listing/${listingId}`, '_blank');
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={(open) => {
        if (open && type === "receiver" && isOngoing) {
          checkVerificationImage();
        }
      }}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full border border-border/30 hover:border-border/60 bg-background/50 hover:bg-muted/80 transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleViewDetails}
            className="focus:bg-blue-50 dark:focus:bg-blue-950/20"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Show Upload Verification button only for contributor (sold items) with Ongoing status */}
          {type === "contributor" && isOngoing && onUploadImage && (
            <>
              <DropdownMenuItem
                onClick={handleUploadClick}
                className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950/20"
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Verification
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Show Review Transaction for receiver (buyer) with Ongoing status */}
          {type === "receiver" && isOngoing && (
            <>
              {isCheckingImage ? (
                <DropdownMenuItem disabled>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking status...
                </DropdownMenuItem>
              ) : hasVerificationImage ? (
                <DropdownMenuItem
                  onClick={() => setIsViewImageModalOpen(true)}
                  className="text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950/20"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Transaction
                </DropdownMenuItem>
              ) : null}
              {(hasVerificationImage || isCheckingImage) && <DropdownMenuSeparator />}
            </>
          )}

          {/* Show Cancel button only for Ongoing transactions */}
          {isOngoing && onCancel && (
            <>
              <DropdownMenuItem
                onClick={() => onCancel(transactionId)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Show View Completion Image for completed transactions */}
          {isCompleted && (
            <>
              <DropdownMenuItem
                onClick={() => setIsViewImageModalOpen(true)}
                className="focus:bg-blue-50 dark:focus:bg-blue-950/20"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                View Verification Image
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Show Rate Transaction for completed receiver transactions */}
          {isCompleted && type === "receiver" && (
            <>
              {checkingRating ? (
                <DropdownMenuItem disabled>
                  <Star className="h-4 w-4 mr-2" />
                  Checking...
                </DropdownMenuItem>
              ) : hasRated ? (
                <DropdownMenuItem disabled className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Already Rated
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setIsRatingModalOpen(true)}
                  className="text-yellow-600 focus:text-yellow-600 focus:bg-yellow-50 dark:focus:bg-yellow-950/20"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Rate Transaction
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onImageCapture={handleImageCapture}
        transactionId={transactionId}
        listingTitle={listingTitle}
        isUploading={isUploading}
      />

      <ViewTransactionImageModal
        isOpen={isViewImageModalOpen}
        onClose={() => setIsViewImageModalOpen(false)}
        transactionId={transactionId}
        listingTitle={listingTitle}
        onComplete={onComplete}
        onReturn={onReturn}
        isBuyer={type === "receiver"}
        transactionStatus={transactionStatus}
      />

      <TransactionRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        transactionId={transactionId}
        listingTitle={listingTitle}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  );
}
