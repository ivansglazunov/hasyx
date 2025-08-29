'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "hasyx/components/ui/card";
import { useHasyx } from 'hasyx';
import { useQuery } from 'hasyx'; 
import { Input } from "hasyx/components/ui/input";
import { Button } from "hasyx/components/ui/button";
import { Eye } from 'lucide-react';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "hasyx/components/ui/alert";
import Debug from 'hasyx/lib/debug';
import { useTranslations } from 'hasyx';

const debug = Debug('users-query');

// Define a basic structure for user data (can be shared)
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

export function UsersQuery() {
  const t = useTranslations();
  const tf = (key: string, fallback: string) => {
    try { return t(key as any); } catch { return fallback; }
  };
  const hasyx = useHasyx();
  const [search, setSearch] = useState('');

  const where = useMemo(() => {
    if (!search.trim()) return undefined as any;
    return { name: { _ilike: `%${search.trim()}%` } } as any;
  }, [search]);

  const { data = [], loading, error, refetch } = useQuery(
    {
      table: 'users',
      where,
      limit: 20,
      order_by: { updated_at: 'desc' } as any,
      returning: ['id', 'name', 'image', 'updated_at'],
    }
  );

  debug('Query state:', { loading, error, data });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('usersList.query.title')}</CardTitle>
        <CardDescription>{t('usersList.query.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('usersList.loading')}
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{t('usersList.query.errorTitle')}</AlertTitle>
            <AlertDescription>
              {error.message || t('usersList.query.errorDescription')}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder={t('usersList.searchByName')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" onClick={() => refetch?.()}>Search</Button>
        </div>
        {(!loading && !error && !!data?.length) && (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {data.map((user: any) => (
              <li key={user.id} className="p-2 border rounded bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name || user.id}</span>
                    {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      const ok = await (hasyx as any).impersonate?.(user.id);
                      if (!ok) console.warn('Impersonation failed');
                    } catch (e) {
                      console.warn('Impersonation error', e);
                    }
                  }}
                  title="Посмотреть его глазами"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
         {(!loading && !error && !data?.length) && (
           <p className="text-sm text-muted-foreground">{t('usersList.empty')}</p>
         )}
      </CardContent>
    </Card>
  );
} 