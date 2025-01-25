"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AgentDetailViewProps {
  agentId: number
  onClose: () => void
}

export function AgentDetailView({ agentId, onClose }: AgentDetailViewProps) {
  const [agentData, setAgentData] = useState<any>(null)

  useEffect(() => {
    // Simulating API call to fetch agent data
    const fetchAgentData = async () => {
      // In a real application, you would fetch this data from your API
      const data = {
        id: agentId,
        name: "Agent Alpha",
        portfolio: {
          totalValue: 15000,
          holdings: [
            { token: "BTC", amount: 0.5, value: 7500 },
            { token: "ETH", amount: 10, value: 5000 },
            { token: "XRP", amount: 5000, value: 2500 },
          ],
        },
        performanceData: [
          { date: "2023-01", roi: 5 },
          { date: "2023-02", roi: 7 },
          { date: "2023-03", roi: 6 },
          { date: "2023-04", roi: 9 },
          { date: "2023-05", roi: 8 },
          { date: "2023-06", roi: 12 },
        ],
        recentTrades: [
          { id: 1, token: "BTC", action: "buy", price: 30000, timestamp: "2023-06-15T10:30:00Z", pnl: 500 },
          { id: 2, token: "ETH", action: "sell", price: 2000, timestamp: "2023-06-14T14:45:00Z", pnl: -100 },
          { id: 3, token: "XRP", action: "buy", price: 0.5, timestamp: "2023-06-13T09:15:00Z", pnl: 50 },
        ],
      }
      setAgentData(data)
    }

    fetchAgentData()
  }, [agentId])

  if (!agentData) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {agentData.name} Details
          <Button onClick={onClose}>Close</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Value: ${agentData.portfolio.totalValue}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentData.portfolio.holdings.map((holding: any) => (
                    <TableRow key={holding.token}>
                      <TableCell>{holding.token}</TableCell>
                      <TableCell>{holding.amount}</TableCell>
                      <TableCell>${holding.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={agentData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="roi" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>PnL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentData.recentTrades.map((trade: any) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.token}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell>${trade.price}</TableCell>
                      <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                      <TableCell className={trade.pnl >= 0 ? "text-green-500" : "text-red-500"}>${trade.pnl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

