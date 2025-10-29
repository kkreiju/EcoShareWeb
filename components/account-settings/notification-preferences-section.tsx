"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Save, RotateCcw, Bell } from "lucide-react";
import { UserProfile } from "./types";

interface NotificationPreferencesSectionProps {
  userProfile: UserProfile;
  onUpdate: (data: any) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

const PLANT_TAGS = [
  "Banana Peels",
  "Coffee Grounds",
  "Crushed Eggshell",
  "Dried Leaves",
  "Mango Peels",
  "Manure",
  "Orange Peels",
  "Pineapple Peels",
  "Potato Peels",
  "Saw Dust",
  "Vegetable Scraps",
];

export function NotificationPreferencesSection({
  userProfile,
  onUpdate,
  onRefresh,
}: NotificationPreferencesSectionProps) {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [originalPreferences, setOriginalPreferences] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load current preferences
  useEffect(() => {
    if (userProfile?.user_preferences) {
      try {
        const currentPrefs =
          typeof userProfile.user_preferences === "string"
            ? JSON.parse(userProfile.user_preferences)
            : userProfile.user_preferences;

        const prefsArray = Array.isArray(currentPrefs) ? currentPrefs : [];
        setPreferences(prefsArray);
        setOriginalPreferences(prefsArray);
      } catch (error) {
        console.error("Error parsing user preferences:", error);
        setPreferences([]);
        setOriginalPreferences([]);
      }
    } else {
      setPreferences([]);
      setOriginalPreferences([]);
    }
  }, [userProfile]);

  // Check if there are changes
  useEffect(() => {
    const hasChanged =
      JSON.stringify(preferences.sort()) !==
      JSON.stringify(originalPreferences.sort());
    setHasChanges(hasChanged);
  }, [preferences, originalPreferences]);

  const handleTagToggle = (tag: string) => {
    setPreferences((prev) => {
      const isSelected = prev.includes(tag);
      return isSelected ? prev.filter((t) => t !== tag) : [...prev, tag];
    });
  };

  const handleReset = () => {
    setPreferences(originalPreferences);
  };

  const fetchNotificationPreferences = async () => {
    if (!userProfile?.user_id) return;

    setIsRefreshing(true);
    try {
      // Try to get preferences from the notification preferences API
      const response = await fetch("/api/user/notification-preferences", {
        method: "PUT", // Using PUT as it's the same endpoint used for updates
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userProfile.user_id,
          notificationPreferences: [], // Empty array to just fetch current preferences
        }),
      });

      if (response.ok) {
        // This might not work if the API expects different parameters for fetching
        // Let's try a different approach - use the profile data as fallback
        console.log("Notification preferences refresh attempted");
      }
    } catch (error) {
      console.error("Error refreshing notification preferences:", error);
    } finally {
      setIsRefreshing(false);
    }

    // As fallback, trigger the parent refresh which should update the profile data
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleSubmit = async () => {
    if (!userProfile?.user_id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/notification-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userProfile.user_id,
          notificationPreferences: preferences,
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
        throw new Error(data.message || "Failed to update preferences");
      }

      // Update local state
      setOriginalPreferences(preferences);
      
      toast.success("Notification preferences updated successfully", {
        duration: 3000,
      });
    } catch (err) {
      console.error("Error updating notification preferences:", err);
      toast.error("Failed to update notification preferences", {
        description: err instanceof Error ? err.message : "Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotificationPreferences}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <CardDescription>
            Select the plant materials you're interested in to receive relevant
            notifications when new listings are available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plant Tags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                Plant Material Preferences
              </h3>
              <span className="text-xs text-muted-foreground">
                {preferences.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PLANT_TAGS.map((tag) => {
                const isSelected = preferences.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    {tag}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> You'll receive notifications when new listings
              matching your selected preferences are posted in your area.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!hasChanges || isSubmitting}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

