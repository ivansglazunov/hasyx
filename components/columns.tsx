"use client";

import React, { useCallback, useMemo, useState } from "react";
import { cn } from "hasyx/lib/utils";
import { ScrollArea } from "hasyx/components/ui/scroll-area";
import { Separator } from "hasyx/components/ui/separator";
import { Button } from "hasyx/components/ui/button";
import { useTranslations } from "hasyx";
import * as UsersModule from "./columns/users";
import * as AccountsModule from "./columns/accounts";
import * as GroupsModule from "./columns/groups";
import * as RoomsModule from "./columns/rooms";
import * as UsersEntity from "./entities/users";
import * as AccountsEntity from "./entities/accounts";
import * as GroupsEntity from "./entities/groups";
import * as RoomsEntity from "./entities/rooms";

type ColumnModule = {
  Column: React.ComponentType<{
    title?: string;
    type?: 'entity' | 'list';
    id?: string;
    query?: any;
    setNext?: (next: { type: 'entity' | 'list'; id?: string; name?: string; title?: string; query?: any }) => void;
  }>;
};

const COLUMN_REGISTRY: Record<string, ColumnModule> = {
  users: UsersModule as unknown as ColumnModule,
  accounts: AccountsModule as unknown as ColumnModule,
  groups: GroupsModule as unknown as ColumnModule,
  rooms: RoomsModule as unknown as ColumnModule,
};

const ENTITY_REGISTRY: Record<string, ColumnModule> = {
  users: UsersEntity as unknown as ColumnModule,
  accounts: AccountsEntity as unknown as ColumnModule,
  groups: GroupsEntity as unknown as ColumnModule,
  rooms: RoomsEntity as unknown as ColumnModule,
};

export interface CategoryItem {
  title: string;
  name: string;
}

export interface OpenColumnConfig {
  key?: string;
  name: string;
  title?: string;
  type: 'entity' | 'list';
  id?: string;
  query?: any;
}

interface ColumnsProps {
  categories: CategoryItem[];
  className?: string;
}

export function Columns({ categories, className }: ColumnsProps) {
  const t = useTranslations('columns');
  const initialColumns = useMemo<OpenColumnConfig[]>(() => [], []);
  const [openColumns, setOpenColumns] = useState<OpenColumnConfig[]>(initialColumns);

  const openCategory = useCallback((name: string) => {
    const category = categories.find((c) => c.name === name);
    if (!category) return;
    // Replace any opened columns with the chosen category list
    setOpenColumns([
      {
        key: `${name}-list`,
        name,
        title: category.title,
        type: 'list',
        query: getDefaultQueryForCategory(name),
      },
    ]);
  }, [categories]);

  const makeSetNextForIndex = useCallback((index: number, name: string) => (next: { type: 'entity' | 'list'; id?: string; name?: string; title?: string; query?: any }) => {
    setOpenColumns((prev) => {
      const base = prev.slice(0, index + 1);
      const targetName = next.name || name;
      const title = next.title || base[index]?.title || categories.find(c => c.name === targetName)?.title || targetName;
      const key = `${targetName}-${next.type}-${next.id || 'root'}-${Math.random().toString(36).slice(2, 6)}`;
      return [
        ...base,
        {
          key,
          name: targetName,
          title,
          type: next.type,
          id: next.id,
          query: next.type === 'list' ? (next.query ?? getDefaultQueryForCategory(targetName)) : next.query,
        },
      ];
    });
  }, [categories]);

  return (
    <div className={cn("w-full h-full overflow-hidden", className)}>
      <div className="flex flex-row gap-0 overflow-x-auto h-full">
        <div className="w-[300px] min-w-[300px] max-w-[300px] h-full border-r flex flex-col">
          <div className="p-3 font-medium">{t('entities')}</div>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => openCategory(category.name)}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {openColumns.map((col, idx) => {
          const Module = col.type === 'list' ? COLUMN_REGISTRY[col.name] : ENTITY_REGISTRY[col.name];
          if (!Module) return (
            <div key={col.key} className="w-[300px] min-w-[300px] max-w-[300px] h-full border-r flex flex-col">
              <div className="p-3 font-medium">{col.title || col.name}</div>
              <Separator />
              <div className="p-3 text-sm text-muted-foreground">{t('noColumnFor', { name: col.name })}</div>
            </div>
          );

          const Comp = Module.Column as ColumnModule["Column"];
          return (
            <div key={col.key} className="w-[300px] min-w-[300px] max-w-[300px] h-full border-r flex flex-col">
              <Comp title={col.title} type={col.type} id={col.id} query={col.query} setNext={makeSetNextForIndex(idx, col.name)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getDefaultQueryForCategory(name: string) {
  switch (name) {
    case "users":
      return {
        table: "users",
        returning: ["id", "name", "image", "created_at", "updated_at"],
        limit: 50,
        order_by: { updated_at: "desc" as const },
      };
    case "accounts":
      return {
        table: "accounts",
        returning: ["id", "provider", "user_id", "created_at", "updated_at"],
        limit: 50,
        order_by: { updated_at: "desc" as const },
      };
    case "groups":
      return {
        table: "groups",
        returning: ["id", "title", "owner_id", "visibility", "join_policy", "updated_at"],
        limit: 50,
        order_by: { updated_at: "desc" as const },
      };
    case "rooms":
      return {
        table: "rooms",
        returning: ["id", "title", "created_at", "updated_at"],
        limit: 50,
        order_by: { updated_at: "desc" as const },
      };
    default:
      return {};
  }
}


