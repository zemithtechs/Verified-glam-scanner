import { notFound, redirect } from "next/navigation";
import { toolForSlug } from "@/lib/tools";
import { apiClient } from "@/lib/api-client";
import { getSessionToken } from "@/lib/session";
import type { ChallengePlan } from "@/lib/challenge-api";
import { ToolWorkspace } from "./ToolWorkspace";
import { ChallengeStart } from "./ChallengeStart";

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolForSlug(slug);
  if (!tool) notFound();

  if (tool.featureType === "GLOW_UP_GUIDE") {
    // An active challenge already exists — this page is only for starting
    // a new one, so send them to the real tracked view instead.
    const token = await getSessionToken();
    const { plan } = await apiClient.get<{ plan: ChallengePlan | null }>("/api/challenges/active", token);
    if (plan) redirect("/app/profile/challenge");
    return <ChallengeStart tool={tool} />;
  }

  return <ToolWorkspace tool={tool} />;
}
