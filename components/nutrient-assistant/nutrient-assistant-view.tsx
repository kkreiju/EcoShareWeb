"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity, Wrench } from "lucide-react";
import { PlantDiagnosticsTab } from "./plant-diagnostics-tab";
import { PlantNutrientBuilderTab } from "./plant-nutrient-builder-tab";

export function NutrientAssistantView() {
  const [activeTab, setActiveTab] = useState("diagnostics");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Nutrient Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Analyze plant nutrients and build personalized care plans
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Plant Care Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="diagnostics"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Nutrient Diagnostics
                <Badge variant="secondary" className="ml-1 text-xs">
                  Analyze
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Nutrient Builder
                <Badge variant="secondary" className="ml-1 text-xs">
                  Create
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnostics" className="mt-6">
              <PlantDiagnosticsTab />
            </TabsContent>

            <TabsContent value="builder" className="mt-6">
              <PlantNutrientBuilderTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
