"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  User,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ReportedUser {
  report_id: string;
  reported_user_id: string;
  reported_user_email: string;
  reported_user_name: string;
  reporter_id: string;
  reporter_email: string;
  reporter_name: string;
  reason: string;
  description: string;
  report_date: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  type: "user";
}

interface ReportedListing {
  report_id: string;
  reported_listing_id: string;
  reported_listing_title: string;
  reported_listing_type: string;
  reported_owner_id: string;
  reported_owner_name: string;
  reporter_id: string;
  reporter_email: string;
  reporter_name: string;
  reason: string;
  description: string;
  report_date: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  type: "listing";
}

type Report = ReportedUser | ReportedListing;

interface AdminReportsTableProps {
  reports: Report[];
  onStatusChange: (reportId: string, status: Report["status"]) => void;
}

export function AdminReportsTable({
  reports,
  onStatusChange,
}: AdminReportsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "dismissed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReportTypeIcon = (type: string) => {
    return type === "user" ? (
      <User className="h-4 w-4 text-blue-600" />
    ) : (
      <Package className="h-4 w-4 text-green-600" />
    );
  };

  const getReportTypeColor = (type: string) => {
    return type === "user"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reported Content</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow
              key={report.report_id}
              className="border-border hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center justify-center">
                  {getReportTypeIcon(report.type)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getReportTypeColor(report.type)}
                >
                  {report.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {report.type === "user"
                      ? report.reported_user_name
                      : report.reported_listing_title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {report.type === "user"
                      ? report.reported_user_email
                      : `${report.reported_listing_type} • ${report.reported_owner_name}`}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(report.reporter_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">
                      {report.reporter_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {report.reporter_email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{report.reason}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {report.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(report.status)}
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm text-muted-foreground">
                  {formatDate(report.report_date)}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(report.report_id, "investigating")
                      }
                      disabled={report.status === "investigating"}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Investigate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(report.report_id, "resolved")
                      }
                      disabled={report.status === "resolved"}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(report.report_id, "dismissed")
                      }
                      disabled={report.status === "dismissed"}
                      className="text-gray-600 focus:text-gray-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Dismiss
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
