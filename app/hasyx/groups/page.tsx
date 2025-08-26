'use client'

import React, { useMemo, useState } from 'react';
import sidebar from '@/app/sidebar';
import pckg from '@/package.json';
import { SidebarLayout } from 'hasyx/components/sidebar/layout';
import { useHasyx, useQuery } from 'hasyx';
import { ScrollArea } from 'hasyx/components/ui/scroll-area';
import { Button } from 'hasyx/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'hasyx/components/ui/dialog';
import { Input } from 'hasyx/components/ui/input';
import { Label } from 'hasyx/components/ui/label';
import { MultiSelectHasyx } from 'hasyx/components/multi-select-hasyx';
import { Plus } from 'lucide-react';
import { Groups } from 'hasyx/lib/groups/groups';
import { v4 as uuidv4 } from 'uuid';

export default function GroupsPage() {
  const hasyx = useHasyx();
  const groupsApi = React.useMemo(() => new Groups(hasyx), [hasyx]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    visibility: 'public' as 'public'|'private'|'secret',
    join_policy: 'by_request' as 'open'|'by_request'|'invite_only'|'closed',
    allow_view_users: [] as string[],
    allow_invite_users: [] as string[],
    allow_manage_members_users: [] as string[],
    allow_update_group_users: [] as string[],
    allow_delete_group_users: [] as string[],
    allow_request_users: [] as string[],
    allow_join_users: [] as string[],
  });

  const { data, loading, error, refetch } = useQuery({
    table: 'groups',
    returning: ['id', 'title', 'owner_id', 'visibility', 'join_policy', 'updated_at', { memberships: ['id','user_id','role','status'] }],
    limit: 100,
    order_by: { updated_at: 'desc' as const }
  });

  const groups = useMemo(() => (data as Array<any>) || [], [data]);
  const selected = useMemo(() => groups.find(g => g.id === selectedId) || groups[0], [groups, selectedId]);

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateGroup = async () => {
    if (!formData.title.trim()) return;
    setIsCreating(true);
    try {
      setCreateError(null);
      const gid = uuidv4();
      await groupsApi.createGroup({ id: gid, title: formData.title, visibility: formData.visibility, join_policy: formData.join_policy });
      const allowPayload: any = {
        allow_view_users: formData.allow_view_users,
        allow_invite_users: formData.allow_invite_users,
        allow_manage_members_users: formData.allow_manage_members_users,
        allow_update_group_users: formData.allow_update_group_users,
        allow_delete_group_users: formData.allow_delete_group_users,
        allow_request_users: formData.allow_request_users,
        allow_join_users: formData.allow_join_users,
      };
      if (allowPayload.allow_view_users.length || allowPayload.allow_invite_users.length || allowPayload.allow_manage_members_users.length || allowPayload.allow_update_group_users.length || allowPayload.allow_delete_group_users.length || allowPayload.allow_request_users.length || allowPayload.allow_join_users.length) {
        await groupsApi.updateGroup(gid, allowPayload);
      }
      setCreateDialogOpen(false);
      setFormData({
        title: '', visibility: 'public', join_policy: 'by_request',
        allow_view_users: [], allow_invite_users: [], allow_manage_members_users: [], allow_update_group_users: [], allow_delete_group_users: [], allow_request_users: [], allow_join_users: []
      });
      await refetch();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[{ title: pckg.name as string, link: '/' }] }>
      <div className="flex h-full">
        {/* Левая колонка - список групп и создание */}
        <div className="w-[300px] border-r flex flex-col">
          <div className="p-4 border-b">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-title">Title</Label>
                    <Input id="group-title" placeholder="Enter group title" value={formData.title} onChange={(e) => handleFormChange('title', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <select className="border px-3 py-2 rounded w-full" value={formData.visibility} onChange={(e) => handleFormChange('visibility', e.target.value as any)}>
                      <option value="public">public</option>
                      <option value="private">private</option>
                      <option value="secret">secret</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Join policy</Label>
                    <select className="border px-3 py-2 rounded w-full" value={formData.join_policy} onChange={(e) => handleFormChange('join_policy', e.target.value as any)}>
                      <option value="open">open</option>
                      <option value="by_request">by_request</option>
                      <option value="invite_only">invite_only</option>
                      <option value="closed">closed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Who can view</Label>
                    <MultiSelectHasyx value={formData.allow_view_users} onValueChange={(value) => handleFormChange('allow_view_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can invite</Label>
                    <MultiSelectHasyx value={formData.allow_invite_users} onValueChange={(value) => handleFormChange('allow_invite_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can manage members</Label>
                    <MultiSelectHasyx value={formData.allow_manage_members_users} onValueChange={(value) => handleFormChange('allow_manage_members_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can update group</Label>
                    <MultiSelectHasyx value={formData.allow_update_group_users} onValueChange={(value) => handleFormChange('allow_update_group_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can delete group</Label>
                    <MultiSelectHasyx value={formData.allow_delete_group_users} onValueChange={(value) => handleFormChange('allow_delete_group_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can request</Label>
                    <MultiSelectHasyx value={formData.allow_request_users} onValueChange={(value) => handleFormChange('allow_request_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Who can join immediately</Label>
                    <MultiSelectHasyx value={formData.allow_join_users} onValueChange={(value) => handleFormChange('allow_join_users', value)} placeholder={'Select users'} queryGenerator={(search) => ({ table: 'users', where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {}, returning: ['id','name'], limit: search && search.length >= 2 ? 10 : 50 })} />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateGroup} disabled={isCreating}>{isCreating ? 'Creating…' : 'Create'}</Button>
                  </div>
                  {createError && (
                    <div className="text-sm text-red-600">
                      {createError}
                    </div>
                  )}
                  {!createError && (
                    <div className="text-xs text-muted-foreground">
                      Note: creating a group requires a valid signed-in user record.
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading…</div>
              ) : groups.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No groups</div>
              ) : (
                groups.map((g) => (
                  <div key={g.id} className={`p-3 rounded-lg cursor-pointer transition-colors ${selected?.id === g.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setSelectedId(g.id)}>
                    <div className="font-medium">{g.title}</div>
                    <div className="text-sm text-muted-foreground">{g.visibility} · {g.join_policy}</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right: group panel */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {!selected && <div className="text-gray-500">Select a group…</div>}
          {selected && (
            <>
              {/* Top: group settings */}
              <div className="space-y-2">
                <div className="text-xl font-medium">{selected.title}</div>
                <div className="text-sm text-gray-600">Owner: {selected.owner_id || '—'} · Visibility: {selected.visibility} · Join: {selected.join_policy}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={async () => {
                    const newTitle = prompt('New title', selected.title) || selected.title;
                    await groupsApi.updateGroup(selected.id, { title: newTitle });
                    await refetch();
                  }}>Rename</Button>
                  <Button variant="outline" size="sm" onClick={async () => {
                    await groupsApi.deleteGroup(selected.id);
                    setSelectedId(null);
                    await refetch();
                  }}>Delete</Button>
                </div>
              </div>

              {/* Bottom: members */}
              <div className="flex-1 overflow-auto border rounded p-3 space-y-3">
                <div className="font-medium">Members ({selected.memberships?.length || 0})</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(selected.memberships || []).map((m: any) => (
                    <div key={m.id} className="border rounded p-3 space-y-2">
                      <div className="text-sm">User: {m.user_id}</div>
                      <div className="text-sm">Role: {m.role} · Status: {m.status}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={async () => {
                          await groupsApi.changeMemberRole(selected.id, m.user_id, 'admin');
                          await refetch();
                        }}>Make admin</Button>
                        <Button variant="outline" size="sm" onClick={async () => {
                          await groupsApi.leaveMembership(m.id);
                          await refetch();
                        }}>Set left</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}


