"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Sparkles,
  AlertCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { WebCamera } from "@shivantra/react-web-camera";
import { PlantDiagnosticsResultModal } from "./plant-diagnostics-result-modal";
import { PlantDiagnosticsNonPlantModal } from "./plant-diagnostics-non-plant-modal";
import { useCameraCapture } from "./plant-diagnostics/hooks/use-camera-capture";
import { usePlantDiagnostics } from "./plant-diagnostics/hooks/use-plant-diagnostics";

export function PlantDiagnosticsTab() {
  const {
    cameraActive,
    isCapturing,
    photoTaken,
    capturedImageData,
    cameraRef,
    handleStartCamera,
    handleStopCamera,
    handleCapture,
    handleRetake,
    handleCameraError,
    reset: resetCamera,
  } = useCameraCapture();

  const {
    isLoading: isAnalyzing,
    error: diagnosisError,
    diagnosisResult,
    showResultsDialog,
    showNonPlantDialog,
    analyzeImage,
    setShowResultsDialog,
    setShowNonPlantDialog,
    resetDiagnosis,
  } = usePlantDiagnostics();

  const error = diagnosisError;

  const handleTryAgain = () => {
    resetDiagnosis();
    resetCamera();
    handleStartCamera();
  };

  const handleAnalyze = async () => {
    if (!capturedImageData) return;
    try {
      await analyzeImage(capturedImageData);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleCaptureWrapper = async () => {
    try {
      await handleCapture(cameraRef);
    } catch (err) {
      // Error handling is done in the hook
    }
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
                  {photoTaken ? "Review Your Photo" : "Capture Your Plant"}
                </h2>
                <p className="text-muted-foreground">
                  {photoTaken
                    ? "Check your photo and analyze it, or take a new one"
                    : "Position the camera and take a photo when ready"
                  }
                </p>
              </div>

              {/* Camera Preview */}
              <div className="max-w-2xl mx-auto">
                <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
                  {photoTaken && capturedImageData ? (
                    <img
                      src={capturedImageData}
                      alt="Captured plant"
                      className="w-full"
                      style={{ aspectRatio: "4/3" }}
                    />
                  ) : (
                    <WebCamera
                      ref={cameraRef}
                      className="w-full"
                      style={{ aspectRatio: "4/3" }}
                    />
                  )}
                  <div className="absolute inset-0 border-2 border-green-500/50 rounded-lg pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {photoTaken ? (
                  // Photo taken - show Retake and Analyze buttons
                  <>
                    <Button
                      onClick={handleRetake}
                      variant="outline"
                      size="lg"
                      className="w-full group-hover:bg-gray-600 group-hover:text-white transition-colors"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake Photo
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || isCapturing}
                      size="lg"
                      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze Plant
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  // No photo taken - show Take Photo and Cancel buttons
                  <>
                    <Button
                      onClick={handleCaptureWrapper}
                      disabled={isCapturing}
                      size="lg"
                      className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                    >
                      {isCapturing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Taking Photo...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Take Photo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    <Button
                      onClick={handleStopCamera}
                      variant="outline"
                      disabled={isCapturing}
                      size="lg"
                      className="w-full group-hover:bg-gray-600 group-hover:text-white transition-colors"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                )}
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

      {/* Non-Plant Modal */}
      <PlantDiagnosticsNonPlantModal
        open={showNonPlantDialog}
        onOpenChange={setShowNonPlantDialog}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
}
