import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { AdminWorkflow } from "@/lib/admin-api";
import { ToggleList } from "@/components/admin/ToggleList";
export const dynamic = "force-dynamic";
export default async function WorkflowsPage() {
  const data = await apiClient.get<{ workflows: AdminWorkflow[] }>("/api/admin/workflows", await getSessionToken());
  return <div><h1 className="text-2xl font-extrabold text-(--color-burgundy-dark)">Workflows</h1><p className="mb-6 mt-1 text-sm text-(--color-text-muted)">Control the guided journeys users see after an analysis.</p><ToggleList endpoint="/admin/workflows" initialItems={data.workflows}/></div>;
}
