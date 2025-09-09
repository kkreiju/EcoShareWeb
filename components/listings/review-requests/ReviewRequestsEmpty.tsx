"use client";

import { MessageSquare } from "lucide-react";

export function ReviewRequestsEmpty() {
  return (
    <div className="text-center py-12">
      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
        No Review Requests
      </h3>
      <p className="text-sm text-muted-foreground">
        You don't have any review requests at the moment.
      </p>
    </div>
  );
}
