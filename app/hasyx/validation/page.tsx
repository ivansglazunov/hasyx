import sidebar from "@/app/sidebar";
import ValidationForm from "hasyx/components/validation-form";
import { SidebarLayout } from "hasyx/components/sidebar/layout";

export default function ValidationPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: 'Validation', link: '/hasyx/validation' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Form Validation</h1>
          <p className="text-muted-foreground">
            Test real-time form validation using Zod schemas
          </p>
        </div>
        
        <ValidationForm />
      </div>
    </SidebarLayout>
  );
}
