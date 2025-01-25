"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", Bitcoin: 30, Ethereum: 40, Cardano: 20 },
  { month: "Feb", Bitcoin: 35, Ethereum: 45, Cardano: 25 },
  { month: "Mar", Bitcoin: 40, Ethereum: 50, Cardano: 30 },
  { month: "Apr", Bitcoin: 45, Ethereum: 55, Cardano: 35 },
  { month: "May", Bitcoin: 50, Ethereum: 60, Cardano: 40 },
  { month: "Jun", Bitcoin: 55, Ethereum: 65, Cardano: 45 },
]

export default function MultiBarChart() {
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
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#888888" />
          <YAxis stroke="#888888" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="Bitcoin" fill="var(--color-Bitcoin)" />
          <Bar dataKey="Ethereum" fill="var(--color-Ethereum)" />
          <Bar dataKey="Cardano" fill="var(--color-Cardano)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

