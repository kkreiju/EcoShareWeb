"use client";

import { useState, useEffect, useCallback } from "react";
import { Listing, ListingFilters, ListingsResponse } from "@/lib/DataClass";
import { useAuth } from "@/hooks/use-auth";
import { ListingCard } from "./listing-card";
import { ListingFiltersComponent } from "./listing-filters";
import { SearchBar } from "./search-bar";
import { LoadingSkeleton, TableSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";
import { ListingsTable } from "./listings-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddListingDialog } from "./add-listing-dialog";
import { ReviewRequestsModal } from "./review-requests-modal";
import { EditListingForm } from "./edit-listing";
import { ListingDeleteDialog } from "./listing-delete-dialog";
import { ListingVisibilityDialog } from "./listing-visibility-dialog";
import {
  RefreshCw,
  AlertCircle,
  Plus,
  MessageSquare,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";

interface BrowseListingsProps {
  className?: string;
}

export function BrowseListings({ className = "" }: BrowseListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [listingToToggle, setListingToToggle] = useState<Listing | null>(null);
  const [isUpdatingListing, setIsUpdatingListing] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [cachedUserEmail, setCachedUserEmail] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch user data when user changes, with caching to prevent data loss
  useEffect(() => {
    const fetchUserData = async () => {
      // If user.email is undefined but we have cached data, keep current state
      if (!user?.email) {
        if (!cachedUserEmail && !userData) {
          setUserDataLoading(false);
        }
        return;
      }

      // If email hasn't changed and we already have data, skip fetch
      if (user.email === cachedUserEmail && userData) {
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", user.email)
          .single();

        if (error) {
          // Don't clear existing data on error
          if (!userData) {
            setUserData(null);
          }
        } else {
          setUserData(data);
          setCachedUserEmail(user.email);
        }
      } catch (err) {
        // Don't clear existing data on error
        if (!userData) {
          setUserData(null);
        }
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email, cachedUserEmail, userData]);

  // Check if current user owns the listing
  const isOwner = (listing: Listing) => {
    // If still loading, return false
    if (userDataLoading) {
      return false;
    }

    // If no user data and no cached email, return false
    if (!userData && !cachedUserEmail) {
      return false;
    }

    // If we have user data, use it for ownership check
    if (userData) {
      const currentUserId = String(userData.user_id);
      const listingUserId = String(listing.user_id);
      return currentUserId === listingUserId;
    }

    // Conservative fallback: return false if no userData but have cached email
    return false;
  };

  const [allListings, setAllListings] = useState<Listing[]>([]);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For listing management, use the manage-listing endpoint like mobile app
      // This returns all listings for the current user including inactive/unavailable ones
      if (!userData?.user_id) {
        // If userData is not available yet, don't set loading to false
        // The component will wait for userData to be loaded
        return;
      }

      const url = `/api/listing/manage-listing?user_id=${userData.user_id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      // Extract the data array from the API response (same format as mobile)
      const listingsData = data.data || [];

      // Map the API response fields to match the Listing interface (same as mobile)
      const mappedListings = listingsData.map((apiListing: any) => {
        return {
          user_id: apiListing.user_id,
          list_id: apiListing.list_id,
          title: apiListing.title,
          type: apiListing.type,
          imageURL: apiListing.imageURL,
          description: apiListing.description,
          tags: apiListing.tags ? JSON.parse(apiListing.tags) : [],
          price: apiListing.price,
          quantity: apiListing.quantity,
          pickupTimeAvailability: apiListing.pickupTimeAvailability,
          instructions: apiListing.instructions,
          locationName: apiListing.locationName,
          latitude: apiListing.latitude,
          longitude: apiListing.longitude,
          status: apiListing.status?.trim() || "Active",
          category: apiListing.type,
          postedDate: apiListing.postedDate,
        };
      });

      // Store all listings for the user
      setAllListings(mappedListings);
      setTotalCount(mappedListings.length);
    } catch (err) {
      console.error("❌ Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
      setAllListings([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.user_id]);

  const fetchPendingRequestsCount = useCallback(async () => {
    if (!userData?.user_id) return;

    try {
      const response = await fetch(
        `/api/transaction/review-requests?user_id=${userData.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.requests) {
          const pendingCount = data.requests.filter((req: any) => req.status === "Pending").length;
          setPendingRequestsCount(pendingCount);
        }
      }
    } catch (error) {
      console.error("Error fetching pending requests count:", error);
    }
  }, [userData?.user_id]);

  // Fetch pending requests count when user data is available
  useEffect(() => {
    if (userData?.user_id && !userDataLoading) {
      fetchPendingRequestsCount();
    }
  }, [userData?.user_id, userDataLoading, fetchPendingRequestsCount]);

  // Filter and process listings whenever allListings changes
  useEffect(() => {
    if (!allListings.length) {
      setListings([]);
      return;
    }

    let filteredData = [...allListings];
    let filteredCount = allListings.length;

    // Apply client-side search filtering if needed
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();

      filteredData = filteredData.filter((item) => {
        // Search in title
        if (item.title.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Search in description
        if (item.description.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Search in tags (if they exist)
        if (item.tags && Array.isArray(item.tags)) {
          return item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm)
          );
        }

        // Search in location name
        if (item.locationName.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Search in category/type
        if (item.type.toLowerCase().includes(searchTerm)) {
          return true;
        }

        return false;
      });

      filteredCount = filteredData.length;
    }

    // Apply client-side category filtering if needed
    if (filters.type && filters.type !== "all") {
      filteredData = filteredData.filter((item) => {
        return item.type === filters.type;
      });

      filteredCount = filteredData.length;
    }

    // Apply client-side sorting if needed
    if (filters.sort_by && filters.sort_by !== null) {
      filteredData = filteredData.sort((a, b) => {
        switch (filters.sort_by) {
          case "newest":
            return (
              new Date(b.postedDate).getTime() -
              new Date(a.postedDate).getTime()
            );
          case "oldest":
            return (
              new Date(a.postedDate).getTime() -
              new Date(b.postedDate).getTime()
            );
          case "price_high":
            return (b.price || 0) - (a.price || 0);
          case "price_low":
            return (a.price || 0) - (b.price || 0);
          default:
            return 0;
        }
      });
    } else {
      // Default sorting by newest, with unavailable items at the bottom (like mobile app)
      filteredData.sort((a, b) => {
        // First sort by status priority: Active > Inactive/Sold > Unavailable
        const statusA = a.status?.trim();
        const statusB = b.status?.trim();
        if (statusA === "Active" && statusB !== "Active") return -1;
        if (statusA !== "Active" && statusB === "Active") return 1;
        if (statusA === "Unavailable" && statusB !== "Unavailable") return 1;
        if (statusA !== "Unavailable" && statusB === "Unavailable") return -1;

        // Then sort by date (newest first)
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      });
    }

    setListings(filteredData);
    setTotalCount(filteredCount);
  }, [allListings, searchQuery, filters]);

  // Initial load and refetch when filters/search changes
  useEffect(() => {
    if (userData && !userDataLoading) {
      fetchListings();
    }
  }, [fetchListings, userData, userDataLoading]);

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    fetchListings();
  };

  const handleReviewRequests = () => {
    setIsReviewModalOpen(true);
  };

  const handleDeleteListing = (listing: Listing) => {
    // Only allow delete if user is the owner
    if (isOwner(listing)) {
      setListingToDelete(listing);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async (listingId: string) => {
    try {
      if (!userData?.user_id) {
        throw new Error("User data not available");
      }

      // Call the API to mark listing as unavailable
      const response = await fetch("/api/listing/unavailable-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: listingId,
          user_id: userData.user_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Mark as unavailable response:", result);

      // Update the listing status to "Unavailable" in the local state instead of removing it
      setAllListings((prevListings) =>
        prevListings.map((listing) =>
          listing.list_id === listingId
            ? { ...listing, status: "Unavailable" }
            : listing
        )
      );

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setListingToDelete(null);
    } catch (error) {
      console.error("Error marking listing as unavailable:", error);
      throw error; // Re-throw so the dialog can handle the error
    }
  };

  const handleToggleVisibility = (listing: Listing) => {
    // Only allow toggle visibility if user is the owner
    if (isOwner(listing)) {
      setListingToToggle(listing);
      setIsVisibilityDialogOpen(true);
    }
  };

  const handleConfirmToggleVisibility = async (listingId: string) => {
    try {
      if (!userData?.user_id) {
        throw new Error("User data not available");
      }

      // Call the API to toggle listing availability status
      const response = await fetch("/api/listing/deactivate-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: listingId,
          user_id: userData.user_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Toggle listing status response:", result);

      // Update the listing status in local state based on the API response
      setAllListings((prevListings) =>
        prevListings.map((listing) =>
          listing.list_id === listingId
            ? { ...listing, status: result.data.new_status }
            : listing
        )
      );

      // Close the dialog
      setIsVisibilityDialogOpen(false);
      setListingToToggle(null);
    } catch (error) {
      console.error("Error toggling listing visibility:", error);
      throw error; // Re-throw so the dialog can handle the error
    }
  };

  const handleEditListing = (listing: Listing) => {
    // Only allow edit if user is the owner
    if (isOwner(listing)) {
      setSelectedListing(listing);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (formData: any) => {
    if (!selectedListing || !userData?.user_id) {
      console.error("Missing selected listing or user data");
      return;
    }

    setIsUpdatingListing(true);

    try {
      // Prepare the data for the API according to the schema you provided
      const updateData = {
        list_id: selectedListing.list_id,
        user_id: userData.user_id,
        description: formData.description,
        tags: formData.tags || [],
        price: formData.price || undefined,
        quantity: formData.quantity,
        pickupTimeAvailability: formData.pickupTimes,
        instructions: formData.pickupInstructions,
        locationName: formData.location,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      };

      // TODO: Handle image upload if formData.image exists
      // This would require a separate image upload API call or multipart form data
      if (formData.image) {
        console.log("Image upload needed for:", formData.image);
        // For now, we'll log it. Image upload would typically require:
        // 1. Upload image to storage service
        // 2. Get the new image URL
        // 3. Include the imageURL in the updateData
      }

      console.log("Updating listing with data:", updateData);

      // Call the update API
      const response = await fetch("/api/listing/update-listing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Update response:", result);

      // Close the modal
      setIsEditModalOpen(false);
      setSelectedListing(null);

      // Refresh the listings to show updated data
      await fetchListings();

      // Show success message
      toast.success("Listing updated successfully", {
        description: "Your listing has been updated and is now live.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error updating listing:", error);

      // Show error toast to user
      toast.error("Failed to update listing", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        duration: 5000,
      });

      // Keep the modal open so user can try again
    } finally {
      setIsUpdatingListing(false);
    }
  };







  const handleViewDetails = (listing: Listing) => {
    // Navigate to listing details page
    window.location.href = `/user/listing/${listing.list_id}`;
  };

  const handleContact = (listing: Listing) => {
    // TODO: Implement contact functionality
    console.log("Contact listing owner:", listing.list_id);
    // This could open a chat modal or navigate to a messaging page
  };

  const handleShare = (listing: Listing) => {
    const listingUrl = `${window.location.origin}/user/listing/${listing.list_id}`;

    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: listingUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(listingUrl);
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (type.toLowerCase() === "free") return "Free";
    if (type.toLowerCase() === "wanted") return "Wanted";
    return `₱${price?.toFixed(2) || "0.00"}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-500 text-white";
      case "wanted":
        return "bg-yellow-500 text-white";
      case "sale":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "inactive":
        return "bg-gray-500 text-white";
      case "sold":
        return "bg-gray-500 text-white";
      case "unavailable":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Manage Listings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your eco-friendly items and services
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <AddListingDialog onListingCreated={handleRefresh}>
              <Button
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Add Listing</span>
              </Button>
            </AddListingDialog>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/user/transaction-management")}
                className="border-border flex-1 sm:flex-initial justify-center sm:justify-start"
              >
                <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate hidden sm:inline">Transactions</span>
                <span className="truncate sm:hidden">History</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReviewRequests}
                className="border-border flex-1 sm:flex-initial justify-center sm:justify-start relative"
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate hidden sm:inline">
                  Review Requests
                </span>
                <span className="truncate sm:hidden">Requests</span>
                {pendingRequestsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                  >
                    {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-border flex-1 sm:flex-initial justify-center sm:justify-start"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 flex-shrink-0 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span className="truncate hidden sm:inline">Refresh</span>
                <span className="truncate sm:hidden">Sync</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for items, descriptions, locations..."
            isLoading={isLoading || userDataLoading}
            showSuggestions={true}
          />
          {searchQuery && !isLoading && !userDataLoading && (
            <div className="text-sm text-muted-foreground">
              Found {totalCount} result{totalCount !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Filters */}
        <ListingFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={totalCount}
          isLoading={isLoading || userDataLoading}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Error State */}
        {error && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="flex-1">{error}</span>
              <Button
                variant="link"
                size="sm"
                onClick={handleRefresh}
                className="p-0 h-auto hover:text-destructive self-start sm:self-center"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {isLoading || userDataLoading ? (
          viewMode === "grid" ? (
            <LoadingSkeleton />
          ) : (
            <TableSkeleton />
          )
        ) : listings.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.list_id}
                listing={listing}
                onDelete={handleDeleteListing}
                onToggleVisibility={handleToggleVisibility}
                onEditListing={handleEditListing}
                onViewDetails={handleViewDetails}
                onShare={handleShare}
                isOwner={isOwner(listing)}
              />
            ))}
          </div>
        ) : (
          <ListingsTable
            listings={listings}
            onDelete={handleDeleteListing}
            onToggleVisibility={handleToggleVisibility}
            onEditListing={handleEditListing}
            onShare={handleShare}
            onViewDetails={handleViewDetails}
            isOwner={isOwner}
            formatPrice={formatPrice}
            formatDate={formatDate}
            getTypeColor={getTypeColor}
          />
        )}

        {/* Load More - Future Enhancement */}
        {listings.length > 0 && listings.length < totalCount && (
          <div className="text-center pt-6 sm:pt-8">
            <Button
              variant="outline"
              className="border-border w-full sm:w-auto"
            >
              Load More Listings
            </Button>
          </div>
        )}
      </div>

      <ReviewRequestsModal
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        onRequestsUpdate={fetchPendingRequestsCount}
      />

      <EditListingForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        listing={selectedListing}
        onSave={handleSaveEdit}
        isUpdating={isUpdatingListing}
      />

      <ListingDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setListingToDelete(null);
        }}
        listing={listingToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      <ListingVisibilityDialog
        isOpen={isVisibilityDialogOpen}
        onClose={() => {
          setIsVisibilityDialogOpen(false);
          setListingToToggle(null);
        }}
        listing={listingToToggle}
        onConfirmToggle={handleConfirmToggleVisibility}
      />

    </>
  );
}
