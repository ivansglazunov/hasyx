'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "hasyx/components/ui/tabs"; // Import Tabs components
import { UsersQuery } from './users-query'; // Import the query component
import { UsersSubscription } from './users-subscription'; // Import the subscription component
import Debug from 'hasyx/lib/debug';
import { useTranslations } from 'hasyx';

const debug = Debug('users-card');

export function UsersCard(props: React.HTMLAttributes<HTMLDivElement>) {
  debug('Rendering UsersCard with tabs');
  const tUsers = useTranslations('usersList');

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{tUsers('title')}</CardTitle>
        <CardDescription>{tUsers('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="query"> {/* Default to query tab */} 
          <TabsList className="grid w-full grid-cols-2"> {/* Two tabs */} 
            <TabsTrigger value="query">{tUsers('tabs.query')}</TabsTrigger>
            <TabsTrigger value="subscription">{tUsers('tabs.subscription')}</TabsTrigger>
          </TabsList>
          <TabsContent value="query" className="mt-4">
            {/* Render UsersQuery only when tab is active */}
            <UsersQuery />
          </TabsContent>
          <TabsContent value="subscription" className="mt-4">
             {/* Render UsersSubscription only when tab is active */}
            <UsersSubscription />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 