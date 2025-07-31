"use client";

import { Check, CheckCheck, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface MessageStatusIconProps {
  status: MessageStatus;
  className?: string;
}

export function MessageStatusIcon({ status, className }: MessageStatusIconProps) {
  const iconProps = {
    className: cn("h-3 w-3", className),
  };

  switch (status) {
    case "sending":
      return <Clock {...iconProps} className={cn(iconProps.className, "text-muted-foreground animate-pulse")} />;
    case "sent":
      return <Check {...iconProps} className={cn(iconProps.className, "text-muted-foreground")} />;
    case "delivered":
      return <CheckCheck {...iconProps} className={cn(iconProps.className, "text-muted-foreground")} />;
    case "read":
      return <CheckCheck {...iconProps} className={cn(iconProps.className, "text-blue-500")} />;
    case "failed":
      return <X {...iconProps} className={cn(iconProps.className, "text-destructive")} />;
    default:
      return null;
  }
}

interface MessageStatusTextProps {
  status: MessageStatus;
  timestamp?: Date;
}

export function MessageStatusText({ status, timestamp }: MessageStatusTextProps) {
  const getStatusText = () => {
    switch (status) {
      case "sending":
        return "Sending...";
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return "Read";
      case "failed":
        return "Failed to send";
      default:
        return "";
    }
  };

  return (
    <span className={cn(
      "text-xs",
      status === "failed" ? "text-destructive" : "text-muted-foreground"
    )}>
      {getStatusText()}
      {timestamp && ` • ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
    </span>
  );
}
