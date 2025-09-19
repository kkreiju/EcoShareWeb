"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Sprout } from "lucide-react";

const chartData = [
  { nutrient: "calcium", percentage: 30, fill: "#3b82f6" },
  { nutrient: "phosphorus", percentage: 22, fill: "#10b981" },
  { nutrient: "magnesium", percentage: 20, fill: "#f59e0b" },
  { nutrient: "potassium", percentage: 18, fill: "#8b5cf6" },
  { nutrient: "other", percentage: 10, fill: "#ef4444" },
];

const chartConfig = {
  percentage: {
    label: "Percentage",
  },
  calcium: {
    label: "Calcium",
    color: "#3b82f6",
  },
  phosphorus: {
    label: "Phosphorus",
    color: "#10b981",
  },
  magnesium: {
    label: "Magnesium",
    color: "#f59e0b",
  },
  potassium: {
    label: "Potassium",
    color: "#8b5cf6",
  },
  other: {
    label: "Other Minerals",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function ListingNutrientAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sprout className="w-5 h-5 text-green-500" />
          Nutrient Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Benefits */}
          <div className="space-y-3">
            <h5 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Key Benefits
            </h5>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Essential nutrients that support bone health, muscle function, energy production, 
              and overall immune system strength for optimal plant-based nutrition.
            </div>
            
            {/* Nutrient List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                <span className="text-sm font-medium">Calcium - Bone Health</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
                <span className="text-sm font-medium">Phosphorus - Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
                <span className="text-sm font-medium">Magnesium - Muscle Function</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8b5cf6" }}></div>
                <span className="text-sm font-medium">Potassium - Heart Health</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
                <span className="text-sm font-medium">Other Minerals</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="aspect-square max-h-[280px] min-h-[250px] w-full"
            >
              <PieChart width={280} height={280}>
                <ChartTooltip 
                  content={<ChartTooltipContent hideLabel />} 
                />
                <Pie
                  data={chartData}
                  dataKey="percentage"
                  nameKey="nutrient"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={true}
                />
              </PieChart>
            </ChartContainer>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Estimated nutrient composition
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
