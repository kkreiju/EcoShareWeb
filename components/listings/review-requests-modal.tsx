"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ReviewRequestsSection, ReviewRequestsEmpty } from "./review-requests";

interface ReviewRequest {
  id: string;
  userName: string;
  userAvatar?: string;
  listingTitle: string;
  listingType: string;
  requestDate: string;
  message: string;
  status: "Pending" | "Accepted" | "Declined";
}

interface ReviewRequestsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestsUpdate?: () => void;
}

export function ReviewRequestsModal({
  isOpen,
  onOpenChange,
  onRequestsUpdate,
}: ReviewRequestsModalProps) {
  const { userId, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Map<string, 'accept' | 'decline'>>(new Map());

  // Fetch review requests when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      fetchReviewRequests();
    }
  }, [isOpen, isAuthenticated, userId]);

  // Call onRequestsUpdate when modal closes
  useEffect(() => {
    if (!isOpen && onRequestsUpdate) {
      onRequestsUpdate();
    }
  }, [isOpen, onRequestsUpdate]);

  const fetchReviewRequests = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/transaction/review-requests?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Transform API response to match our interface
        const transformedRequests = data.requests.map((req: any) => ({
          id: req.id,
          userName: req.userName,
          userAvatar: req.userAvatar,
          listingTitle: req.listingTitle,
          listingType: req.listingType.toLowerCase(),
          requestDate: req.requestDate,
          message: req.message,
          status: req.status,
        }));

        setRequests(transformedRequests);
        // Update the badge count on the main page
        if (onRequestsUpdate) {
          onRequestsUpdate();
        }
      } else {
        throw new Error(data.message || "Failed to fetch review requests");
      }
    } catch (err) {
      console.error("Error fetching review requests:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load review requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    if (!userId) return;

    // Find the request to get listing title
    const request = requests.find((req) => req.id === requestId);
    if (!request) {
      toast.error("Request not found", {
        description: "Unable to find the request details.",
        duration: 4000,
      });
      return;
    }

    // Add to processing map
    setProcessingRequests(prev => new Map(prev).set(requestId, 'accept'));

    try {
      const response = await fetch("/api/transaction/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          listingTitle: request.listingTitle,
          message: `Great! I've accepted your request for "${request.listingTitle}". Please let me know when you'd like to arrange pickup.`,
          user_id: userId,
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

      const data = await response.json();

      if (data.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "Accepted" as const } : req
          )
        );

        toast.success("Request accepted successfully!", {
          description:
            "A conversation has been created and the user has been notified.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      // Remove from processing map
      setProcessingRequests(prev => {
        const newMap = new Map(prev);
        newMap.delete(requestId);
        return newMap;
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    // Add to processing map
    setProcessingRequests(prev => new Map(prev).set(requestId, 'decline'));

    try {
      const response = await fetch("/api/transaction/decline-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: requestId,
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

      const data = await response.json();

      if (data.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "Declined" as const } : req
          )
        );

        toast.success("Request declined", {
          description:
            "The transaction has been declined and the user has been notified.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || "Failed to decline request");
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error("Failed to decline request", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        duration: 4000,
      });
    } finally {
      // Remove from processing map
      setProcessingRequests(prev => {
        const newMap = new Map(prev);
        newMap.delete(requestId);
        return newMap;
      });
    }
  };

  const pendingRequests = requests.filter((req) => req.status === "Pending");
  const completedRequests = requests.filter((req) => req.status !== "Pending");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-green">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
            Review Requests
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground flex items-center justify-between">
            <span>Manage requests from users interested in your listings</span>
            <button
              onClick={fetchReviewRequests}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Loading review requests...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error Loading Requests
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchReviewRequests}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <ReviewRequestsEmpty />
          ) : (
            <ReviewRequestsSection
              pendingRequests={pendingRequests}
              completedRequests={completedRequests}
              onAccept={handleAccept}
              onDecline={handleDecline}
              processingRequests={processingRequests}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
