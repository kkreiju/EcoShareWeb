"use client";

import { useState, useCallback } from "react";
import { Listing } from "@/lib/types";
import { toast } from "sonner";

interface UseListingActionsReturn {
  // Dialog states
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isVisibilityDialogOpen: boolean;
  isReviewModalOpen: boolean;
  isUpdatingListing: boolean;
  
  // Selected items
  selectedListing: Listing | null;
  listingToDelete: Listing | null;
  listingToToggle: Listing | null;
  
  // Actions
  openEditModal: (listing: Listing) => void;
  closeEditModal: () => void;
  openDeleteDialog: (listing: Listing) => void;
  closeDeleteDialog: () => void;
  openVisibilityDialog: (listing: Listing) => void;
  closeVisibilityDialog: () => void;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  handleDeleteListing: (listingId: string, userId: string) => Promise<void>;
  handleToggleVisibility: (listingId: string, userId: string) => Promise<"Active" | "Inactive" | "Sold" | "Unavailable">;
  handleSaveEdit: (formData: any, listing: Listing, userId: string, onSuccess: () => void) => Promise<void>;
  setUpdating: (updating: boolean) => void;
}

/**
 * Custom hook for managing listing actions (edit, delete, toggle visibility)
 */
export function useListingActions(
  onListingUpdated: () => void,
  onRequestsUpdate: () => void
): UseListingActionsReturn {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isUpdatingListing, setIsUpdatingListing] = useState(false);
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [listingToToggle, setListingToToggle] = useState<Listing | null>(null);

  const openEditModal = useCallback((listing: Listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedListing(null);
  }, []);

  const openDeleteDialog = useCallback((listing: Listing) => {
    setListingToDelete(listing);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setListingToDelete(null);
  }, []);

  const openVisibilityDialog = useCallback((listing: Listing) => {
    setListingToToggle(listing);
    setIsVisibilityDialogOpen(true);
  }, []);

  const closeVisibilityDialog = useCallback(() => {
    setIsVisibilityDialogOpen(false);
    setListingToToggle(null);
  }, []);

  const openReviewModal = useCallback(() => {
    setIsReviewModalOpen(true);
  }, []);

  const closeReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    onRequestsUpdate();
  }, [onRequestsUpdate]);

  const handleDeleteListing = useCallback(async (listingId: string, userId: string) => {
    try {
      const response = await fetch("/api/listing/unavailable-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: listingId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json();
      onListingUpdated();
      closeDeleteDialog();
    } catch (error) {
      console.error("Error marking listing as unavailable:", error);
      throw error;
    }
  }, [onListingUpdated, closeDeleteDialog]);

  const handleToggleVisibility = useCallback(async (listingId: string, userId: string) => {
    try {
      const response = await fetch("/api/listing/deactivate-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: listingId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newStatus = result.data.new_status as "Active" | "Inactive" | "Sold" | "Unavailable";
      onListingUpdated();
      closeVisibilityDialog();
      return newStatus;
    } catch (error) {
      console.error("Error toggling listing visibility:", error);
      throw error;
    }
  }, [onListingUpdated, closeVisibilityDialog]);

  const handleSaveEdit = useCallback(async (
    formData: any,
    listing: Listing,
    userId: string,
    onSuccess: () => void
  ) => {
    setIsUpdatingListing(true);

    try {
      // Handle image upload if a new image was provided
      let imageBase64: string | undefined;
      if (formData.image && formData.image instanceof File) {
        const { fileToBase64 } = await import("../../shared/form-utils/helpers");
        imageBase64 = await fileToBase64(formData.image);
      }

      const updateData: {
        list_id: string;
        user_id: string;
        description: any;
        tags: any;
        price: any;
        quantity: any;
        unit: any;
        pickupTimeAvailability: any;
        instructions: any;
        locationName: any;
        latitude: any;
        longitude: any;
        imageURL?: string;
      } = {
        list_id: listing.list_id,
        user_id: userId,
        description: formData.description,
        tags: formData.tags || [],
        price: formData.price || undefined,
        quantity: formData.quantity,
        unit: formData.unit,
        pickupTimeAvailability: formData.pickupTimes,
        instructions: formData.pickupInstructions,
        locationName: formData.location,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        ...(imageBase64 && { imageURL: imageBase64 }),
      };

      const response = await fetch("/api/listing/update-listing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json();
      onListingUpdated();
      closeEditModal();
      
      toast.success("Listing updated successfully", {
        description: "Your listing has been updated and is now live.",
        duration: 4000,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing", {
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsUpdatingListing(false);
    }
  }, [closeEditModal, onListingUpdated]);

  return {
    isEditModalOpen,
    isDeleteDialogOpen,
    isVisibilityDialogOpen,
    isReviewModalOpen,
    isUpdatingListing,
    selectedListing,
    listingToDelete,
    listingToToggle,
    openEditModal,
    closeEditModal,
    openDeleteDialog,
    closeDeleteDialog,
    openVisibilityDialog,
    closeVisibilityDialog,
    openReviewModal,
    closeReviewModal,
    handleDeleteListing,
    handleToggleVisibility,
    handleSaveEdit,
    setUpdating: setIsUpdatingListing,
  };
}

