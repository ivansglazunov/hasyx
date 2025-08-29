"use client";

import React, { useMemo, useState } from 'react';
import { useHasyx, useQuery, useTranslations } from 'hasyx';
import { Button as UIButton } from 'hasyx/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { X, Users } from 'lucide-react';
import { Input } from 'hasyx/components/ui/input';
import { Groups as GroupsApi } from 'hasyx/lib/groups/groups';

interface GroupData {
  id?: string;
  title?: string;
  visibility?: string;
  join_policy?: string;
  created_at?: string;
  updated_at?: string;
  __typename?: string;
  [key: string]: any;
}

export function Button({ data, ...props }: { data: GroupData | string; [key: string]: any; }) {
  const groupId = typeof data === 'string' ? data : data?.id;
  const groupData = typeof data === 'object' ? data : null;
  const display = groupData?.title || `Group ${groupId}`;
  return (
    <UIButton variant="outline" className="h-auto p-2 justify-start gap-2 min-w-0" {...props}>
      <Users className="w-4 h-4" />
      <span className="truncate text-xs">{display}</span>
    </UIButton>
  );
}

export function Card({ data, onClose, ...props }: { data: GroupData | string; onClose?: () => void; [key: string]: any; }) {
  const id = typeof data === 'string' ? data : data?.id;
  const provided = typeof data === 'object' ? data : null;
  const { data: fetched, loading, error } = useQuery({ table: 'groups', pk_columns: { id }, returning: ['id','title','visibility','join_policy','created_at','updated_at'] }, { skip: !id, role: 'user' });
  const group = provided || fetched;
  if (loading) return <UICard className="w-80" {...props}><CardContent className="p-4">Loading…</CardContent></UICard>;
  if (error || !group) return <UICard className="w-80" {...props}><CardContent className="p-4">Failed to load group</CardContent></UICard>;
  return (
    <UICard className="w-80" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full"><Users className="w-5 h-5" /></div>
            <div>
              <CardTitle className="text-base">{group.title || 'Group'}</CardTitle>
              {group.visibility && <p className="text-xs text-muted-foreground">{group.visibility} · {group.join_policy}</p>}
            </div>
          </div>
          {onClose && (<UIButton variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0"><X className="h-4 w-4" /></UIButton>)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">ID: {group.id}</Badge>
        </div>
      </CardContent>
    </UICard>
  );
}

export function GroupManager({ groupId, onDeleted, className }: { groupId: string; onDeleted?: () => void; className?: string }) {
  const hasyx = useHasyx();
  const groupsApi = React.useMemo(() => new GroupsApi(hasyx), [hasyx]);
  const myUserId = hasyx.userId;

  const { data: group, loading, error, refetch } = useQuery<any>({
    table: 'groups',
    pk_columns: { id: groupId },
    returning: [
      'id','title','owner_id','visibility','join_policy','updated_at',
      { memberships: ['id','user_id','role','status'] },
      { invitations: ['id','invitee_user_id','status','invited_by_id','expires_at','token'] }
    ]
  });

  const isOwner = useMemo(() => !!group && myUserId && group.owner_id === myUserId, [group, myUserId]);
  const myMembership = useMemo(() => (group?.memberships || []).find((m: any) => m.user_id === myUserId), [group, myUserId]);
  const isAdmin = useMemo(() => !!myMembership && myMembership.role === 'admin', [myMembership]);
  const canManageMembers = isOwner || isAdmin;
  const [inviteUserId, setInviteUserId] = useState('');

  const handleDeleteGroup = async () => {
    await hasyx.delete({ table: 'groups', pk_columns: { id: group.id } });
    onDeleted?.();
  };
  const handleMakeOwner = async (userId: string) => { if (!isOwner) return; await groupsApi.claimOwnership(group.id, userId); await refetch(); };
  const handleMakeAdmin = async (userId: string) => { if (!canManageMembers) return; await groupsApi.changeMemberRole(group.id, userId, 'admin'); await refetch(); };
  const handleMakeMember = async (userId: string) => { if (!canManageMembers) return; await groupsApi.changeMemberRole(group.id, userId, 'member'); await refetch(); };
  const handleRemoveMember = async (membershipId: string) => { if (!canManageMembers) return; await hasyx.delete({ table: 'memberships', where: { id: { _eq: membershipId } } }); await refetch(); };
  const handleApproveRequest = async (membershipId: string) => { if (!canManageMembers) return; await hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'approved' as unknown as string } }); await refetch(); };
  const handleDenyRequest = async (membershipId: string) => { if (!canManageMembers) return; await hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'denied' as unknown as string } }); await refetch(); };
  const handleResignOwnership = async () => { if (!isOwner) return; await groupsApi.resignOwnership(group.id); await refetch(); };
  const handleClaimOwnership = async () => { if (!isAdmin || group.owner_id) return; if (!myUserId) return; await groupsApi.claimOwnership(group.id, myUserId); await refetch(); };
  const handleInviteUser = async () => { if (!inviteUserId) return; await groupsApi.inviteUser(group.id, inviteUserId); setInviteUserId(''); await refetch(); };

  const t = useTranslations('entities.groups');
  if (loading) return <div className={className}><div className="p-3 text-sm text-muted-foreground">{t('loading')}</div></div>;
  if (error || !group) return <div className={className}><div className="p-3 text-sm text-destructive">{t('failed')}</div></div>;

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium truncate max-w-[260px]">{group.title}</div>
          <div className="text-[11px] text-muted-foreground">Owner: {group.owner_id || '—'} · {group.visibility} · {group.join_policy}</div>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {isOwner && (
            <UIButton variant="destructive" size="sm" onClick={handleDeleteGroup} className="h-7">{t('delete')}</UIButton>
          )}
          {isOwner && (
            <UIButton variant="outline" size="sm" onClick={handleResignOwnership} className="h-7">{t('resign')}</UIButton>
          )}
          {!group.owner_id && isAdmin && (
            <UIButton variant="secondary" size="sm" onClick={handleClaimOwnership} className="h-7">{t('claim')}</UIButton>
          )}
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <div>
          <div className="text-xs font-medium mb-1">{t('members')} ({group.memberships?.length || 0})</div>
          <div className="space-y-1">
            {(group.memberships || []).map((m: any) => (
              <div key={m.id} className="border rounded px-2 py-1.5 text-xs flex items-center justify-between gap-2">
                <div className="truncate">{m.user_id}</div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge variant="outline" className="text-[10px] h-5">{m.role}</Badge>
                  <Badge variant="secondary" className="text-[10px] h-5">{m.status}</Badge>
                  {canManageMembers && (
                    <>
                      <UIButton variant="outline" size="sm" className="h-6 px-2" onClick={() => handleMakeAdmin(m.user_id)}>{t('makeAdmin')}</UIButton>
                      <UIButton variant="outline" size="sm" className="h-6 px-2" onClick={() => handleMakeMember(m.user_id)}>{t('makeMember')}</UIButton>
                      <UIButton variant="destructive" size="sm" className="h-6 px-2" onClick={() => handleRemoveMember(m.id)}>{t('remove')}</UIButton>
                    </>
                  )}
                  {isOwner && m.user_id !== group.owner_id && (
                    <UIButton variant="secondary" size="sm" className="h-6 px-2" onClick={() => handleMakeOwner(m.user_id)}>{t('makeOwner')}</UIButton>
                  )}
                  {canManageMembers && m.status === 'request' && (
                    <>
                      <UIButton variant="secondary" size="sm" className="h-6 px-2" onClick={() => handleApproveRequest(m.id)}>{t('approve')}</UIButton>
                      <UIButton variant="outline" size="sm" className="h-6 px-2" onClick={() => handleDenyRequest(m.id)}>{t('deny')}</UIButton>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-1">{t('invitations')}</div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
            {(!group.invitations || group.invitations.length === 0) ? (
              <div className="text-xs text-muted-foreground">{t('noInvitations')}</div>
            ) : (
              group.invitations.map((inv: any) => (
                <div key={inv.id} className="border rounded px-2 py-1.5 text-xs flex items-center justify-between gap-2">
                  <div className="truncate">{inv.id}</div>
                  <Badge variant="outline" className="text-[10px] h-5">{inv.status}</Badge>
                </div>
              ))
            )}
          </div>
          {(isOwner || isAdmin) && (
            <div className="mt-2 flex gap-2">
              <Input placeholder={t('inviteePlaceholder')} value={inviteUserId} onChange={(e) => setInviteUserId(e.target.value)} />
              <UIButton size="sm" onClick={handleInviteUser}>{t('invite')}</UIButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Column = ({ title = 'Group', id }: { title?: string; id?: string }) => {
  if (!id) return <div className="p-3 text-sm text-muted-foreground">No group selected</div>;
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 font-medium">{title}</div>
      <div className="p-2">
        <GroupManager groupId={id} />
      </div>
    </div>
  );
};
