"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Image as ImageIcon, X, AlertCircle, Loader2 } from "lucide-react";

interface ViewTransactionImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  listingTitle: string;
}

export function ViewTransactionImageModal({
  isOpen,
  onClose,
  transactionId,
  listingTitle,
}: ViewTransactionImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && transactionId) {
      fetchTransactionImage();
    } else {
      // Reset state when modal closes
      setImageUrl(null);
      setError(null);
    }
  }, [isOpen, transactionId]);

  const fetchTransactionImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/transaction/transaction-image?transactionId=${transactionId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load transaction image");
      }

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error(data.message || "No image found for this transaction");
      }
    } catch (err) {
      console.error("Error fetching transaction image:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load transaction image"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Transaction Completion Image
          </DialogTitle>
          <DialogDescription>
            Completion photo for "{listingTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Loading image...</p>
                </div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Transaction completion photo"
                className="w-full h-full object-contain"
                onError={() => {
                  setError("Failed to load image. The image may have been deleted.");
                }}
              />
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Image Not Available</p>
                  <p className="text-sm opacity-75">
                    Unable to load the transaction image
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            {imageUrl && (
              <Button
                onClick={() => window.open(imageUrl, "_blank")}
                variant="outline"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            )}
            <Button onClick={onClose} variant="default">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

