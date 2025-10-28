"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WebCamera } from "@shivantra/react-web-camera";
import { PlantDiagnosticsResultModal, DiagnosisResult } from "./plant-diagnostics-result-modal";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

export function PlantDiagnosticsTab() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const cameraRef = useRef<any>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", user.email)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user?.email]);

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
            userId: userData?.user_id || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.success) {
          // Set comprehensive diagnosis results
          setDiagnosisResult({
            plantName: result.data.prediction,
            confidence: result.data.confidence,
            // New comprehensive data
            plantNeeds: result.data.plant_needs,
            finalMix: result.data.combined_analysis?.final_mix,
            matchQuality: result.data.combined_analysis?.match_quality,
            matchesPlantNeeds: result.data.combined_analysis?.matches_plant_needs,
            assessment: result.data.combined_analysis?.assessment,
            recommendations: result.data.recommendations,
            listings: result.data.listings,
            // Backward compatibility
            nutrientNeeds: result.diagnosis.nutrientNeeds,
            compostSuggestions: result.diagnosis.compostSuggestions,
            capturedImage: base64Image,
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
          <Camera className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Plant Nutrient Diagnostics
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a photo of your plant to get instant AI-powered nutrient analysis and personalized recommendations
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-md mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Camera Section */}
      <div className="bg-card border rounded-lg p-8 shadow-sm">
        <div className="text-center space-y-8">
          {!cameraActive ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Ready to Start Analysis
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Position your plant clearly in frame for the best results. Our AI will analyze the leaves, stems, and overall health.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={handleStartCamera} size="lg" className="px-8">
                  <Camera className="mr-2 h-5 w-5" />
                  Open Camera
                </Button>
                <div className="text-sm text-muted-foreground">
                  Make sure your plant is well-lit
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Capture Your Plant
                </h2>
                <p className="text-muted-foreground">
                  Position the camera and click analyze when ready
                </p>
              </div>

              {/* Camera Preview */}
              <div className="max-w-2xl mx-auto">
                <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
                  <WebCamera
                    ref={cameraRef}
                    className="w-full"
                    style={{ aspectRatio: "4/3" }}
                  />
                  <div className="absolute inset-0 border-2 border-green-500/50 rounded-lg pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  onClick={handleCapture}
                  disabled={isCapturing}
                  size="lg"
                  className="flex-1"
                >
                  {isCapturing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Analyze Plant
                    </div>
                  )}
                </Button>
                <Button
                  onClick={handleStopCamera}
                  variant="outline"
                  disabled={isCapturing}
                  size="lg"
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
            <span className="text-sm font-semibold text-green-600">1</span>
          </div>
          <h3 className="font-semibold">Position Plant</h3>
          <p className="text-sm text-muted-foreground">
            Make sure your plant is well-lit and clearly visible in the frame
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
            <span className="text-sm font-semibold text-green-600">2</span>
          </div>
          <h3 className="font-semibold">Take Photo</h3>
          <p className="text-sm text-muted-foreground">
            Capture a clear image showing the leaves and overall plant health
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
            <span className="text-sm font-semibold text-green-600">3</span>
          </div>
          <h3 className="font-semibold">Get Results</h3>
          <p className="text-sm text-muted-foreground">
            Receive detailed nutrient analysis and compost recommendations
          </p>
        </div>
      </div>

      {/* Results Modal */}
      <PlantDiagnosticsResultModal
        open={showResultsDialog}
        onOpenChange={setShowResultsDialog}
        result={diagnosisResult}
      />
    </div>
  );
}
