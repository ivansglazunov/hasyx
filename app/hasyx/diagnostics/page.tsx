import authOptions from "@/app/options"
import sidebar from "@/app/sidebar"
import Diagnostics from "hasyx/lib/diagnostics"
import InvitesPanel from "./invites-panel"
import useSsr, { SsrResult } from "hasyx/lib/ssr"

export default async function DiagnosticsPage() {
  const { session } = await useSsr(authOptions) as SsrResult;

  return (
    <>
      <Diagnostics 
        serverSession={session} 
        sidebarData={sidebar} 
      />
      {/* Invites diagnostics panel */}
      {/* Client-side widget for manual testing of invites */}
      <InvitesPanel />
    </>
  );
} 