"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import dynamic from 'next/dynamic';
import { useTranslations } from 'hasyx';

const HasyxConfigForm = dynamic(() => import('hasyx/lib/config/react-jsonschema-form').then(m => m.HasyxConfigForm), { ssr: false });

export default function HasyxConfigPage() {
  const t = useTranslations('pages.config');
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: useTranslations('nav')('config') }]}>
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <HasyxConfigForm />
        </div>
      </div>
    </SidebarLayout>
  );
}

