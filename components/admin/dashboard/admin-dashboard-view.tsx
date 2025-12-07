"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Flag,
  AlertCircle,
  TrendingUp,
  Activity,
  User,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { getAdminId, getReports, type BackendReport } from "@/lib/services/adminService";
import { toast } from "sonner";

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
}

interface RecentReport {
  report_id: string;
  type: "user" | "listing";
  reason: string;
  reported_content: string;
  report_date: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
}

// Map backend report status to frontend status
function mapReportStatus(status: string): "pending" | "investigating" | "resolved" | "dismissed" {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("pending")) return "pending";
  if (statusLower.includes("investigat")) return "investigating";
  if (statusLower.includes("resolve")) return "resolved";
  if (statusLower.includes("dismiss")) return "dismissed";
  return "pending"; // default
}

// Map backend report to frontend RecentReport
function mapBackendReportToFrontend(report: BackendReport): RecentReport {
  // Determine report type based on available fields
  const hasListId = report.list_id || report.reported_listing_id;
  const type: "user" | "listing" = hasListId ? "listing" : "user";

  // Extract reason from report_description or rep_reason
  const reason = report.rep_reason || report.report_description || "No reason provided";

  // Extract reported content
  const reported_content = report.reported_user_id || report.list_id || report.report_id || "Unknown";


  // Extract date
  const report_date = report.report_date || report.created_at || new Date().toISOString();

  // Map status
  const status = mapReportStatus(report.rep_status || report.report_status || "Pending");

  return {
    report_id: report.report_id,
    type,
    reason,
    reported_content,
    report_date,
    status,
  };
}

export function AdminDashboardView() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get admin ID
      const adminId = await getAdminId();
      if (!adminId) {
        throw new Error("Admin access required. Please log in as an admin.");
      }

      // Fetch reports from API
      const response = await getReports(adminId);

      // Calculate stats
      const allReports = response.reports || [];
      const pendingReports = allReports.filter(
        (r) => mapReportStatus(r.rep_status || r.report_status || "Pending") === "pending"
      );
      const resolvedReports = allReports.filter(
        (r) => mapReportStatus(r.rep_status || r.report_status || "Pending") === "resolved"
      );

      setStats({
        totalReports: allReports.length,
        pendingReports: pendingReports.length,
        resolvedReports: resolvedReports.length,
      });

      // Map and sort reports (most recent first), limit to 10
      const mappedReports = allReports
        .map(mapBackendReportToFrontend)
        .sort((a, b) => new Date(b.report_date).getTime() - new Date(a.report_date).getTime())
        .slice(0, 10);

      setRecentReports(mappedReports);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(errorMessage);
      toast.error("Failed to load dashboard", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Overview of platform activity and recent reports
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {isLoading ? "..." : stats.totalReports}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Reports
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isLoading ? "..." : stats.pendingReports}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Resolved Reports
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : stats.resolvedReports}
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

      {/* Recent Reports */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse w-20" />
                </div>
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent reports</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.report_id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getReportTypeIcon(report.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={getReportTypeColor(report.type)}
                          >
                            {report.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-1">
                          {report.reason}
                        </h4>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(report.status)}
                        >
                          {report.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(report.report_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const getReportTypeColor = (type: string) => {
  return type === "user"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-green-100 text-green-800 border-green-200";
};
