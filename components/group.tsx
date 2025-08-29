"use client";

import React, { useMemo, useState } from 'react';
import { useHasyx, useQuery } from 'hasyx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'hasyx/components/ui/card';
import { Button } from 'hasyx/components/ui/button';
import { Badge } from 'hasyx/components/ui/badge';
import { Separator } from 'hasyx/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'hasyx/components/ui/dialog';
import { Input } from 'hasyx/components/ui/input';
import { Label } from 'hasyx/components/ui/label';
import { ScrollArea } from 'hasyx/components/ui/scroll-area';
import { Card as UserCard } from 'hasyx/components/entities/users';
import { Groups } from 'hasyx/lib/groups/groups';

type GroupManagerProps = {
  groupId: string;
  onDeleted?: () => void;
  className?: string;
};

export function GroupManager({ groupId, onDeleted, className }: GroupManagerProps) {
  const hasyx = useHasyx();
  const groupsApi = React.useMemo(() => new Groups(hasyx), [hasyx]);
  const myUserId = hasyx.userId;

  const { data: group, loading, error, refetch } = useQuery<any>({
    table: 'groups',
    pk_columns: { id: groupId },
    returning: [
      'id', 'title', 'owner_id', 'visibility', 'join_policy', 'updated_at',
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

  const handleMakeOwner = async (userId: string) => {
    if (!isOwner) return;
    await groupsApi.claimOwnership(group.id, userId);
    await refetch();
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!canManageMembers) return;
    await groupsApi.changeMemberRole(group.id, userId, 'admin');
    await refetch();
  };

  const handleMakeMember = async (userId: string) => {
    if (!canManageMembers) return;
    await groupsApi.changeMemberRole(group.id, userId, 'member');
    await refetch();
  };

  const handleRemoveMember = async (membershipId: string) => {
    if (!canManageMembers) return;
    await hasyx.delete({ table: 'memberships', where: { id: { _eq: membershipId } } });
    await refetch();
  };

  const handleApproveRequest = async (membershipId: string) => {
    if (!canManageMembers) return;
    await hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'approved' as unknown as string } });
    await refetch();
  };

  const handleDenyRequest = async (membershipId: string) => {
    if (!canManageMembers) return;
    await hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'denied' as unknown as string } });
    await refetch();
  };

  const handleResignOwnership = async () => {
    if (!isOwner) return;
    await groupsApi.resignOwnership(group.id);
    await refetch();
  };

  const handleClaimOwnership = async () => {
    if (!isAdmin || group.owner_id) return;
    if (!myUserId) return;
    await groupsApi.claimOwnership(group.id, myUserId);
    await refetch();
  };

  const handleInviteUser = async () => {
    if (!inviteUserId) return;
    await groupsApi.inviteUser(group.id, inviteUserId);
    setInviteUserId('');
    await refetch();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading…</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  if (error || !group) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error?.message || 'Group not found'}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-medium">{group.title}</div>
          <div className="text-sm text-muted-foreground">Owner: {group.owner_id || '—'} · Visibility: {group.visibility} · Join: {group.join_policy}</div>
        </div>
        <div className="flex gap-2">
          {isOwner && (
            <Button variant="destructive" size="sm" onClick={handleDeleteGroup}>Delete group</Button>
          )}
          {isOwner && (
            <Button variant="outline" size="sm" onClick={handleResignOwnership}>Resign ownership</Button>
          )}
          {!group.owner_id && isAdmin && (
            <Button variant="secondary" size="sm" onClick={handleClaimOwnership}>Claim ownership</Button>
          )}
        </div>
      </div>

      <Separator className="my-3" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Members ({group.memberships?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[500px] pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(group.memberships || []).map((m: any) => (
                  <div key={m.id} className="border rounded p-3 space-y-2">
                    <UserCard data={m.user_id} />
                    <div className="text-sm">Role: {m.role} · Status: {m.status}</div>
                    <div className="flex flex-wrap gap-2">
                      {canManageMembers && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMakeAdmin(m.user_id)}>Make admin</Button>
                          <Button variant="outline" size="sm" onClick={() => handleMakeMember(m.user_id)}>Make member</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(m.id)}>Remove</Button>
                        </>
                      )}
                      {isOwner && m.user_id !== group.owner_id && (
                        <Button variant="secondary" size="sm" onClick={() => handleMakeOwner(m.user_id)}>Make owner</Button>
                      )}
                      {canManageMembers && m.status === 'request' && (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => handleApproveRequest(m.id)}>Approve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleDenyRequest(m.id)}>Deny</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {(!group.invitations || group.invitations.length === 0) ? (
              <div className="text-sm text-muted-foreground">No invitations</div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {group.invitations.map((inv: any) => (
                  <div key={inv.id} className="border rounded p-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm">ID: {inv.id}</div>
                      <div className="text-xs text-muted-foreground">Invitee: {inv.invitee_user_id || '—'} · Status: {inv.status}</div>
                    </div>
                    <Badge variant="outline">{inv.status}</Badge>
                  </div>
                ))}
              </div>
            )}
            {(isOwner || isAdmin) && (
              <div className="mt-3 flex gap-2">
                <Input placeholder="Invitee user id" value={inviteUserId} onChange={(e) => setInviteUserId(e.target.value)} />
                <Button size="sm" onClick={handleInviteUser}>Invite</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GroupManager;


