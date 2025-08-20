import authOptions from "@/app/options"
import sidebar from "@/app/sidebar"
import Diagnostics from "hasyx/lib/diagnostics"
import useSsr, { SsrResult } from "hasyx/lib/ssr"

export default function DiagnosticsPage() {
  const { session } = useSsr() as SsrResult;

  return (
    <Diagnostics 
      serverSession={session} 
      sidebarData={sidebar} 
    />
  );
} 