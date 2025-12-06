"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  listingType?: "free" | "wanted" | "sale" | null;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
  submitText?: string;
  cancelText?: string;
}

export function FormActions({
  onCancel,
  listingType,
  isSubmitting = false,
  mode = "add",
  submitText,
  cancelText,
}: FormActionsProps) {
  const getButtonStyles = () => {
    if (mode === "edit") {
      return "bg-blue-600 hover:bg-blue-700 text-white";
    }
    
    switch (listingType) {
      case "sale":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "wanted":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-green-600 hover:bg-green-700 text-white";
    }
  };

  const getButtonText = () => {
    if (mode === "edit") {
      return submitText || "Update Listing";
    }

    const action = "Create";
    switch (listingType) {
      case "sale":
        return `${action} Sale Listing`;
      case "wanted":
        return `${action} Wanted Listing`;
      default:
        return `${action} Free Listing`;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto order-2 sm:order-1 touch-manipulation"
      >
        {cancelText || "Cancel"}
      </Button>
      <Button
        type="submit"
        className={`${getButtonStyles()} w-full sm:w-auto order-1 sm:order-2 touch-manipulation`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
        ) : (
          <Save className="w-4 h-4 mr-2 flex-shrink-0" />
        )}
        <span className="truncate">{getButtonText()}</span>
      </Button>
    </div>
  );
}

