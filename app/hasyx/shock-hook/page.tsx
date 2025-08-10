"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { ShockHookClient } from './client';

export default function ShockHookPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: 'Shake' }]}>
      <ShockHookClient />
    </SidebarLayout>
  );
}

