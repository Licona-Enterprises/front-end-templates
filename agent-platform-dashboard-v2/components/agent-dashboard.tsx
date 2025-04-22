"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, CreditCard, DollarSign, Eye, LineChart, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentCard } from "@/components/agent-card"
import { PerformanceChart } from "@/components/performance-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { mockAgents } from "@/lib/mock-data"

export function AgentDashboard() {
  const [activeAgents, setActiveAgents] = useState(mockAgents.filter((agent) => agent.status === "active"))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-gray-400 text-sm">Monitor and manage your autonomous agents</p>
        </div>
        <Button className="btn btn-primary" size="sm" asChild>
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">{mockAgents.length}</div>
            <p className="metric-label">{activeAgents.length} active</p>
          </CardContent>
        </Card>
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">$2,345,678</div>
            <p className="text-xs text-success">+5.2% from last week</p>
          </CardContent>
        </Card>
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">432</div>
            <p className="metric-label">+22 today</p>
          </CardContent>
        </Card>
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Sharpe Ratio</CardTitle>
            <LineChart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="metric-value">1.87</div>
            <p className="text-xs text-success">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-md bg-gray-800/50">
            <TabsTrigger
              value="active"
              className="rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              Active Agents
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              All Agents
            </TabsTrigger>
          </TabsList>
          <span className="text-sm text-gray-400">{activeAgents.length} Active Agents</span>
        </div>
        <TabsContent value="active" className="space-y-0 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            <Card className="agent-card flex h-[280px] flex-col items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                <div className="rounded-full bg-gray-800/50 p-4">
                  <Plus className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Create New Agent</CardTitle>
                <CardDescription className="text-center text-gray-400 text-sm">
                  Deploy a new autonomous agent
                </CardDescription>
                <Button className="btn btn-primary" size="sm" asChild>
                  <Link href="/create">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-0 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            <Card className="agent-card flex h-[280px] flex-col items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
                <div className="rounded-full bg-gray-800/50 p-4">
                  <Plus className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Create New Agent</CardTitle>
                <CardDescription className="text-center text-gray-400 text-sm">
                  Deploy a new autonomous agent
                </CardDescription>
                <Button className="btn btn-primary" size="sm" asChild>
                  <Link href="/create">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="metric-card lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription className="text-gray-400 text-sm">Cumulative returns</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
        <Card className="metric-card lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400 text-sm">Latest simulated transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
          <CardFooter className="border-t border-gray-800/50 pt-3">
            <Button variant="ghost" size="sm" className="w-full text-accent">
              <Eye className="mr-2 h-3 w-3" />
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
