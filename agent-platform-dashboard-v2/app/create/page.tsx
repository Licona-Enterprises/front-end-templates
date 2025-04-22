import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentCreationWizard } from "@/components/agent-creation-wizard"

export default function CreateAgent() {
  return (
    <DashboardLayout>
      <AgentCreationWizard />
    </DashboardLayout>
  )
}
