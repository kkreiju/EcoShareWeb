"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";

interface PhotoUploadSectionProps {
  uploadedImage: File | null;
  existingImageUrl?: string;
  onImageUpload: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function PhotoUploadSection({
  uploadedImage,
  existingImageUrl,
  onImageUpload,
  error,
  disabled = false,
}: PhotoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = event.target.files?.[0] || null;
    onImageUpload(file);
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasImage = uploadedImage || existingImageUrl;
  const displayImageUrl = uploadedImage 
    ? URL.createObjectURL(uploadedImage) 
    : existingImageUrl || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photos
          {disabled && <span className="text-sm font-normal text-gray-500">(Cannot be modified)</span>}
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
            onChange={handleImageUpload}
          />

          {!hasImage ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-lg transition-colors touch-manipulation ${
                    disabled 
                      ? "cursor-not-allowed bg-gray-50 border-gray-200" 
                      : "cursor-pointer hover:bg-muted/50"
                  }`}
                  onClick={() => !disabled && fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-6">
                    <Upload className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 ${disabled ? "text-gray-300" : "text-muted-foreground"}`} />
                    <p className={`mb-2 text-base sm:text-lg font-medium text-center px-2 ${disabled ? "text-gray-400" : "text-muted-foreground"}`}>
                      {disabled ? "Photo cannot be changed" : "Click to upload new photo"}
                    </p>
                    {!disabled && (
                      <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                        PNG, JPG, GIF up to 10MB (optional)
                      </p>
                    )}
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
                  src={displayImageUrl}
                  alt="Listing photo"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg border shadow-lg"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors touch-manipulation"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                {uploadedImage && (
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/60 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    {uploadedImage.name.length > 15 ? `${uploadedImage.name.substring(0, 15)}...` : uploadedImage.name}
                  </div>
                )}
                {!uploadedImage && existingImageUrl && (
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/60 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                    Current photo
                  </div>
                )}
              </div>

              {!disabled && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline touch-manipulation"
                  >
                    Change photo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
