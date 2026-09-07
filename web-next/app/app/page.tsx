import { redirect } from "next/navigation";
import { DEFAULT_TOOL_SLUG } from "@/lib/tools";

export default function AppIndexPage() {
  redirect(`/app/${DEFAULT_TOOL_SLUG}`);
}
