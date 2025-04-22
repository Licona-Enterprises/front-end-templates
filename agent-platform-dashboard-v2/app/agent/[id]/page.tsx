import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentDetail } from "@/components/agent-detail"

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <AgentDetail id={params.id} />
    </DashboardLayout>
  )
}
