"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AgentDetailView } from "@/components/agent-detail-view"

const agents = [
  { id: 1, name: "Agent Alpha", status: "Online", trades: 156, roi: "12.3%", strategy: "Momentum" },
  { id: 2, name: "Agent Beta", status: "Offline", trades: 89, roi: "7.8%", strategy: "Arbitrage" },
  { id: 3, name: "Agent Gamma", status: "Online", trades: 234, roi: "15.6%", strategy: "Mean Reversion" },
]

export default function MyAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Agents</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="cursor-pointer" onClick={() => setSelectedAgent(agent.id)}>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>
                <Badge variant={agent.status === "Online" ? "success" : "secondary"}>{agent.status}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Trades: {agent.trades}</p>
              <p>ROI: {agent.roi}</p>
              <p>Strategy: {agent.strategy}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAgent && <AgentDetailView agentId={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  )
}

