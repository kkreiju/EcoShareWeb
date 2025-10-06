"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, User, Shield } from "lucide-react";

interface AccountSettingsHeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Personal information and avatar",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password and authentication settings",
  },
];

export function AccountSettingsHeader({
  activeSection,
  onSectionChange,
  onRefresh,
  isLoading,
}: AccountSettingsHeaderProps) {
  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="space-y-4">
      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {currentSection?.description ||
              "Manage your account preferences and security"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
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

      {/* Section Tabs */}
      <div className="w-full">
        <Tabs
          value={activeSection}
          onValueChange={onSectionChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="sm:hidden">{section.label.slice(0, 4)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Current Section Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {currentSection && (
          <>
            <currentSection.icon className="h-4 w-4" />
            <span>Currently viewing: {currentSection.label}</span>
          </>
        )}
      </div>
    </div>
  );
}
