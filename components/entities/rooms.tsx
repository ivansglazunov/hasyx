"use client";

import React from 'react';
import { useQuery } from 'hasyx';
import { Button as UIButton } from 'hasyx/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { X, Home } from 'lucide-react';
import Room from 'hasyx/components/room';

interface RoomData {
  id?: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  __typename?: string;
  [key: string]: any;
}

export function Button({ data, ...props }: { data: RoomData | string; [key: string]: any; }) {
  const roomId = typeof data === 'string' ? data : data?.id;
  const roomData = typeof data === 'object' ? data : null;
  const display = roomData?.title || `Room ${roomId}`;
  return (
    <UIButton variant="outline" className="h-auto p-2 justify-start gap-2 min-w-0" {...props}>
      <Home className="w-4 h-4" />
      <span className="truncate text-xs">{display}</span>
    </UIButton>
  );
}

export function Card({ data, onClose, ...props }: { data: RoomData | string; onClose?: () => void; [key: string]: any; }) {
  const id = typeof data === 'string' ? data : data?.id;
  const provided = typeof data === 'object' ? data : null;
  const { data: fetched, loading, error } = useQuery({ table: 'rooms', pk_columns: { id }, returning: ['id','title','created_at','updated_at'] }, { skip: !id, role: 'user' });
  const room = provided || fetched;
  if (loading) return <UICard className="w-80" {...props}><CardContent className="p-4">Loading…</CardContent></UICard>;
  if (error || !room) return <UICard className="w-80" {...props}><CardContent className="p-4">Failed to load room</CardContent></UICard>;
  return (
    <UICard className="w-80" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full"><Home className="w-5 h-5" /></div>
            <div>
              <CardTitle className="text-base">{room.title || 'Room'}</CardTitle>
            </div>
          </div>
          {onClose && (<UIButton variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0"><X className="h-4 w-4" /></UIButton>)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">ID: {room.id}</Badge>
        </div>
      </CardContent>
    </UICard>
  );
}

export const Column = ({ title = 'Room', id }: { title?: string; id?: string }) => {
  const { data: room, loading, error } = useQuery({ table: 'rooms', pk_columns: { id }, returning: ['id','title','user_id','allow_select_users','allow_change_users','allow_reply_users','allow_remove_users','allow_delete_users','created_at','updated_at'] }, { skip: !id, role: 'user' });
  if (!id) return <div className="p-3 text-sm text-muted-foreground">No room selected</div>;
  if (loading) return <div className="p-3 text-sm text-muted-foreground">Loading…</div>;
  if (error || !room) return <div className="p-3 text-sm text-destructive">Failed to load room</div>;
  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Room room={room as any} />
      </div>
    </div>
  );
};
