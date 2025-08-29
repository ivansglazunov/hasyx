"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "hasyx";
import { ScrollArea } from "hasyx/components/ui/scroll-area";
import { Separator } from "hasyx/components/ui/separator";
import { Button as UserButton } from "hasyx/components/entities/users";
import { useTranslations } from "hasyx";

export const Column = ({ title = "Users", query, type = 'list', id, setNext }: {
  title?: string;
  type?: 'entity' | 'list';
  id?: string;
  query?: any;
  setNext?: (next: { type: 'entity' | 'list'; id?: string }) => void;
}) => {
  const { data, loading, error } = useQuery(query || { table: "users", returning: ["id", "name", "image"], limit: 50 });
  const users = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedUser = useMemo(() => users.find((u: any) => u.id === selectedId) || null, [users, selectedId]);

  const t = useTranslations('columns');
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 font-medium">{title || t('usersTitle')}</div>
      <Separator />
      <div className="p-2" />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading && <div className="text-sm text-muted-foreground">{t('loading')}</div>}
          {error && <div className="text-sm text-destructive">{t('failed')}</div>}
          {!loading && !error && users.length === 0 && (
            <div className="text-sm text-muted-foreground">{t('emptyUsers')}</div>
          )}
          {users.map((user: any) => (
            <div key={user.id} className="w-full" onClick={() => { setSelectedId(user.id); setNext && setNext({ type: 'entity', id: user.id }); }}>
              <UserButton data={user} className="w-full" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};


