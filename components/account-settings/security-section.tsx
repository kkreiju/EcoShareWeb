"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { UserProfile } from "./types";

interface SecuritySectionProps {
  userProfile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

export function SecuritySection({
  userProfile,
  onUpdate,
}: SecuritySectionProps) {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordError(null);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/\d/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("one special character");

    return errors.length === 0
      ? null
      : `Password must contain ${errors.join(", ")}.`;
  };

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (!userProfile?.user_id) {
      setPasswordError("User ID is required");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      // Use the API endpoint to change password
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: userProfile.user_id,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to update password";

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If not JSON, use the text as error message
          errorMessage = errorText || errorMessage;
        }

        // Handle specific error cases
        if (
          errorMessage.toLowerCase().includes("invalid old password") ||
          errorMessage.toLowerCase().includes("incorrect password") ||
          errorMessage.toLowerCase().includes("wrong password")
        ) {
          setPasswordError("Current password is incorrect");
          return;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update password");
      }

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";

      // Don't show toast for password validation errors, just set the form error
      if (
        errorMessage.toLowerCase().includes("invalid old password") ||
        errorMessage.toLowerCase().includes("incorrect password") ||
        errorMessage.toLowerCase().includes("wrong password")
      ) {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError(errorMessage);
        toast.error("Failed to update password", {
          description: errorMessage,
          duration: 4000,
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2)
      return {
        level: "Weak",
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-950",
      };
    if (strength <= 3)
      return {
        level: "Fair",
        color: "text-yellow-500",
        bg: "bg-yellow-100 dark:bg-yellow-950",
      };
    if (strength <= 4)
      return {
        level: "Good",
        color: "text-blue-500",
        bg: "bg-blue-100 dark:bg-blue-950",
      };
    return {
      level: "Strong",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-950",
    };
  };

  const passwordStrength = passwordData.newPassword
    ? getPasswordStrength(passwordData.newPassword)
    : null;

  return (
    <div className="space-y-6">
      {/* Password Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Password Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-700 rounded-full dark:bg-green-950 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Password Protection</p>
                <p className="text-sm text-muted-foreground">
                  Your account is secured with a password
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              Active
            </Badge>
          </div>

          <Separator />

          {/* Change Password Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordStrength && (
                  <div
                    className={`text-sm px-3 py-2 rounded-md ${passwordStrength.bg}`}
                  >
                    <span className={passwordStrength.color}>
                      Password Strength: {passwordStrength.level}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {passwordError && (
                <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleUpdatePassword}
                  disabled={
                    isChangingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg dark:bg-blue-950/20">
              <div className="p-1 bg-blue-100 text-blue-700 rounded dark:bg-blue-950 dark:text-blue-300">
                <Shield className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Use a Strong Password
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Include a mix of uppercase, lowercase, numbers, and special
                  characters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg dark:bg-green-950/20">
              <div className="p-1 bg-green-100 text-green-700 rounded dark:bg-green-950 dark:text-green-300">
                <Lock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-green-900 dark:text-green-100">
                  Keep Your Password Private
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Never share your password with anyone or store it in unsecured
                  locations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg dark:bg-yellow-950/20">
              <div className="p-1 bg-yellow-100 text-yellow-700 rounded dark:bg-yellow-950 dark:text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                  Regular Updates
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Consider updating your password regularly for enhanced
                  security.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
