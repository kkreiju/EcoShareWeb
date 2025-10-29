"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface PlantDiagnosticsNonPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryAgain?: () => void;
}

export function PlantDiagnosticsNonPlantModal({
  open,
  onOpenChange,
  onTryAgain,
}: PlantDiagnosticsNonPlantModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Not a Plant Detected
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Our AI couldn't identify a plant in the image you captured. This might be because:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                The image is too blurry or unclear
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                The subject is not a plant or plant part
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Lighting conditions make it difficult to analyze
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Try taking a clearer photo of a plant with good lighting for better results.
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
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
