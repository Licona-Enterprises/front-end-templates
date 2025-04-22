import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentDashboard } from "@/components/agent-dashboard"

export default function Home() {
  return (
    <DashboardLayout>
      <AgentDashboard />
    </DashboardLayout>
  )
}
