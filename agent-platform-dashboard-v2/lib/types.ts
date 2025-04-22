export interface Agent {
  id: string
  name: string
  description: string
  persona: string
  status: string
  portfolioValue: number
  pnl: number
  lastDecision: string
  nextExecution: string
  executionProgress: number
  frequency: string
}
