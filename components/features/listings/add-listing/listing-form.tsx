"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import { GoogleMapsProvider } from "../shared/google-maps-provider";
import { PhotoUploadSection } from "./photo-upload-section";
import { LocationSelectionSection } from "./location-selection-section";
import { BasicInfoSection, TagsSelectionSection, PickupInfoSection, FormActions } from "../shared";
import { NonCompostableMaterialModal } from "./non-compostable-material-modal";
import { useListingForm, ListingFormData } from "./hooks/use-listing-form";
import { fileToBase64, reverseGeocode, mapListingType, getGeolocationErrorMessage, createListingSchema } from "../shared/form-utils";
import { toast } from "sonner";

interface ListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingType?: "free" | "wanted" | "sale" | null;
  onListingCreated?: () => void;
}

export function ListingForm({ open, onOpenChange, listingType, onListingCreated }: ListingFormProps) {
  const {
    selectedTags,
    uploadedImage,
    currentLocation,
    currentLatitude,
    currentLongitude,
    isLoadingLocation,
    isSubmitting,
    showNonCompostableModal,
    userData,
    userDataLoading,
    setSelectedTags,
    setUploadedImage,
    setCurrentLocation,
    setCurrentLatitude,
    setCurrentLongitude,
    setIsLoadingLocation,
    setIsSubmitting,
    setShowNonCompostableModal,
    resetForm,
  } = useListingForm();

  // Use shared validation schema
  const finalSchema = createListingSchema(listingType ?? null, true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      tags: [],
      location: "",
      latitude: undefined,
      longitude: undefined,
      price: undefined,
      image: undefined,
    },
  });

  // Create listing API call
  const createListing = async (formData: ListingFormData) => {
    if (!userData?.user_id) {
      throw new Error("User not authenticated");
    }

    if (!uploadedImage) {
      throw new Error("Please upload an image");
    }

    // Convert image to base64
    const imageBase64 = await fileToBase64(uploadedImage);

    const listingData = {
      user_id: userData.user_id,
      title: formData.title,
      type: mapListingType(listingType ?? null),
      imageURL: imageBase64,
      description: formData.description,
      tags: selectedTags,
      price: listingType === "sale" ? formData.price : undefined,
      quantity: formData.quantity,
      pickupTimeAvailability: formData.pickupTimes,
      instructions: formData.pickupInstructions,
      locationName: currentLocation,
      latitude: currentLatitude || 0,
      longitude: currentLongitude || 0
    };

    const response = await fetch('/api/listing/create-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;

      // Check if this is an image verification error (non-compostable material)
      if (errorMessage.includes("Image verification failed")) {
        // Return a special object to indicate non-compostable material
        return {
          success: false,
          error: "non-compostable",
          message: errorMessage
        };
      }

      // For other errors, throw as usual
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  const handleTagSelect = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);
    const apiKey = "AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA";

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude, apiKey);

      setCurrentLocation(address);
      setCurrentLatitude(latitude);
      setCurrentLongitude(longitude);
      setValue("location", address);
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      if (error instanceof GeolocationPositionError) {
        alert(getGeolocationErrorMessage(error));
      } else {
        alert("Unable to get your current location. Please try again or select from map.");
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationUpdate = (address: string, lat: number, lng: number) => {
    setCurrentLocation(address);
    setCurrentLatitude(lat);
    setCurrentLongitude(lng);
    setValue("location", address);
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const onSubmit = async (data: ListingFormData) => {
    if (userDataLoading) {
      toast.error("Please wait while we verify your account");
      return;
    }

    if (!userData?.user_id) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createListing(data);

      // Check if this is a non-compostable material response
      if (result.error === "non-compostable") {
        setShowNonCompostableModal(true);
        return;
      }

      // Show success message
      toast.success("Listing created successfully!", {
        description: "Your listing has been added and is now live for others to see.",
        duration: 4000,
      });

      // Call the callback to refresh listings
      onListingCreated?.();

      // Reset form and close dialog
      handleFormReset();
      onOpenChange(false);

    } catch (error) {
      console.error("Error creating listing:", error);

      // Show error message for other errors
      toast.error("Failed to create listing", {
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        duration: 5000,
      });

      // Keep the modal open so user can try again
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormReset = () => {
    reset();
    setSelectedTags([]);
    setUploadedImage(null);
    setCurrentLocation("");
    setCurrentLatitude(null);
    setCurrentLongitude(null);
  };

  const handleCancel = () => {
    handleFormReset();
    onOpenChange(false);
  };

  return (
    <GoogleMapsProvider apiKey="AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[80vh] px-6">
            <div className="space-y-6 py-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className={`h-5 w-5 ${
                    listingType === "sale" ? "text-red-600" :
                    listingType === "wanted" ? "text-yellow-600" :
                    "text-green-600"
                  }`} />
                  Create {listingType === "sale" ? "Sale" : listingType === "wanted" ? "Wanted" : "Free"} Listing
                </DialogTitle>
                <DialogDescription>
                  {listingType === "sale"
                    ? "Sell your eco-friendly items and services to interested buyers"
                    : listingType === "wanted"
                    ? "Post what you're looking for and connect with people who can help"
                    : "Share items you no longer need with the community"
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 min-w-0">
            <PhotoUploadSection
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              error={errors.image?.message}
            />

            <BasicInfoSection
              register={register}
              errors={errors}
              listingType={listingType}
              mode="add"
            />

            <PickupInfoSection
              register={register}
              errors={errors}
              mode="add"
            />

            <TagsSelectionSection
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              error={errors.tags?.message}
              mode="add"
            />

            <LocationSelectionSection
              register={register}
              setValue={setValue}
              errors={errors}
              currentLocation={currentLocation}
              currentLatitude={currentLatitude}
              currentLongitude={currentLongitude}
              isLoadingLocation={isLoadingLocation}
              onLocationUpdate={handleLocationUpdate}
              onGetCurrentLocation={handleGetCurrentLocation}
            />

            <FormActions
              onCancel={handleCancel}
              listingType={listingType}
              isSubmitting={isSubmitting}
              mode="add"
            />
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <NonCompostableMaterialModal
        open={showNonCompostableModal}
        onOpenChange={setShowNonCompostableModal}
        onTryAgain={() => {
          // Just close the modal - user can try uploading a different image
          setShowNonCompostableModal(false);
        }}
      />
    </GoogleMapsProvider>
  );
}
