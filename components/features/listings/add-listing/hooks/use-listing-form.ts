"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

export type ListingFormData = {
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

interface UseListingFormReturn {
  // Form state
  selectedTags: string[];
  uploadedImage: File | null;
  currentLocation: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  isLoadingLocation: boolean;
  isSubmitting: boolean;
  showNonCompostableModal: boolean;
  userData: any;
  userDataLoading: boolean;
  
  // Actions
  setSelectedTags: (tags: string[]) => void;
  setUploadedImage: (image: File | null) => void;
  setCurrentLocation: (location: string) => void;
  setCurrentLatitude: (lat: number | null) => void;
  setCurrentLongitude: (lng: number | null) => void;
  setIsLoadingLocation: (loading: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setShowNonCompostableModal: (show: boolean) => void;
  resetForm: () => void;
}

/**
 * Custom hook for managing listing form state
 * Handles user data fetching and form state management
 */
export function useListingForm(): UseListingFormReturn {
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

  const { email } = useAuth();

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

  const resetForm = () => {
    setSelectedTags([]);
    setUploadedImage(null);
    setCurrentLocation("");
    setCurrentLatitude(null);
    setCurrentLongitude(null);
    setShowNonCompostableModal(false);
  };

  return {
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
  };
}

