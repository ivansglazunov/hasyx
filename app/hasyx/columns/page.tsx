import React from 'react';
import sidebar from '@/app/sidebar';
import { SidebarLayout } from 'hasyx/components/sidebar/layout';
import { Columns } from 'hasyx/components/columns';
import pckg from '@/package.json';

export default function ColumnsPage() {
  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name as string, link: '/' }] }>
      <div className="h-full">
        <Columns
          categories={[
            { title: 'Users', name: 'users' },
            { title: 'Accounts', name: 'accounts' },
            { title: 'Groups', name: 'groups' },
            { title: 'Rooms', name: 'rooms' },
          ]}
        />
      </div>
    </SidebarLayout>
  );
}


