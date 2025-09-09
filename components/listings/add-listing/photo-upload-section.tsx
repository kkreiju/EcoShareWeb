"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";

interface PhotoUploadSectionProps {
  uploadedImage: File | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  error?: string;
}

export function PhotoUploadSection({
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  error,
}: PhotoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hidden file input - always available */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageUpload}
          />

          {!uploadedImage ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-6">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-muted-foreground" />
                    <p className="mb-2 text-base sm:text-lg text-muted-foreground font-medium text-center px-2">
                      Click to upload photo *
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative group max-w-sm sm:max-w-md mx-auto">
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded photo"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg border shadow-lg"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors touch-manipulation"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/60 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                  {uploadedImage.name.length > 15 ? `${uploadedImage.name.substring(0, 15)}...` : uploadedImage.name}
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline touch-manipulation"
                >
                  Change photo
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
