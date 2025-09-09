"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
}

export function FormActions({
  onCancel,
  isSubmitting = false,
  submitText = "Update Listing",
  cancelText = "Cancel",
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto order-2 sm:order-1 touch-manipulation"
        size="sm"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2 touch-manipulation"
        disabled={isSubmitting}
        size="sm"
      >
        <Save className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate">
          {isSubmitting ? "Updating..." : submitText}
        </span>
      </Button>
    </div>
  );
}
