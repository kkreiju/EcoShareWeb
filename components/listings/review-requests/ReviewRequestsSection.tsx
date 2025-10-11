"use client";

import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, CheckCircle } from "lucide-react";
import { ReviewRequestCard } from "./ReviewRequestCard";

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

interface ReviewRequestsSectionProps {
  pendingRequests: ReviewRequest[];
  completedRequests: ReviewRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  processingRequests: Map<string, 'accept' | 'decline'>;
}

export function ReviewRequestsSection({
  pendingRequests,
  completedRequests,
  onAccept,
  onDecline,
  processingRequests
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
                processingAction={processingRequests.get(request.id)}
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="completed" className="border-none">
            <AccordionTrigger className="py-2 px-0 hover:no-underline">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">
                  Completed Requests ({completedRequests.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="space-y-2 opacity-75 max-w-2xl mx-auto">
                {completedRequests.map((request) => (
                  <ReviewRequestCard
                    key={request.id}
                    request={request}
                    onAccept={onAccept}
                    onDecline={onDecline}
                    showActions={false}
                    processingAction={processingRequests.get(request.id)}
                    compact={true}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
