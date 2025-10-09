"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, Eye, Camera } from "lucide-react";
import { CameraCaptureModal } from "./camera-capture-modal";

interface TransactionActionsProps {
  type: "contributor" | "receiver";
  transactionId: string;
  transactionStatus: string;
  listingTitle: string;
  onComplete?: (transactionId: string, imageBase64: string) => void;
  onCancel?: (transactionId: string) => void;
}

export function TransactionActions({
  type,
  transactionId,
  transactionStatus,
  listingTitle,
  onComplete,
  onCancel,
}: TransactionActionsProps) {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCompleteClick = () => {
    setIsCameraModalOpen(true);
  };

  const handleImageCapture = async (imageBase64: string) => {
    if (onComplete) {
      setIsUploading(true);
      try {
        await onComplete(transactionId, imageBase64);
      } finally {
        setIsUploading(false);
        setIsCameraModalOpen(false);
      }
    }
  };
  return (
    <>
      <DropdownMenu>
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
          {/* Show Complete button only for contributor (sold items) */}
          {type === "contributor" && onComplete && transactionStatus.toLowerCase() !== "completed" && (
            <DropdownMenuItem
              onClick={handleCompleteClick}
              className="text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950/20"
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Complete
            </DropdownMenuItem>
          )}

          {/* Show Cancel button for both contributor and receiver */}
          {onCancel && transactionStatus.toLowerCase() !== "cancelled" && (
            <DropdownMenuItem
              onClick={() => onCancel(transactionId)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="focus:bg-blue-50 dark:focus:bg-blue-950/20">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
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
    </>
  );
}
