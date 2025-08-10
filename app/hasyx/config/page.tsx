"use client";

import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { HasyxConfigForm } from '@/lib/config/react-jsonschema-form';

export default function HasyxConfigPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name, link: '/' }, { title: 'Config' }]}>
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">🛠️ Hasyx Config</h1>
          <p className="text-muted-foreground">Edit configuration using JSON Schema form. Saving regenerates .env and docker-compose.yml</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <HasyxConfigForm />
        </div>
      </div>
    </SidebarLayout>
  );
}

