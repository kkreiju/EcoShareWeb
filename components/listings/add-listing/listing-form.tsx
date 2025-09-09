"use client";

import { useState } from "react";
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
import { GoogleMapsProvider } from "./google-maps-provider";
import { PhotoUploadSection } from "./photo-upload-section";
import { BasicInfoSection } from "./basic-info-section";
import { PickupInfoSection } from "./pickup-info-section";
import { TagsSelectionSection } from "./tags-selection-section";
import { LocationSelectionSection } from "./location-selection-section";
import { FormActions } from "./form-actions";

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
}

export function ListingForm({ open, onOpenChange, listingType }: ListingFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

  const onSubmit = (data: ListingFormData) => {
    console.log(`${listingType === "sale" ? "Sale" : listingType === "wanted" ? "Wanted" : "Free"} listing data:`, { 
      ...data, 
      image: uploadedImage, 
      type: listingType,
      coordinates: {
        latitude: currentLatitude,
        longitude: currentLongitude
      }
    });

    // TODO: Submit the form data to your backend
    // Example: await createListing({ ...data, type: listingType, latitude: currentLatitude, longitude: currentLongitude }, uploadedImage);

    // Reset form and close dialog
    handleFormReset();
    onOpenChange(false);
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
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-[800px] max-h-[90vh] overflow-y-auto scrollbar-green">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Upload className={`h-5 w-5 sm:h-6 sm:w-6 ${
                listingType === "sale" ? "text-red-600" :
                listingType === "wanted" ? "text-yellow-600" :
                "text-green-600"
              }`} />
              <span className="truncate">Create {listingType === "sale" ? "Sale" : listingType === "wanted" ? "Wanted" : "Free"} Listing</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {listingType === "sale"
                ? "Sell your eco-friendly items and services to interested buyers"
                : listingType === "wanted"
                ? "Post what you're looking for and connect with people who can help"
                : "Share items you no longer need with the community"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            />
          </form>
        </DialogContent>
      </Dialog>
    </GoogleMapsProvider>
  );
}
