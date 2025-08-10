"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { HoverCardClient } from './client';

export default function HoverCardPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: 'Hover Card' }] }>
      <HoverCardClient />
    </SidebarLayout>
  );
}

