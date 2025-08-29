"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "hasyx";
import { ScrollArea } from "hasyx/components/ui/scroll-area";
import { Separator } from "hasyx/components/ui/separator";
import { Button } from "hasyx/components/ui/button";
import { Card as AccountCard, Button as AccountButton } from "hasyx/components/entities/accounts";
import { useTranslations } from "hasyx";

export const Column = ({ title = "Accounts", query, type = 'list', id, setNext }: {
  title?: string;
  type?: 'entity' | 'list';
  id?: string;
  query?: any;
  setNext?: (next: { type: 'entity' | 'list'; id?: string }) => void;
}) => {
  const { data, loading, error } = useQuery(query || { table: "accounts", returning: ["id", "provider", "user_id"], limit: 50 });
  const accounts = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const t = useTranslations('columns');
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 font-medium">{title || t('accountsTitle')}</div>
      <Separator />
      <div className="p-2" />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading && <div className="text-sm text-muted-foreground">{t('loading')}</div>}
          {error && <div className="text-sm text-destructive">{t('failed')}</div>}
          {!loading && !error && accounts.length === 0 && (
            <div className="text-sm text-muted-foreground">{t('emptyAccounts')}</div>
          )}
          {accounts.map((row: any) => (
            <div key={row.id} className="w-full" onClick={() => { setSelectedId(row.id); setNext && setNext({ type: 'entity', id: row.id }); }}>
              <AccountButton data={row} className="w-full" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};


