'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { useSubscription } from 'hasyx'; 
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "hasyx/components/ui/alert";
import Debug from 'hasyx/lib/debug';
import { useTranslations } from 'hasyx';

const debug = Debug('users-subscription');

// Define a basic structure for user data (can be shared)
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export function UsersSubscription() {
  const tUsers = useTranslations('usersList');
  const { data = [], loading, error } = useSubscription(
    {
      table: 'users',
      limit: 5,
      returning: ['id', 'created_at', 'updated_at'], // Fetch name and email
      // Optionally add order_by: { created_at: 'desc' }
    },
    {
      role: 'anonymous'
    }
  );

  debug('Subscription state:', { loading, error, data });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{tUsers('subscription.title')}</CardTitle>
        <CardDescription>{tUsers('subscription.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {tUsers('loading')}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{tUsers('subscription.errorTitle')}</AlertTitle>
            <AlertDescription>
              {error.message || tUsers('subscription.errorDescription')}
            </AlertDescription>
          </Alert>
        )}
        {!loading && !error && !!data?.length && (
          <ul className="space-y-2">
            {data?.map((user) => (
              <li key={user.id} className="text-sm p-2 border rounded bg-muted/40">
                <p><strong>ID:</strong> {user.id}</p>
                {user.name && <p><strong>{tUsers('name')}:</strong> {user.name}</p>}
                {user.email && <p><strong>{tUsers('email')}:</strong> {user.email}</p>}
              </li>
            ))}
          </ul>
        )}
         {(!loading && !error && !data?.length) && (
           <p className="text-sm text-muted-foreground">{tUsers('empty')}</p>
         )}
      </CardContent>
    </Card>
  );
} 