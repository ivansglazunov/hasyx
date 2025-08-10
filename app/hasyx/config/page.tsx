"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { HasyxConfigForm } from '@/lib/config/react-jsonschema-form';
import { useTranslations } from 'hasyx';

export default function HasyxConfigPage() {
  const tPages = useTranslations('pages.config');
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: useTranslations('nav')('config') }]}>
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{tPages('title')}</h1>
          <p className="text-muted-foreground">{tPages('description')}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <HasyxConfigForm />
        </div>
      </div>
    </SidebarLayout>
  );
}

