import sidebar from "@/app/sidebar";
import ValidationForm from "hasyx/components/validation-form";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { useTranslations } from 'hasyx';

export default function ValidationPage() {
  const tNav = useTranslations('nav');
  const tPages = useTranslations('pages.validation');
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: tNav('validation'), link: '/hasyx/validation' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{tPages('title')}</h1>
          <p className="text-muted-foreground">{tPages('description')}</p>
        </div>
        
        <ValidationForm />
      </div>
    </SidebarLayout>
  );
}
