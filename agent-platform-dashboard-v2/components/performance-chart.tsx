"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan 1", value: 100 },
  { date: "Jan 15", value: 105 },
  { date: "Feb 1", value: 110 },
  { date: "Feb 15", value: 108 },
  { date: "Mar 1", value: 115 },
  { date: "Mar 15", value: 125 },
  { date: "Apr 1", value: 130 },
  { date: "Apr 15", value: 135 },
  { date: "May 1", value: 140 },
  { date: "May 15", value: 138 },
  { date: "Jun 1", value: 145 },
  { date: "Jun 15", value: 150 },
]

export function PerformanceChart() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Portfolio Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={1.5}
            stroke="hsl(var(--chart-1))"
            dot={false}
            activeDot={{
              r: 4,
              style: { fill: "var(--color-value)" },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
