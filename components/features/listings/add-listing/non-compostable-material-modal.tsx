"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface NonCompostableMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryAgain?: () => void;
}

export function NonCompostableMaterialModal({
  open,
  onOpenChange,
  onTryAgain,
}: NonCompostableMaterialModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Please Note
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please post real compostable materials. EcoShare is designed for sharing food waste and organic materials that can be composted. Only genuine compostable items are permitted on our platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Plastic, metal, or synthetic materials cannot be composted
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Non-organic items like electronics or chemicals are not accepted
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Only plant-based materials like leaves, fruits, vegetables, or garden waste
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Please upload a photo of a compostable plant-based material to continue.
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onTryAgain?.();
            }}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Different Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
