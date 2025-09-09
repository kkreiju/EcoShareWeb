"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Percentage",
  },
  chrome: {
    label: "Calcium",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Phosphorus",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Magnesium",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Potassium",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other Minerals",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartPieLabel() {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground text-center uppercase">
        Nutrient Analytics
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Benefits */}
        <div className="space-y-3">
          <h5 className="font-medium text-foreground text-sm uppercase">
            Key Benefits
          </h5>
          <div className="text-xs text-muted-foreground leading-relaxed">
            Essential nutrients that support bone health, muscle function, energy production, and overall immune system strength for optimal plant-based nutrition.
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground [&_.recharts-pie-label-text]:text-xs [&_.recharts-pie-label-text]:font-medium [&_.recharts-pie-label-text]:text-[10px] aspect-square max-h-[180px] min-h-[140px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="visitors"
                label
                nameKey="browser"
                cx="50%"
                cy="50%"
                outerRadius={55}
                innerRadius={20}
                paddingAngle={3}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
