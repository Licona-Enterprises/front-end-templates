"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Brain,
  Clock,
  Cog,
  Download,
  FileText,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PerformanceChart } from "@/components/performance-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { mockAgents } from "@/lib/mock-data"

export function AgentDetail({ id }: { id: string }) {
  const agent = mockAgents.find((a) => a.id === id) || mockAgents[0]
  const [status, setStatus] = useState(agent.status)

  const handleToggleStatus = () => {
    setStatus(status === "active" ? "paused" : "active")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{agent.name}</h2>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={status === "active" ? "outline" : "default"} onClick={handleToggleStatus}>
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
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Cog className="mr-2 h-4 w-4" />
                Edit Configuration
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Agent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {status === "active" ? (
                <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-500">
                  Paused
                </Badge>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {status === "active" ? `Next execution: ${agent.nextExecution}` : "Agent is currently paused"}
            </p>
            {status === "active" && <Progress value={agent.executionProgress} className="mt-2 h-1" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${agent.portfolioValue.toLocaleString()}</div>
            <p className={`text-xs ${agent.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
              {agent.pnl >= 0 ? "+" : ""}
              {agent.pnl}% from initial allocation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persona</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{agent.persona}</div>
            <p className="text-xs text-muted-foreground">Specialized in {agent.name.toLowerCase()} strategies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execution Frequency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{agent.frequency}</div>
            <p className="text-xs text-muted-foreground">Last decision: {agent.lastDecision}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Agent performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest simulated transactions from this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Summary</CardTitle>
              <CardDescription>Overview of agent behavior and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium">Strategy Overview</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This agent is designed to {agent.description.toLowerCase()}. It operates with a{" "}
                  {agent.frequency.toLowerCase()} execution frequency, making decisions based on market conditions, risk
                  parameters, and portfolio objectives.
                </p>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Total Return</p>
                    <p className={`text-2xl font-bold ${agent.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {agent.pnl >= 0 ? "+" : ""}
                      {agent.pnl}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">1.87</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Drawdown</p>
                    <p className="text-2xl font-bold text-red-500">-5.2%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The agent has recently {agent.lastDecision.toLowerCase()}. This decision was based on market analysis
                  and portfolio optimization algorithms. The agent continues to monitor market conditions and will
                  execute its next decision {agent.nextExecution.toLowerCase()}.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Log</CardTitle>
              <CardDescription>Detailed log of agent reasoning and decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Decision: {agent.lastDecision}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Observation</h4>
                      <p className="text-sm text-muted-foreground">
                        I've analyzed the current market conditions and identified an opportunity to optimize our
                        position. The current APY on Aave for USDC is 3.2%, while Compound is offering 4.5% for the same
                        risk profile.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Thought Process</h4>
                      <p className="text-sm text-muted-foreground">
                        Given the 1.3% difference in yield and similar risk profiles between these platforms, it makes
                        sense to reallocate some of our position. I'll maintain some exposure to Aave for
                        diversification but move a portion to take advantage of the higher yield on Compound.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        I will move 50% of our USDC position (5,000 USDC) from Aave to Compound to capture the higher
                        yield while maintaining platform diversification.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Expected Outcome</h4>
                      <p className="text-sm text-muted-foreground">
                        This reallocation should increase our annualized yield by approximately 0.65% on the total USDC
                        position, resulting in an additional $32.50 per year in interest income.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Decision: Adjusted risk parameters</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Observation</h4>
                      <p className="text-sm text-muted-foreground">
                        Market volatility has increased by 15% over the past week, with the VIX index rising from 18 to
                        21. This indicates heightened uncertainty in the broader financial markets.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Thought Process</h4>
                      <p className="text-sm text-muted-foreground">
                        Given the increased market volatility, it's prudent to adjust our risk parameters to protect
                        capital. While our strategy is focused on yield optimization, we should temporarily reduce
                        exposure to higher-risk protocols until market conditions stabilize.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        I will adjust our risk tolerance parameters from 7/10 to 5/10, which will limit exposure to
                        protocols with lower security ratings and prioritize established platforms with longer track
                        records.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Expected Outcome</h4>
                      <p className="text-sm text-muted-foreground">
                        This adjustment may reduce our potential yield by approximately 0.8% annually but will decrease
                        our risk exposure by an estimated 25%, providing better protection during this period of
                        increased volatility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Decision: Rebalanced portfolio allocations</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3 days ago</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Observation</h4>
                      <p className="text-sm text-muted-foreground">
                        Our portfolio has drifted from target allocations due to market movements. USDC allocation has
                        decreased from 40% to 35%, while ETH allocation has increased from 30% to 36%.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Thought Process</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular rebalancing is essential to maintain our desired risk profile. While ETH has performed
                        well, allowing allocations to drift too far from targets increases our exposure to market
                        volatility beyond our strategy parameters.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        I will sell 6% of our ETH position and convert it to USDC to bring our allocations back in line
                        with targets: 40% USDC, 30% ETH, 20% BTC, 10% other assets.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Expected Outcome</h4>
                      <p className="text-sm text-muted-foreground">
                        This rebalancing will reduce our market risk exposure and ensure we maintain our strategic asset
                        allocation. It also allows us to lock in some profits from the recent ETH price appreciation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Decisions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete history of simulated transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Swapped 5,000 USDC from Aave to Compound</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium">Transaction Details</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>Swap</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span>5,000 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From:</span>
                          <span>Aave</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">To:</span>
                          <span>Compound</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Fee:</span>
                          <span>$2.15</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Transaction Hash</h4>
                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Withdrew 2,500 USDC from Aave</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium">Transaction Details</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>Withdrawal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span>2,500 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From:</span>
                          <span>Aave</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">To:</span>
                          <span>Wallet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Fee:</span>
                          <span>$1.85</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Transaction Hash</h4>
                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Deposited 2,500 USDC to Compound</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium">Transaction Details</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>Deposit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span>2,500 USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From:</span>
                          <span>Wallet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">To:</span>
                          <span>Compound</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Fee:</span>
                          <span>$2.05</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Transaction Hash</h4>
                      <p className="mt-2 break-all text-xs text-muted-foreground">
                        0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Current configuration and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium">Name</div>
                      <div className="col-span-2 text-sm">{agent.name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium">Description</div>
                      <div className="col-span-2 text-sm">{agent.description}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium">Persona</div>
                      <div className="col-span-2 text-sm">{agent.persona}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium">Execution Frequency</div>
                      <div className="col-span-2 text-sm">{agent.frequency}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Knowledge Base</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">DeFi Protocols</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Knowledge about major DeFi protocols, risks, and yield strategies
                    </p>

                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Market Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Historical market data, trends, and technical analysis patterns
                    </p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Tools</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Token Swapping</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Ability to swap between different tokens</p>

                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Lending & Borrowing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Interact with lending protocols to lend or borrow assets
                    </p>

                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Portfolio Balancing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Rebalance portfolio based on target allocations</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Objectives</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Optimize yield across DeFi protocols while maintaining a moderate risk profile. Target an annual
                    yield of 5-8% with maximum drawdown of 10%. Prioritize capital preservation over maximum yield.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Cog className="mr-2 h-4 w-4" />
                Edit Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
