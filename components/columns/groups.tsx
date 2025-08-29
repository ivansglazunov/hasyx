"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "hasyx";
import { ScrollArea } from "hasyx/components/ui/scroll-area";
import { Separator } from "hasyx/components/ui/separator";
import { useTranslations } from "hasyx";

export const Column = ({ title = "Groups", query, type = 'list', id, setNext }: {
  title?: string;
  type?: 'entity' | 'list';
  id?: string;
  query?: any;
  setNext?: (next: { type: 'entity' | 'list'; id?: string }) => void;
}) => {
  const { data, loading, error } = useQuery(query || { table: "groups", returning: ["id", "title", "visibility", "join_policy", "updated_at"], limit: 50, order_by: { updated_at: "desc" as const } });
  const groups = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const t = useTranslations('columns');
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 font-medium">{title || t('groupsTitle')}</div>
      <Separator />
      <div className="p-2" />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading && <div className="text-sm text-muted-foreground">{t('loading')}</div>}
          {error && <div className="text-sm text-destructive">{t('failed')}</div>}
          {!loading && !error && groups.length === 0 && (
            <div className="text-sm text-muted-foreground">{t('emptyGroups')}</div>
          )}
          {groups.map((row: any) => (
            <button key={row.id} className="w-full text-left px-2 py-2 rounded hover:bg-muted" onClick={() => { setSelectedId(row.id); setNext && setNext({ type: 'entity', id: row.id }); }}>
              <div className="font-medium truncate">{row.title || row.id}</div>
              <div className="text-xs text-muted-foreground truncate">{row.visibility} · {row.join_policy}</div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};


