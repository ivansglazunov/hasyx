"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { HoverCardClient } from './client';
import { useTranslations } from 'hasyx';

export default function HoverCardPage() {
  const t = useTranslations();
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: t('pages.hoverCard.title') }] }>
      <HoverCardClient />
    </SidebarLayout>
  );
}

