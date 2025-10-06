"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Upload, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { UserProfile } from "./types";

interface ProfileSectionProps {
  userProfile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

export function ProfileSection({ userProfile, onUpdate }: ProfileSectionProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    user_firstName: userProfile.user_firstName || "",
    user_middleName: userProfile.user_middleName || "",
    user_lastName: userProfile.user_lastName || "",
    user_email: user?.email || "",
    user_phoneNumber: userProfile.user_phoneNumber || "",
    user_bio: userProfile.user_bio || "",
  });

  // Update form data when userProfile changes
  useEffect(() => {
    setFormData({
      user_firstName: userProfile.user_firstName || "",
      user_middleName: userProfile.user_middleName || "",
      user_lastName: userProfile.user_lastName || "",
      user_email: user?.email || "",
      user_phoneNumber: userProfile.user_phoneNumber || "",
      user_bio: userProfile.user_bio || "",
    });
  }, [userProfile, user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.user_firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.user_lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    setSaving(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      user_firstName: userProfile.user_firstName || "",
      user_middleName: userProfile.user_middleName || "",
      user_lastName: userProfile.user_lastName || "",
      user_email: user?.email || "",
      user_phoneNumber: userProfile.user_phoneNumber || "",
      user_bio: userProfile.user_bio || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    !formData.user_firstName.trim() ||
                    !formData.user_lastName.trim()
                  }
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.user_profileURL} />
              <AvatarFallback className="text-lg bg-muted">
                {formData.user_firstName?.[0]}
                {formData.user_lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-lg font-semibold">
                {formData.user_firstName}{" "}
                {formData.user_middleName && `${formData.user_middleName} `}
                {formData.user_lastName}
              </h3>
              <div className="flex flex-col items-center sm:items-start gap-1 text-sm text-muted-foreground">
                <span>{formData.user_email}</span>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <Input
                  id="user_firstName"
                  value={formData.user_firstName}
                  onChange={(e) =>
                    handleInputChange("user_firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  required
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm">
                  {formData.user_firstName || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_middleName">Middle Name</Label>
              {isEditing ? (
                <Input
                  id="user_middleName"
                  value={formData.user_middleName}
                  onChange={(e) =>
                    handleInputChange("user_middleName", e.target.value)
                  }
                  placeholder="Enter your middle name (optional)"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm">
                  {formData.user_middleName || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <Input
                  id="user_lastName"
                  value={formData.user_lastName}
                  onChange={(e) =>
                    handleInputChange("user_lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  required
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm">
                  {formData.user_lastName || "Not provided"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email">Email Address</Label>
              <div className="p-3 bg-muted rounded-md text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {formData.user_email || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="user_phoneNumber"
                  value={formData.user_phoneNumber}
                  onChange={(e) =>
                    handleInputChange("user_phoneNumber", e.target.value)
                  }
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {formData.user_phoneNumber || "Not provided"}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="user_bio"
                value={formData.user_bio}
                onChange={(e) => handleInputChange("user_bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md text-sm min-h-[80px]">
                {formData.user_bio || "No bio provided"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
