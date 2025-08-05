import authOptions from "@/app/options"
import sidebar from "@/app/sidebar"
import Messaging from "hasyx/lib/messaging"
import useSsr, { SsrResult } from "hasyx/lib/ssr"

export default async function MessagingPage() {
  const { session } = await useSsr(authOptions) as SsrResult;

  return (
    <Messaging 
      serverSession={session} 
      sidebarData={sidebar} 
    />
  );
} 