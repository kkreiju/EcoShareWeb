"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Sprout } from "lucide-react";

interface NutrientItem {
  nutrient: string;
  value: number;
}

interface ListingNutrientAnalyticsProps {
  listId: string;
}

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

interface NutrientData {
  nutrient: string;
  percentage: number;
  fill: string;
}

export function ListingNutrientAnalytics({
  listId,
}: ListingNutrientAnalyticsProps) {
  const [nutrients, setNutrients] = useState<NutrientItem[]>([]);
  const [chartData, setChartData] = useState<NutrientData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [aiMessage, setAiMessage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!listId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/ai/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            list_id: listId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data?.analytics_finding) {
          const analyticsFinding = JSON.parse(data.data.analytics_finding);
          const nutritionalData =
            analyticsFinding?.ngrokResponse?.nutritional_info?.nutritional_data;
          const aiMessage = analyticsFinding?.ai_message || "";
          const prediction = analyticsFinding?.ngrokResponse?.prediction || "";

          if (nutritionalData) {
            // Convert string values to numbers and sort by value descending
            const topNutrients = Object.entries(nutritionalData)
              .map(([key, value]) => ({
                nutrient: key,
                value: parseFloat(value as string) || 0,
              }))
              .filter((item) => item.value > 0)
              .sort((a, b) => b.value - a.value)
              .slice(0, 5); // Take top 5 nutrients

            // Calculate total for percentages
            const total = topNutrients.reduce(
              (sum, item) => sum + item.value,
              0
            );

            // Create chart data with percentages
            const newChartData: NutrientData[] = topNutrients.map(
              (nutrient, index) => ({
                nutrient: nutrient.nutrient,
                percentage: Math.round((nutrient.value / total) * 100),
                fill: colors[index % colors.length],
              })
            );

            setNutrients(topNutrients);
            setChartData(newChartData);
            setAiMessage(aiMessage);
            setPrediction(prediction);

            // Create dynamic chart config
            const newChartConfig: ChartConfig = {
              percentage: {
                label: "Percentage",
              },
            };

            newChartData.forEach((item, index) => {
              newChartConfig[item.nutrient.toLowerCase()] = {
                label: item.nutrient,
                color: colors[index % colors.length],
              };
            });

            setChartConfig(newChartConfig);
          } else {
            setError("No nutritional data available");
          }
        } else {
          setError("Failed to load analytics data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [listId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-sm text-muted-foreground">
            Loading nutrient analytics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || nutrients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sprout className="w-5 h-5 text-green-500" />
            Nutrient Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-sm text-muted-foreground">
            {error || "No nutrient data available"}
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {/* Left Column - Prediction, AI Message and Nutrient Legend */}
          <div className="space-y-4">
            {/* Prediction */}
            {prediction && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {prediction.toUpperCase()}
                </div>
              </div>
            )}

            {/* AI Message */}
            {aiMessage && (
              <div className="space-y-2">
                <h5 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                  Findings
                </h5>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {aiMessage}
                </div>
              </div>
            )}

            {/* Nutrient Legend */}
            <div className="space-y-3">
              <h5 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                Top Nutrients
              </h5>
              <div className="space-y-2">
                {nutrients.map((item, index) => (
                  <div key={item.nutrient} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-medium">
                        {item.nutrient}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <ChartContainer
                config={chartConfig}
                className="aspect-square max-h-[280px] min-h-[250px] w-full"
              >
                <PieChart width={280} height={280}>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
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

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Per
                </span>
                <span className="text-sm font-semibold text-foreground">
                  100g
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2 text-center">
              Nutrient composition
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
