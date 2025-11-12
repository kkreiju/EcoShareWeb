"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, AlertCircle } from "lucide-react";
import { AdminUsersTable } from "./admin-users-table";
import { AdminUsersSkeleton } from "./loading-skeleton";
import {
  getAdminId,
  getUsers,
  manageUser,
  mapMembershipStatusToUserStatus,
  getActionForStatusChange,
  type BackendUser,
} from "@/lib/services/adminService";
import { toast } from "sonner";

interface User {
  user_id: string;
  user_email: string;
  firstName: string;
  lastName: string;
  user_profileURL?: string;
  user_createdAt: string;
  user_status: "active" | "inactive" | "suspended";
  user_membershipStatus: string; // Keep original for status changes
}

// Map backend user to frontend user
function mapBackendUserToFrontend(user: BackendUser): User {
  return {
    user_id: user.user_id,
    user_email: user.user_email,
    firstName: user.user_firstName || "",
    lastName: user.user_lastName || "",
    user_profileURL: user.user_profileURL || undefined,
    user_createdAt: (user as any).created_at || (user as any).user_createdAt || new Date().toISOString(),
    user_status: mapMembershipStatusToUserStatus(user.user_membershipStatus),
    user_membershipStatus: user.user_membershipStatus, // Keep original
  };
}

export function AdminUsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get admin ID
      const adminId = await getAdminId();
      if (!adminId) {
        throw new Error("Admin access required. Please log in as an admin.");
      }

      // Fetch users from API
      const response = await getUsers(adminId);

      // Map backend users to frontend format
      const mappedUsers = (response.users || []).map(mapBackendUserToFrontend);

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load users";
      setError(errorMessage);
      toast.error("Failed to load users", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: User["user_status"]
  ) => {
    try {
      // Get admin ID
      const adminId = await getAdminId();
      if (!adminId) {
        throw new Error("Admin access required.");
      }

      // Find the user to get current membership status
      const user = users.find((u) => u.user_id === userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Determine the action based on current status and desired status
      const action = getActionForStatusChange(user.user_membershipStatus, newStatus);
      if (!action) {
        throw new Error("Invalid status change");
      }

      // Call API to manage user
      await manageUser(adminId, userId, action);

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId
            ? {
                ...u,
                user_status: newStatus,
                // Update membership status based on action
                user_membershipStatus:
                  newStatus === "suspended"
                    ? "Suspend"
                    : newStatus === "active"
                    ? action === "ActivatePremium"
                      ? "Premium"
                      : "Free"
                    : u.user_membershipStatus, // Keep current if inactive
              }
            : u
        )
      );

      toast.success("User status updated", {
        description: `User ${user.firstName} ${user.lastName} has been ${newStatus}.`,
      });
    } catch (err) {
      console.error("Error updating user status:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update user status";
      setError(errorMessage);
      toast.error("Failed to update user status", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage and monitor user accounts across the platform
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
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading
                    ? "..."
                    : users.filter((u) => u.user_status === "active").length}
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
                  Inactive Users
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isLoading
                    ? "..."
                    : users.filter((u) => u.user_status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Suspended Users
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading
                    ? "..."
                    : users.filter((u) => u.user_status === "suspended").length}
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

      {/* Users Table */}
      {isLoading ? (
        <AdminUsersSkeleton />
      ) : (
        <AdminUsersTable users={users} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
