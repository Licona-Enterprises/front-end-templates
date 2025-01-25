"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "2023-01", Bitcoin: 40000, Ethereum: 2800, Cardano: 1.2 },
  { date: "2023-02", Bitcoin: 45000, Ethereum: 3000, Cardano: 1.3 },
  { date: "2023-03", Bitcoin: 42000, Ethereum: 2900, Cardano: 1.1 },
  { date: "2023-04", Bitcoin: 48000, Ethereum: 3200, Cardano: 1.4 },
  { date: "2023-05", Bitcoin: 50000, Ethereum: 3500, Cardano: 1.5 },
  { date: "2023-06", Bitcoin: 47000, Ethereum: 3300, Cardano: 1.3 },
]

export default function MultiLineChart() {
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
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" />
          <YAxis yAxisId="left" stroke="#888888" />
          <YAxis yAxisId="right" orientation="right" stroke="#888888" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Bitcoin" stroke="var(--color-Bitcoin)" activeDot={{ r: 8 }} />
          <Line yAxisId="left" type="monotone" dataKey="Ethereum" stroke="var(--color-Ethereum)" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="Cardano" stroke="var(--color-Cardano)" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

