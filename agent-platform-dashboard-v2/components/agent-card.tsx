"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Clock, Eye, MoreHorizontal, Pause, Play, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Agent } from "@/lib/types"

export function AgentCard({ agent }: { agent: Agent }) {
  const [status, setStatus] = useState(agent.status)

  const handleToggleStatus = () => {
    setStatus(status === "active" ? "paused" : "active")
  }

  return (
    <Card className="agent-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <div className={`status-dot ${status === "active" ? "status-dot-active" : "status-dot-paused"}`}></div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
          <CardDescription className="text-gray-400 text-sm">{agent.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border border-gray-800/50 rounded-lg shadow-md">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800/50" />
            <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50" onClick={handleToggleStatus}>
              {status === "active" ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Agent
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Activate Agent
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Agent
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800/50" />
            <DropdownMenuItem className="text-destructive hover:bg-gray-800/50 focus:bg-gray-800/50">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-accent" />
            <span className="text-sm">{agent.persona}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-400">{agent.frequency}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Portfolio Value</p>
            <p className="text-lg font-medium">${agent.portfolioValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">PnL</p>
            <p className={`text-lg font-medium ${agent.pnl >= 0 ? "text-success" : "text-destructive"}`}>
              {agent.pnl >= 0 ? "+" : ""}
              {agent.pnl}%
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Next Execution</span>
            <span className="text-gray-400">{agent.nextExecution}</span>
          </div>
          <Progress
            value={agent.executionProgress}
            className="h-1 bg-gray-800/50"
            indicatorClassName={status === "active" ? "bg-accent" : "bg-warning"}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800/50 pt-3">
        <Button variant="ghost" size="sm" className="w-full text-accent hover:bg-gray-800/50" asChild>
          <Link href={`/agent/${agent.id}`}>
            <Eye className="mr-2 h-3 w-3" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
