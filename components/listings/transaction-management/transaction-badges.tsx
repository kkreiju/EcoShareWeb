"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  DollarSign,
} from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "accepted":
    case "active":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
    case "ongoing":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
    case "cancelled":
    case "declined":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "accepted":
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "ongoing":
      return <Package className="h-4 w-4 text-blue-600" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "cancelled":
    case "declined":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

export const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "free":
      return <Package className="h-4 w-4 text-white" />;
    case "wanted":
      return <Package className="h-4 w-4 text-white" />;
    case "sale":
      return <DollarSign className="h-4 w-4 text-white" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

export const getTypeColor = (type: string) => {
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

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} shadow-sm font-medium`}
    >
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${getTypeColor(type)} shadow-sm font-medium`}
    >
      <span className="capitalize">{type}</span>
    </Badge>
  );
}
