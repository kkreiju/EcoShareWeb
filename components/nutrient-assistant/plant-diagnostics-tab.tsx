"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Leaf,
  Droplets,
  Zap,
  Sun,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WebCamera } from "@shivantra/react-web-camera";

interface DiagnosisResult {
  prediction: string;
  confidence: number;
  nutrientNeeds: string;
  compostSuggestions: string;
}

export function PlantDiagnosticsTab() {
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const cameraRef = useRef<any>(null);

  const handleStartCamera = () => {
    setCameraActive(true);
    setError(null);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setError(null);
  };

  // Convert image to base64
  const imageToBase64 = (imageData: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (imageData instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageData);
      } else if (
        typeof imageData === "string" &&
        imageData.startsWith("data:")
      ) {
        // Already a data URL
        resolve(imageData);
      } else {
        reject(new Error("Unsupported image format"));
      }
    });
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsCapturing(true);
      setError(null);

      // Capture image using the WebCamera component
      const capturedImage = await cameraRef.current.capture();

      if (capturedImage) {
        // Convert image to base64 for API
        const base64Image = await imageToBase64(capturedImage);

        // Send to API for analysis
        const response = await fetch("/api/ai/diagnostics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Set diagnosis results
          setDiagnosisResult({
            prediction: result.data.prediction,
            confidence: result.data.confidence,
            nutrientNeeds: result.diagnosis.nutrientNeeds,
            compostSuggestions: result.diagnosis.compostSuggestions,
          });

          // Show results dialog
          setShowResultsDialog(true);
        } else {
          throw new Error(result.message || "Analysis failed");
        }

        setIsCapturing(false);
      }
    } catch (err) {
      console.error("Error capturing/analyzing image:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Please try again."
      );
      setIsCapturing(false);
    }
  };

  const handleCameraError = (error: any) => {
    console.error("Camera error:", error);
    setError("Camera access failed. Please check permissions and try again.");
    setCameraActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-200">
          Plant Diagnostics
        </h2>
        <p className="text-muted-foreground">
          Capture a plant to analyze nutrient needs and get compost recommendations
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Camera Interface */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!cameraActive ? (
              /* Camera Start Interface */
              <div className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                  <Camera className="h-10 w-10 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ready to analyze your plant
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Point the camera at a plant for nutrient analysis
                  </p>
                </div>

                <Button
                  onClick={handleStartCamera}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              /* Active Camera Interface */
              <div className="space-y-4">
                {/* Camera View */}
                <div className="relative mx-auto max-w-md">
                  <WebCamera
                    ref={cameraRef}
                    style={{
                      width: "100%",
                      height: "300px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    }}
                  />

                  {/* Overlay guide */}
                  <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none opacity-30" />
                </div>

                {/* Instructions */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Position the plant in the center
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Ensure good lighting and keep the plant centered for best
                    results
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleStopCamera}
                    disabled={isCapturing}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>

                  <Button
                    onClick={handleCapture}
                    disabled={isCapturing}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isCapturing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Capture Plant
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Plant Analysis for {diagnosisResult?.prediction}
            </DialogTitle>
          </DialogHeader>

          {diagnosisResult && (
            <div className="space-y-6">
              {/* Plant Identification */}
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <span className="text-xl font-semibold">
                    {diagnosisResult.prediction}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analysis completed successfully
                </p>
              </div>

              {/* Nutrient Needs */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Nutrient Needs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {diagnosisResult.nutrientNeeds
                    .split(",")
                    .map((nutrient, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {nutrient.trim()}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Compost Suggestions */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Recommended Compost Materials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {diagnosisResult.compostSuggestions
                    .split(",")
                    .map((compost, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {compost.trim()}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowResultsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
