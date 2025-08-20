import authOptions from "@/app/options"
import sidebar from "@/app/sidebar"
import useSsr, { SsrResult } from "hasyx/lib/ssr"
import PWAPageClient from "./client"

export default function PWADiagnosticsPage() {
  const { session } = useSsr() as SsrResult;

  return (
    <PWAPageClient 
      serverSession={session} 
      sidebarData={sidebar} 
    />
  );
} 