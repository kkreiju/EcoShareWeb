"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle,
  Upload,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCapture: (imageBase64: string) => void;
  transactionId: string;
  listingTitle: string;
  isUploading?: boolean;
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  onImageCapture,
  transactionId,
  listingTitle,
  isUploading = false,
}: CameraCaptureModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment", // Use back camera on mobile
        },
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      setError("Unable to access camera. Please check permissions and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera not ready. Please try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture image. Please try again.");
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    
    // Stop the camera after capture
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  // No separate upload needed - the API handles it internally

  const handleConfirmImage = async () => {
    if (!capturedImage) return;

    try {
      // We don't set isLoading here because the parent component handles the loading state
      // via the isUploading prop which triggers the overlay
      await onImageCapture(capturedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setError(null);
    setHasPermission(null);
    onClose();
  };

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !stream && !capturedImage && hasPermission === null) {
      startCamera();
    }
  }, [isOpen, stream, capturedImage, hasPermission, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-hidden">
        {isUploading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative bg-primary/10 p-4 rounded-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Processing Verification</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Please wait while we verify and upload your image...
                </p>
              </div>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Complete Transaction
          </DialogTitle>
          <DialogDescription>
            Take a photo of "{listingTitle}" to complete the transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {hasPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center text-white">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Camera Access Required</p>
                      <p className="text-sm opacity-75 mb-4">
                        Please allow camera access to take a photo
                      </p>
                      <Button onClick={startCamera} variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured transaction photo"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-center gap-2">
            {!capturedImage && hasPermission && !isLoading ? (
              <Button
                onClick={capturePhoto}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Capture Photo
              </Button>
            ) : capturedImage ? (
              <>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleConfirmImage}
                  disabled={isLoading || isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading || isUploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Complete Transaction
                    </>
                  )}
                </Button>
              </>
            ) : null}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleClose}
              variant="ghost"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
