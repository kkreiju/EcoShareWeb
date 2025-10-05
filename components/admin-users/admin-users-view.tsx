"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, AlertCircle } from "lucide-react";
import { AdminUsersTable } from "./admin-users-table";
import { AdminUsersSkeleton } from "./loading-skeleton";

interface User {
  user_id: string;
  user_email: string;
  firstName: string;
  lastName: string;
  user_profileURL?: string;
  user_createdAt: string;
  user_status: "active" | "inactive" | "suspended";
}

export function AdminUsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();

      // Mock data for now
      const mockUsers: User[] = [
        {
          user_id: "1",
          user_email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          user_profileURL: "/avatars/john.jpg",
          user_createdAt: "2024-01-15T10:30:00Z",
          user_status: "active",
        },
        {
          user_id: "2",
          user_email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          user_createdAt: "2024-01-20T14:15:00Z",
          user_status: "active",
        },
        {
          user_id: "3",
          user_email: "bob.johnson@example.com",
          firstName: "Bob",
          lastName: "Johnson",
          user_createdAt: "2024-01-25T09:45:00Z",
          user_status: "inactive",
        },
        {
          user_id: "4",
          user_email: "alice.brown@example.com",
          firstName: "Alice",
          lastName: "Brown",
          user_createdAt: "2024-01-30T16:20:00Z",
          user_status: "suspended",
        },
      ];

      setUsers(mockUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
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
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/users/${userId}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId ? { ...user, user_status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
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
