"use client";

import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { ReviewRequestCard } from "./ReviewRequestCard";

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

interface ReviewRequestsSectionProps {
  pendingRequests: ReviewRequest[];
  completedRequests: ReviewRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function ReviewRequestsSection({
  pendingRequests,
  completedRequests,
  onAccept,
  onDecline
}: ReviewRequestsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <ReviewRequestCard
                key={request.id}
                request={request}
                onAccept={onAccept}
                onDecline={onDecline}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Separator if both sections exist */}
      {pendingRequests.length > 0 && completedRequests.length > 0 && (
        <Separator className="my-6" />
      )}

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Completed Requests ({completedRequests.length})
          </h3>
          <div className="space-y-4 opacity-75">
            {completedRequests.map((request) => (
              <ReviewRequestCard
                key={request.id}
                request={request}
                onAccept={onAccept}
                onDecline={onDecline}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
