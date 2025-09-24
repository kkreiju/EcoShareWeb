"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Listing } from "@/lib/DataClass";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PhotoUploadSection } from "./photo-upload-section";
import { BasicInfoSection } from "./basic-info-section";
import { PickupInfoSection } from "./pickup-info-section";
import { TagsSelectionSection } from "./tags-selection-section";
import { LocationSelectionSection } from "./location-selection-section";
import { FormActions } from "./form-actions";

type EditListingFormData = {
  title: string;
  description: string;
  quantity: number;
  pickupTimes: string;
  pickupInstructions: string;
  tags: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  image?: File;
};

interface EditListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
  onSave?: (data: EditListingFormData) => void;
  isUpdating?: boolean;
}

export function EditListingForm({ open, onOpenChange, listing, onSave, isUpdating = false }: EditListingFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  // Base schema (title excluded since it cannot be updated)
  const baseSchema = {
    title: z.string().optional(), // Read-only field, no validation needed
    description: z.string().min(10, "Description must be at least 10 characters"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    pickupTimes: z.string().min(1, "Please specify pickup times"),
    pickupInstructions: z.string().min(1, "Please provide pickup instructions"),
    tags: z.array(z.string()).optional(),
    location: z.string().min(1, "Please select a location"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    image: z.any().optional(),
  };

  // Dynamic schema that includes conditional price
  const editListingSchema = listing?.type === "sale"
    ? z.object({
        ...baseSchema,
        price: z.number().min(0.01, "Price must be greater than 0"),
      })
    : z.object({
        ...baseSchema,
        price: z.number().optional(),
      });

  // For editing, image is optional since there might be an existing image
  const finalSchema = editListingSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      title: "",
      description: "",
      quantity: 1,
      pickupTimes: "",
      pickupInstructions: "",
      tags: [],
      location: "",
      price: listing?.type === "sale" ? 0 : undefined,
    },
  });

  // Parse tags helper function
  const parseTags = (tagsString: string | string[] | undefined): string[] => {
    if (Array.isArray(tagsString)) {
      return tagsString;
    }
    if (typeof tagsString === "string") {
      try {
        return JSON.parse(tagsString) || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Load existing listing data when modal opens
  useEffect(() => {
    if (open && listing) {
      const tags = parseTags(listing.tags);
      
      setSelectedTags(tags);
      setCurrentLocation(listing.locationName || "");
      setCurrentLatitude(listing.latitude || null);
      setCurrentLongitude(listing.longitude || null);
      setExistingImageUrl(listing.imageURL || "");

      // Reset form with listing data
      reset({
        title: listing.title || "",
        description: listing.description || "",
        quantity: listing.quantity || 1,
        pickupTimes: listing.pickupTimeAvailability || "",
        pickupInstructions: listing.instructions || "",
        tags: tags,
        location: listing.locationName || "",
        latitude: listing.latitude,
        longitude: listing.longitude,
        price: listing.price || (listing.type === "sale" ? 0 : undefined),
      });

      // Set form values
      setValue("tags", tags);
      setValue("location", listing.locationName || "");
      setValue("latitude", listing.latitude);
      setValue("longitude", listing.longitude);
    }
  }, [open, listing, reset, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedTags([]);
      setUploadedImage(null);
      setCurrentLocation("");
      setCurrentLatitude(null);
      setCurrentLongitude(null);
      setExistingImageUrl("");
      reset();
    }
  }, [open, reset]);

  const watchedValues = watch();

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    setValue("tags", tags, { shouldValidate: true });
  };

  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    setValue("image", file);
  };

  const handleLocationSelect = (location: string, lat?: number, lng?: number) => {
    setCurrentLocation(location);
    setCurrentLatitude(lat || null);
    setCurrentLongitude(lng || null);
    setValue("location", location, { shouldValidate: true });
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        tags: selectedTags,
        location: currentLocation,
        latitude: currentLatitude || undefined,
        longitude: currentLongitude || undefined,
        image: uploadedImage || undefined,
      };

      console.log("Edit listing form data:", formData);

      // Call the onSave callback if provided
      // Dialog will remain open with loading state until API call completes
      onSave?.(formData);

      // Note: Dialog closure is now handled by the parent component after API success
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-[800px] max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-green">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="truncate">Edit Listing</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Update your {listing.type} listing details
          </DialogDescription>
        </DialogHeader>

        <GoogleMapsProvider>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 min-w-0">
            <PhotoUploadSection
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              existingImageUrl={existingImageUrl}
              error={errors.image?.message as string}
              disabled={true}
            />

            <BasicInfoSection
              register={register}
              errors={errors}
              listingType={listing.type as "free" | "wanted" | "sale"}
              watchedValues={watchedValues}
            />

            <PickupInfoSection
              register={register}
              errors={errors}
              watchedValues={watchedValues}
            />

            <TagsSelectionSection
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              error={errors.tags?.message}
            />

            <LocationSelectionSection
              currentLocation={currentLocation}
              currentLatitude={currentLatitude}
              currentLongitude={currentLongitude}
              onLocationSelect={handleLocationSelect}
              isLoadingLocation={isLoadingLocation}
              setIsLoadingLocation={setIsLoadingLocation}
              error={errors.location?.message}
            />

            <FormActions
              onCancel={handleCancel}
              isSubmitting={isSubmitting || isUpdating}
              submitText="Update Listing"
              cancelText="Cancel"
            />
          </form>
        </GoogleMapsProvider>
      </DialogContent>
    </Dialog>
  );
}
