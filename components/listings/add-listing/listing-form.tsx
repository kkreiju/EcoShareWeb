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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PhotoUploadSection } from "./photo-upload-section";
import { BasicInfoSection } from "./basic-info-section";
import { PickupInfoSection } from "./pickup-info-section";
import { TagsSelectionSection } from "./tags-selection-section";
import { LocationSelectionSection } from "./location-selection-section";
import { FormActions } from "./form-actions";
import { NonCompostableMaterialModal } from "./non-compostable-material-modal";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";

type ListingFormData = {
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

interface ListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingType?: "free" | "wanted" | "sale" | null;
  onListingCreated?: () => void;
}

export function ListingForm({ open, onOpenChange, listingType, onListingCreated }: ListingFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [showNonCompostableModal, setShowNonCompostableModal] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  const { user, email } = useAuth();

  // Base schema
  const baseSchema = {
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    pickupTimes: z.string().min(1, "Please specify pickup times"),
    pickupInstructions: z.string().min(1, "Please provide pickup instructions"),
    tags: z.array(z.string()).min(1, "Please select at least one tag"),
    location: z.string().min(1, "Please select a location"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    image: z.any().optional(),
  };

  // Dynamic schema that includes image validation and conditional price
  const listingSchema = listingType === "sale"
    ? z.object({
        ...baseSchema,
        price: z.number().min(0.01, "Price must be greater than 0"),
      })
    : z.object({
        ...baseSchema,
        price: z.number().optional(),
      });

  const finalSchema = listingSchema.refine((data) => uploadedImage !== null, {
    message: "Please upload a photo",
    path: ["image"],
  });

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

  // Fetch user data when component mounts or email changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", email)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserData(null);
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

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

    // Map listing type to the expected format
    const typeMapping = {
      free: "Free",
      wanted: "Wanted",
      sale: "Sale"
    };

    const listingData = {
      user_id: userData.user_id,
      title: formData.title,
      type: typeMapping[listingType as keyof typeof typeMapping] || "Free",
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

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    const apiKey = "AIzaSyDLA0gcMkbfwlw2vRmN0gnM414Oq4IG4aA";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        console.error("Geocoding failed:", data.status, data.error_message);
        return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleGetCurrentLocation = async () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });

        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);

        setCurrentLocation(address);
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
        setValue("location", address);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
      } catch (error) {
        console.error("Error getting location:", error);
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied. Please enable location permissions and try again.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable. Please try again later.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again.");
              break;
            default:
              alert("An unknown error occurred while retrieving location.");
              break;
          }
        } else {
          alert("Unable to get your current location. Please try again or select from map.");
        }
      } finally {
        setIsLoadingLocation(false);
      }
    } else {
      alert("Geolocation is not supported by this browser.");
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
      console.log("Creating listing with data:", data);

      const result = await createListing(data);

      // Check if this is a non-compostable material response
      if (result.error === "non-compostable") {
        console.log("Non-compostable material detected");
        setShowNonCompostableModal(true);
        return;
      }

      console.log("Listing created successfully:", result);

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
            />

            <PickupInfoSection
              register={register}
              errors={errors}
            />

            <TagsSelectionSection
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              error={errors.tags?.message}
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
