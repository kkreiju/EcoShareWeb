"use client";

import { useState, useRef, useCallback } from "react";

interface UseCameraCaptureReturn {
  cameraActive: boolean;
  isCapturing: boolean;
  photoTaken: boolean;
  capturedImageData: string | null;
  cameraRef: React.RefObject<any>;
  handleStartCamera: () => void;
  handleStopCamera: () => void;
  handleCapture: (cameraRef: React.RefObject<any>) => Promise<string | null>;
  handleRetake: () => void;
  handleCameraError: (error: any) => void;
  reset: () => void;
}

/**
 * Custom hook for managing camera capture functionality
 */
export function useCameraCapture(): UseCameraCaptureReturn {
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  // Convert image to base64
  const imageToBase64 = useCallback((imageData: any): Promise<string> => {
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
  }, []);

  const handleStartCamera = useCallback(() => {
    setCameraActive(true);
  }, []);

  const handleStopCamera = useCallback(() => {
    setCameraActive(false);
    reset();
  }, []);

  const handleCapture = useCallback(async (cameraRef: React.RefObject<any>): Promise<string | null> => {
    if (!cameraRef.current) return null;

    try {
      setIsCapturing(true);

      // Capture image using the WebCamera component
      const capturedImage = await cameraRef.current.capture();

      if (capturedImage) {
        // Convert image to base64
        const base64Image = await imageToBase64(capturedImage);
        setCapturedImageData(base64Image);
        setPhotoTaken(true);
        setIsCapturing(false);
        return base64Image;
      }
      
      setIsCapturing(false);
      return null;
    } catch (err) {
      console.error("Error capturing image:", err);
      setIsCapturing(false);
      throw err;
    }
  }, [imageToBase64]);

  const handleRetake = useCallback(() => {
    setCapturedImageData(null);
    setPhotoTaken(false);
  }, []);

  const handleCameraError = useCallback((error: any) => {
    console.error("Camera error:", error);
    setCameraActive(false);
    throw new Error("Camera access failed. Please check permissions and try again.");
  }, []);

  const reset = useCallback(() => {
    setCapturedImageData(null);
    setPhotoTaken(false);
    setIsCapturing(false);
  }, []);

  return {
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
    reset,
  };
}

