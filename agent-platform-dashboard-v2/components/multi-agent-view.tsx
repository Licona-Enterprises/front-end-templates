"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Eye, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AgentCard } from "@/components/agent-card"
import { mockAgents } from "@/lib/mock-data"

export function MultiAgentView() {
  const [activeAgents, setActiveAgents] = useState(mockAgents.filter((agent) => agent.status === "active"))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Multi-Agent View</h2>
          <p className="text-gray-400 text-sm">Compare and monitor multiple agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button className="btn btn-primary" size="sm" asChild>
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-md bg-gray-800/50">
            <TabsTrigger
              value="grid"
              className="rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Grid View
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Comparison
            </TabsTrigger>
          </TabsList>
          <span className="text-sm text-gray-400">{activeAgents.length} Active Agents</span>
        </div>

        <TabsContent value="grid" className="space-y-0 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-0 mt-0">
          <Card className="rounded-lg border border-gray-800/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Agent Comparison</CardTitle>
              <CardDescription className="text-gray-400 text-sm">Compare performance across agents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800/50">
                      <th className="p-3 text-left font-medium text-gray-400 text-sm">Agent</th>
                      <th className="p-3 text-left font-medium text-gray-400 text-sm">Value</th>
                      <th className="p-3 text-left font-medium text-gray-400 text-sm">PnL</th>
                      <th className="p-3 text-left font-medium text-gray-400 text-sm">Next</th>
                      <th className="p-3 text-left font-medium text-gray-400 text-sm">Status</th>
                      <th className="p-3 text-left font-medium text-gray-400 text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAgents.map((agent, index) => (
                      <tr key={agent.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30`}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-accent" />
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm">${agent.portfolioValue.toLocaleString()}</td>
                        <td className={`p-3 text-sm ${agent.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                          {agent.pnl >= 0 ? "+" : ""}
                          {agent.pnl}%
                        </td>
                        <td className="p-3">
                          <div className="space-y-1 w-24">
                            <div className="text-xs text-gray-400">{agent.nextExecution}</div>
                            <Progress
                              value={agent.executionProgress}
                              className="h-1 bg-gray-800/50"
                              indicatorClassName="bg-accent"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          {agent.status === "active" ? (
                            <Badge
                              variant="outline"
                              className="border-success/50 bg-success/10 text-success rounded-sm text-xs"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-warning/50 bg-warning/10 text-warning rounded-sm text-xs"
                            >
                              Paused
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-accent" asChild>
                            <Link href={`/agent/${agent.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
