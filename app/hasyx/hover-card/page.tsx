"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { HoverCardClient } from './client';
import { useTranslations } from 'hasyx';

export default function HoverCardPage() {
  const tNav = useTranslations('nav');
  const tPages = useTranslations('pages.hoverCard');
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: tPages('title') }] }>
      <HoverCardClient />
    </SidebarLayout>
  );
}

