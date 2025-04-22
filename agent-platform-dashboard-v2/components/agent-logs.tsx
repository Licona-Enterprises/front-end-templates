"use client"

import { useState } from "react"
import { Bot, Calendar, Download, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const logEntries = [
  {
    id: "1",
    timestamp: "2023-06-15 14:32:45",
    agent: "DeFi Optimizer",
    type: "decision",
    message: "Identified opportunity to move funds from Aave to Compound for better yield",
    details: "Current APY on Aave: 3.2%, Compound offering 4.5% for same risk profile. Moving 50% of USDC position.",
  },
  {
    id: "2",
    timestamp: "2023-06-15 14:35:12",
    agent: "DeFi Optimizer",
    type: "transaction",
    message: "Executed swap of 5,000 USDC from Aave to Compound",
    details: "Transaction hash: 0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
  },
  {
    id: "3",
    timestamp: "2023-06-15 15:10:23",
    agent: "Bitcoin Accumulator",
    type: "analysis",
    message: "Market analysis indicates potential buying opportunity",
    details:
      "BTC price down 3.5% in last 24 hours while on-chain metrics show accumulation by long-term holders. Recommending small position increase.",
  },
  {
    id: "4",
    timestamp: "2023-06-15 15:15:45",
    agent: "Bitcoin Accumulator",
    type: "decision",
    message: "Decided to increase BTC position by 0.15 BTC",
    details:
      "Current portfolio allocation: 32.5% BTC. Target allocation: 35%. This purchase brings us closer to target while taking advantage of price dip.",
  },
]

export function AgentLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredLogs = logEntries.filter((log) => {
    if (
      searchQuery &&
      !log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.details.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (selectedAgent !== "all" && log.agent !== selectedAgent) {
      return false
    }

    if (selectedType !== "all" && log.type !== selectedType) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Agent Logs</h2>
          <p className="text-gray-400 text-sm">View detailed logs of agent reasoning and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
            <span className="sr-only">Export</span>
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border border-gray-800/50 bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Log Explorer</CardTitle>
          <CardDescription className="text-gray-400 text-sm">Search and filter agent logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                className="pl-8 rounded-md border border-gray-800/50 bg-gray-800/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[150px] rounded-md border border-gray-800/50 bg-gray-800/30">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent className="rounded-md border border-gray-800/50 bg-card">
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="DeFi Optimizer">DeFi Optimizer</SelectItem>
                <SelectItem value="Bitcoin Accumulator">Bitcoin Accumulator</SelectItem>
                <SelectItem value="Stablecoin Manager">Stablecoin Manager</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px] rounded-md border border-gray-800/50 bg-gray-800/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-md border border-gray-800/50 bg-card">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="risk">Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="rounded-md border border-gray-800/50 bg-card shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-b border-gray-800/50 bg-gray-800/20 p-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-accent" />
                        <span className="font-medium text-sm">{log.agent}</span>
                        <LogTypeBadge type={log.type} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{log.message}</p>
                    <p className="mt-2 text-xs text-gray-400 font-mono">{log.details}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLogs.length === 0 && (
              <div className="flex h-24 flex-col items-center justify-center rounded-md border border-dashed border-gray-800/50">
                <p className="text-gray-400 text-sm">No logs match your filters</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedAgent("all")
                    setSelectedType("all")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LogTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "analysis":
      return (
        <Badge variant="outline" className="border-accent/50 bg-accent/10 text-accent rounded-sm text-xs px-1.5 py-0">
          Analysis
        </Badge>
      )
    case "decision":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/50 bg-purple-500/10 text-purple-500 rounded-sm text-xs px-1.5 py-0"
        >
          Decision
        </Badge>
      )
    case "transaction":
      return (
        <Badge
          variant="outline"
          className="border-success/50 bg-success/10 text-success rounded-sm text-xs px-1.5 py-0"
        >
          Transaction
        </Badge>
      )
    case "risk":
      return (
        <Badge
          variant="outline"
          className="border-warning/50 bg-warning/10 text-warning rounded-sm text-xs px-1.5 py-0"
        >
          Risk
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="rounded-sm text-xs px-1.5 py-0">
          {type}
        </Badge>
      )
  }
}
