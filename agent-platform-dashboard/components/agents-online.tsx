"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const agents = [
  { name: "Agent 1", status: "Online", trades: 42, roi: "5.7%", lastActivity: "2 min ago" },
  { name: "Agent 2", status: "Offline", trades: 31, roi: "3.2%", lastActivity: "1 hour ago" },
  { name: "Agent 3", status: "Online", trades: 56, roi: "7.1%", lastActivity: "5 min ago" },
  { name: "Agent 4", status: "Online", trades: 23, roi: "2.9%", lastActivity: "15 min ago" },
  { name: "Agent 5", status: "Offline", trades: 18, roi: "1.8%", lastActivity: "3 hours ago" },
]

export function AgentsOnline() {
  const [filter, setFilter] = useState("")

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(filter.toLowerCase()) ||
      agent.status.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input placeholder="Search agents..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trades Executed</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgents.map((agent) => (
            <TableRow key={agent.name}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>
                <Badge variant={agent.status === "Online" ? "success" : "secondary"}>{agent.status}</Badge>
              </TableCell>
              <TableCell>{agent.trades}</TableCell>
              <TableCell>{agent.roi}</TableCell>
              <TableCell>{agent.lastActivity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

