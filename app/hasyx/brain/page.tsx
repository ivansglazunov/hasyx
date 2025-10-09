"use client"

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import dynamic from "next/dynamic";

const Client = dynamic(() => import("./client"), { ssr: false });

export default function Page() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }]}> 
      <Client />
    </SidebarLayout>
  );
}


