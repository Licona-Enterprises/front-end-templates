"use client"

import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Bitcoin", value: 50 },
  { name: "Ethereum", value: 30 },
  { name: "Cardano", value: 10 },
  { name: "Others", value: 10 },
]

export default function PieChart() {
  return (
    <ChartContainer
      config={{
        Bitcoin: {
          label: "Bitcoin",
          color: "hsl(var(--chart-1))",
        },
        Ethereum: {
          label: "Ethereum",
          color: "hsl(var(--chart-2))",
        },
        Cardano: {
          label: "Cardano",
          color: "hsl(var(--chart-3))",
        },
        Others: {
          label: "Others",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

