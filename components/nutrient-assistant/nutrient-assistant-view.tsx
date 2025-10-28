"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, ArrowRight, Leaf, Target, TrendingUp } from "lucide-react";
import { PlantDiagnosticsTab } from "./plant-diagnostics-tab";
import { PlantNutrientBuilderTab } from "./plant-nutrient-builder-tab";

export function NutrientAssistantView() {
  const [activeTool, setActiveTool] = useState<"diagnostics" | "builder" | null>(null);

  if (activeTool === "diagnostics") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2"
          >
            ← Back to Tools
          </Button>
        </div>
        <PlantDiagnosticsTab />
      </div>
    );
  }

  if (activeTool === "builder") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2"
          >
            ← Back to Tools
          </Button>
        </div>
        <PlantNutrientBuilderTab />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
          <Leaf className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Nutrient Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent plant care tools powered by AI to help you grow healthier plants
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrient Diagnostics Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <Camera className="h-7 w-7 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Nutrient Diagnostics</CardTitle>
            <CardDescription className="text-base">
              Upload a plant photo and get instant nutrient analysis
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Target className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>AI-powered plant identification</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Detailed nutrient recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Leaf className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Local compost listing suggestions</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setActiveTool("diagnostics")}
                className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                size="lg"
              >
                Start Plant Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nutrient Builder Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <Sparkles className="h-7 w-7 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Nutrient Builder</CardTitle>
            <CardDescription className="text-base">
              Create personalized compost plans with available materials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Target className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Plant-specific nutrient planning</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>AI-optimized material combinations</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Leaf className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Match quality assessment</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setActiveTool("builder")}
                variant="outline"
                className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                size="lg"
              >
                Build Nutrient Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Why Choose Our Nutrient Assistant?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Smart Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI technology identifies plants and analyzes their nutrient needs instantly
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Personalized Plans</h3>
            <p className="text-sm text-muted-foreground">
              Get custom compost recommendations based on your available materials and plant type
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Leaf className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Sustainable Solutions</h3>
            <p className="text-sm text-muted-foreground">
              Connect with local compost providers to reduce waste and grow healthier plants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
