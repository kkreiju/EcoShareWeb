"use client";

import { useCallback } from "react";
import { Listing } from "@/lib/types";
import { useManageListings } from "./hooks/use-manage-listings";
import { useListingActions } from "./hooks/use-listing-actions";
import { ManageListingsHeader } from "./components/manage-listings-header";
import { ManageListingsContent } from "./components/manage-listings-content";
import { ReviewRequestsModal } from "../review-requests-modal";
import { EditListingForm } from "../edit-listing";
import { ListingDeleteDialog } from "../listing-delete-dialog";
import { ListingVisibilityDialog } from "../listing-visibility-dialog";

interface ManageListingsViewProps {
  className?: string;
}

export function ManageListingsView({ className = "" }: ManageListingsViewProps) {
  const {
    listings,
    filters,
    searchQuery,
    totalCount,
    viewMode,
    isLoading,
    error,
    userData,
    userDataLoading,
    pendingRequestsCount,
    setFilters,
    setSearchQuery,
    setViewMode,
    fetchListings,
    fetchPendingRequestsCount,
    isOwner,
    updateListingStatus,
  } = useManageListings();

  const {
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
  } = useListingActions(fetchListings, fetchPendingRequestsCount);

  const handleDelete = useCallback((listing: Listing) => {
    if (isOwner(listing)) {
      openDeleteDialog(listing);
    }
  }, [isOwner, openDeleteDialog]);

  const handleConfirmDelete = useCallback(async (listingId: string) => {
    if (!userData?.user_id) return;
    try {
      await handleDeleteListing(listingId, userData.user_id);
      updateListingStatus(listingId, "Unavailable");
    } catch (error) {
      throw error;
    }
  }, [userData?.user_id, handleDeleteListing, updateListingStatus]);

  const handleToggle = useCallback((listing: Listing) => {
    if (isOwner(listing)) {
      openVisibilityDialog(listing);
    }
  }, [isOwner, openVisibilityDialog]);

  const handleConfirmToggle = useCallback(async (listingId: string) => {
    if (!userData?.user_id) return;
    try {
      const newStatus = await handleToggleVisibility(listingId, userData.user_id);
      if (newStatus) {
        updateListingStatus(listingId, newStatus);
      }
    } catch (error) {
      throw error;
    }
  }, [userData?.user_id, handleToggleVisibility, updateListingStatus]);

  const handleEdit = useCallback((listing: Listing) => {
    if (isOwner(listing)) {
      openEditModal(listing);
    }
  }, [isOwner, openEditModal]);

  const handleSave = useCallback(async (formData: any) => {
    if (!selectedListing || !userData?.user_id) {
      console.error("Missing selected listing or user data");
      return;
    }
    await handleSaveEdit(formData, selectedListing, userData.user_id, fetchListings);
  }, [selectedListing, userData?.user_id, handleSaveEdit, fetchListings]);

  const handleViewDetails = useCallback((listing: Listing) => {
    window.location.href = `/user/listing/${listing.list_id}`;
  }, []);

  const handleShare = useCallback((listing: Listing) => {
    const listingUrl = `${window.location.origin}/user/listing/${listing.list_id}`;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: listingUrl,
      });
    } else {
      navigator.clipboard.writeText(listingUrl);
    }
  }, []);

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        <ManageListingsHeader
          isLoading={isLoading}
          pendingRequestsCount={pendingRequestsCount}
          onRefresh={fetchListings}
          onReviewRequests={openReviewModal}
          onListingCreated={fetchListings}
        />

        <ManageListingsContent
          listings={listings}
          filters={filters}
          searchQuery={searchQuery}
          totalCount={totalCount}
          viewMode={viewMode}
          isLoading={isLoading}
          userDataLoading={userDataLoading}
          error={error}
          isOwner={isOwner}
          onFiltersChange={setFilters}
          onSearchChange={setSearchQuery}
          onViewModeChange={setViewMode}
          onRefresh={fetchListings}
          onDelete={handleDelete}
          onToggleVisibility={handleToggle}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onShare={handleShare}
        />
      </div>

      <ReviewRequestsModal
        isOpen={isReviewModalOpen}
        onOpenChange={closeReviewModal}
        onRequestsUpdate={fetchPendingRequestsCount}
      />

      <EditListingForm
        open={isEditModalOpen}
        onOpenChange={closeEditModal}
        listing={selectedListing}
        onSave={handleSave}
        isUpdating={isUpdatingListing}
      />

      <ListingDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        listing={listingToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      <ListingVisibilityDialog
        isOpen={isVisibilityDialogOpen}
        onClose={closeVisibilityDialog}
        listing={listingToToggle}
        onConfirmToggle={handleConfirmToggle}
      />
    </>
  );
}

