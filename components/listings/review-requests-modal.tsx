"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import {
  ReviewRequestsSection,
  ReviewRequestsEmpty
} from "./review-requests";

interface ReviewRequest {
  id: string;
  requesterName: string;
  requesterAvatar?: string;
  title: string;
  type: "free" | "sale" | "wanted";
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
}

interface ReviewRequestsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for review requests
const mockReviewRequests: ReviewRequest[] = [
  {
    id: "1",
    requesterName: "Sarah Johnson",
    requesterAvatar: "/images/img_avatar1.png",
    title: "Vintage Coffee Maker",
    type: "sale",
    message: "Hi! I'm interested in your vintage coffee maker. Is it still available? I've been looking for something similar for my cafe.",
    timestamp: "2 hours ago",
    status: "pending"
  },
  {
    id: "2",
    requesterName: "Mike Chen",
    requesterAvatar: "/images/img_avatar2.png",
    title: "Used Books Collection",
    type: "free",
    message: "Hello! I saw your collection of used books. I'm a teacher and would love to use them in my classroom. Can I pick them up?",
    timestamp: "4 hours ago",
    status: "pending"
  },
  {
    id: "3",
    requesterName: "Emma Davis",
    requesterAvatar: "/images/img_avatar3.png",
    title: "Bicycle Repair Service",
    type: "wanted",
    message: "Hi there! I noticed you're looking for bicycle repair services. I have 15+ years of experience and would love to help with your bike maintenance needs.",
    timestamp: "1 day ago",
    status: "pending"
  },
  {
    id: "4",
    requesterName: "Alex Rodriguez",
    title: "Composting Materials",
    type: "free",
    message: "Hello! I'm starting a community garden and would greatly appreciate any composting materials you might have available. Thank you!",
    timestamp: "2 days ago",
    status: "pending"
  }
];


export function ReviewRequestsModal({ isOpen, onOpenChange }: ReviewRequestsModalProps) {
  const [requests, setRequests] = useState<ReviewRequest[]>(mockReviewRequests);

  const handleAccept = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: "accepted" as const } : req
      )
    );
    // TODO: Implement actual accept logic
    console.log("Accepted request:", requestId);
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: "declined" as const } : req
      )
    );
    // TODO: Implement actual decline logic
    console.log("Declined request:", requestId);
  };

  const pendingRequests = requests.filter(req => req.status === "pending");
  const completedRequests = requests.filter(req => req.status !== "pending");

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
          {requests.length === 0 ? (
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
