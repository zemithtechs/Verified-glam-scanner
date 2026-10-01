import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { AdminTool } from "@/lib/admin-api";
import { ToggleList } from "@/components/admin/ToggleList";
export const dynamic = "force-dynamic";
export default async function ToolsPage() {
  const data = await apiClient.get<{ tools: AdminTool[] }>("/api/admin/tools", await getSessionToken());
  return <div><h1 className="text-2xl font-extrabold text-(--color-burgundy-dark)">Tools Registry</h1><p className="mb-6 mt-1 text-sm text-(--color-text-muted)">{data.tools.filter((tool) => tool.enabled).length} of {data.tools.length} analysis tools enabled. Disabled tools are blocked by the API.</p><ToggleList endpoint="/admin/tools" initialItems={data.tools.map((tool) => ({ id: tool.featureType, name: tool.name, enabled: tool.enabled }))}/></div>;
}
