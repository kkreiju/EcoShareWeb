"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, User } from "lucide-react";

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

interface ReviewRequestCardProps {
  request: ReviewRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  showActions?: boolean;
  processingAction?: 'accept' | 'decline';
  compact?: boolean;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "free":
      return "bg-green-500 text-white border-green-500 dark:bg-green-600 dark:text-white dark:border-green-600";
    case "wanted":
      return "bg-yellow-500 text-white border-yellow-500 dark:bg-yellow-600 dark:text-white dark:border-yellow-600";
    case "sale":
      return "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function ReviewRequestCard({ request, onAccept, onDecline, showActions = true, processingAction, compact = false }: ReviewRequestCardProps) {
  const getStatusColor = () => {
    if (request.status === "Accepted") return "bg-green-600";
    if (request.status === "Declined") return "bg-gray-500";
    return "bg-orange-500";
  };

  const getStatusText = () => {
    if (request.status === "Accepted") return "Accepted";
    if (request.status === "Declined") return "Declined";
    return "Pending";
  };

  return (
    <Card className={`${request.status === "Pending" ? "border-l-4 border-l-primary/50" : "border-muted"} ${compact ? "p-3" : ""}`}>
      <CardHeader className={compact ? "pb-2 px-3" : ""}>
        <div className={`flex justify-between gap-3 ${compact ? "items-center" : "items-start"}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className={`flex-shrink-0 ${compact ? "h-8 w-8" : "h-10 w-10"}`}>
              <AvatarImage src={request.userAvatar} />
              <AvatarFallback className="bg-primary/10">
                <User className={`h-3 w-3 ${compact ? "" : "h-4 w-4"}`} />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`font-semibold truncate ${compact ? "text-xs" : "text-sm sm:text-base"}`}>
                  {request.userName}
                </h4>
                <Badge
                  variant={request.status === "Pending" ? "secondary" : request.status === "Accepted" ? "default" : "secondary"}
                  className={`${compact ? "text-[10px] px-1 py-0" : "text-xs"} ${request.status !== "Pending" ? getStatusColor() : ""}`}
                >
                  {getStatusText()}
                </Badge>
              </div>
              <p className={`text-muted-foreground mt-1 ${compact ? "text-[10px]" : "text-xs"}`}>
                {new Date(request.requestDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={compact ? "pt-0 px-3" : "space-y-4"}>
        <div className="flex items-center gap-2 flex-wrap">
          <h5 className={`font-medium flex-1 min-w-0 truncate ${compact ? "text-xs" : "text-sm sm:text-base"}`}>
            {request.listingTitle}
          </h5>
          <Badge
            variant="outline"
            className={`${compact ? "text-[10px] px-1 py-0" : "text-xs"} ${getTypeColor(request.listingType)}`}
          >
            {request.listingType.charAt(0).toUpperCase() + request.listingType.slice(1)}
          </Badge>
        </div>

        {!compact && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {request.message}
          </p>
        )}

        {showActions && request.status === "Pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onAccept(request.id)}
              size="sm"
              disabled={processingAction === 'accept'}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingAction === 'accept' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </>
              )}
            </Button>
            <Button
              onClick={() => onDecline(request.id)}
              size="sm"
              disabled={processingAction === 'decline'}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingAction === 'decline' ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
