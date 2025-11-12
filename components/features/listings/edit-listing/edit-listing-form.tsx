"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import { Listing } from "@/lib/types";
import { GoogleMapsProvider } from "../shared/google-maps-provider";
import { PhotoUploadSection } from "./photo-upload-section";
import { LocationSelectionSection } from "./location-selection-section";
import { BasicInfoSection, TagsSelectionSection, PickupInfoSection, FormActions, createEditListingSchema, parseTags } from "../shared";

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

  // Use shared validation schema
  const finalSchema = createEditListingSchema(listing?.type);

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
      price: listing?.type?.toLowerCase() === "sale" ? (listing?.price || 0) : undefined,
    },
  });


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
        price: listing.type?.toLowerCase() === "sale" ? (listing.price || 0) : undefined,
      });

      // Set form values
      setValue("tags", tags);
      setValue("location", listing.locationName || "");
      setValue("latitude", listing.latitude);
      setValue("longitude", listing.longitude);
      if (listing.type?.toLowerCase() === "sale") {
        setValue("price", listing.price || 0);
      }
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
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh] px-6">
          <div className="space-y-6 py-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Edit Listing
              </DialogTitle>
              <DialogDescription>
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
              mode="edit"
            />

            <PickupInfoSection
              register={register}
              errors={errors}
              mode="edit"
            />

            <TagsSelectionSection
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              error={errors.tags?.message}
              mode="edit"
              required={false}
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
              mode="edit"
            />
              </form>
            </GoogleMapsProvider>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
