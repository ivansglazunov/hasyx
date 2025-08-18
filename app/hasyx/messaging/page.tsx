import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { Messaging } from "hasyx/components/hasyx/messaging/messaging";

export default function MessagingPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }]}>
      <Messaging/>
    </SidebarLayout>
  );
} 