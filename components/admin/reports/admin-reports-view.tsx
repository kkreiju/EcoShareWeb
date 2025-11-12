"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Flag, Users, Package, AlertCircle } from "lucide-react";
import { AdminReportsTable } from "./admin-reports-table";
import { AdminReportsSkeleton } from "./loading-skeleton";

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

export function AdminReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NOTE: Currently using mock data. Replace with actual API call when backend is ready:
      // const response = await fetch('/api/admin/reports');
      // const data = await response.json();

      // Mock data for now
      const mockReports: Report[] = [
        {
          report_id: "1",
          reported_user_id: "user_123",
          reported_user_email: "spam@example.com",
          reported_user_name: "Spam User",
          reporter_id: "reporter_456",
          reporter_email: "gooduser@example.com",
          reporter_name: "Good User",
          reason: "Spam",
          description: "This user is sending spam messages",
          report_date: "2024-01-15T10:30:00Z",
          status: "pending",
          type: "user",
        },
        {
          report_id: "2",
          reported_listing_id: "listing_789",
          reported_listing_title: "Fake iPhone for Sale",
          reported_listing_type: "sale",
          reported_owner_id: "owner_101",
          reported_owner_name: "Scammer",
          reporter_id: "reporter_202",
          reporter_email: "victim@example.com",
          reporter_name: "Victim User",
          reason: "Fraud",
          description: "This listing appears to be fraudulent",
          report_date: "2024-01-16T14:20:00Z",
          status: "investigating",
          type: "listing",
        },
        {
          report_id: "3",
          reported_user_id: "user_345",
          reported_user_email: "harass@example.com",
          reported_user_name: "Harasser",
          reporter_id: "reporter_678",
          reporter_email: "harassed@example.com",
          reporter_name: "Harassed User",
          reason: "Harassment",
          description: "This user is harassing other users",
          report_date: "2024-01-17T09:15:00Z",
          status: "resolved",
          type: "user",
        },
      ];

      setReports(mockReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    fetchReports();
  };

  const handleStatusChange = async (
    reportId: string,
    newStatus: Report["status"]
  ) => {
    try {
      // NOTE: Currently updating local state only. Replace with actual API call when backend is ready:
      // await fetch(`/api/admin/reports/${reportId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Update local state
      setReports((prev) =>
        prev.map((report) =>
          report.report_id === reportId
            ? { ...report, status: newStatus }
            : report
        )
      );
    } catch (err) {
      console.error("Error updating report status:", err);
      setError("Failed to update report status");
    }
  };

  const userReports = reports.filter((r) => r.type === "user");
  const listingReports = reports.filter((r) => r.type === "listing");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Reports Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Review and manage reported users and listings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-border w-full sm:w-auto justify-center sm:justify-start"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 flex-shrink-0 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span className="truncate">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? "..." : reports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User Reports
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isLoading ? "..." : userReports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Listing Reports
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? "..." : listingReports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {isLoading
                    ? "..."
                    : reports.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex-1">{error}</span>
            <Button
              variant="link"
              size="sm"
              onClick={handleRefresh}
              className="p-0 h-auto hover:text-destructive self-start sm:self-center"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Reports Table */}
      {isLoading ? (
        <AdminReportsSkeleton />
      ) : (
        <AdminReportsTable
          reports={reports}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
