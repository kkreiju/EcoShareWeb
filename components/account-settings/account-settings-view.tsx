"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AccountSettingsHeader } from "./account-settings-header";
import { ProfileSection } from "./profile-section";
import { SecuritySection } from "./security-section";
import { AccountSettingsSkeleton } from "./loading-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";
import { UserProfile } from "./types";

export function AccountSettingsView() {
  const { user, userId, isAuthenticated, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("profile");

  // Fetch user profile data
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserProfile();
    }
  }, [isAuthenticated, userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/view-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUserProfile(data.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: any) => {
    if (!userProfile || !user?.email) return;

    try {
      // Map the form data to match the API specification
      const updateData = {
        user_id: userProfile.user_id,
        email: updatedData.user_email || user.email,
        contactNumber: updatedData.user_phoneNumber || "",
        firstName: updatedData.user_firstName || "",
        middleName: updatedData.user_middleName || "",
        lastName: updatedData.user_lastName || "",
        bio: updatedData.user_bio || "",
        // Only include profileURL if it's changed and not empty
        ...(updatedData.user_profileURL &&
        updatedData.user_profileURL !== userProfile.user_profileURL
          ? { profileURL: updatedData.user_profileURL }
          : {}),
      };

      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local state with the response data
      if (data.data) {
        setUserProfile(data.data);
      }

      toast.success("Profile updated successfully", {
        duration: 3000,
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile", {
        description: err instanceof Error ? err.message : "Please try again.",
        duration: 4000,
      });
      throw err; // Re-throw to handle in component
    }
  };

  const handleRefresh = () => {
    fetchUserProfile();
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return <AccountSettingsSkeleton activeSection={activeSection} />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to access account settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Always shown */}
      <AccountSettingsHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

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

      {/* Content */}
      {isLoading ? (
        <AccountSettingsSkeleton activeSection={activeSection} />
      ) : userProfile ? (
        <div className="space-y-6">
          {activeSection === "profile" && (
            <ProfileSection
              userProfile={userProfile}
              onUpdate={handleProfileUpdate}
            />
          )}

          {activeSection === "security" && (
            <SecuritySection
              userProfile={userProfile}
              onUpdate={handleProfileUpdate}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Profile not found</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
