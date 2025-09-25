"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  ReviewRequestsSection,
  ReviewRequestsEmpty
} from "./review-requests";

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
}

export function ReviewRequestsModal({ isOpen, onOpenChange }: ReviewRequestsModalProps) {
  const { userId, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch review requests when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      fetchReviewRequests();
    }
  }, [isOpen, isAuthenticated, userId]);

  const fetchReviewRequests = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transaction/review-requests?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

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
          status: req.status
        }));

        setRequests(transformedRequests);
      } else {
        throw new Error(data.message || 'Failed to fetch review requests');
      }
    } catch (err) {
      console.error('Error fetching review requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load review requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/transaction/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          user_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: "Accepted" as const } : req
          )
        );

        toast.success("Request accepted successfully!", {
          description: "The user has been notified of your acceptance.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request", {
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        duration: 4000,
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/transaction/decline-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          user_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setRequests(prev =>
          prev.map(req =>
            req.id === requestId ? { ...req, status: "Declined" as const } : req
          )
        );

        toast.success("Request declined", {
          description: "The user has been notified.",
          duration: 4000,
        });
      } else {
        throw new Error(data.message || 'Failed to decline request');
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error("Failed to decline request", {
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        duration: 4000,
      });
    }
  };

  const pendingRequests = requests.filter(req => req.status === "Pending");
  const completedRequests = requests.filter(req => req.status !== "Pending");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-green">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
            Review Requests
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Manage requests from users interested in your listings
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading review requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Requests</h3>
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
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
