'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useHasyx, useTranslations } from 'hasyx';
import { Button } from 'hasyx/components/ui/button';
import { Input } from 'hasyx/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Separator } from 'hasyx/components/ui/separator';
import { toast } from 'sonner';

type InviteRow = { id: string; code: string; created_at?: any; updated_at?: any; user_id: string };
type InvitedRow = { id: string; invite_id: string; user_id: string; created_at: number };

export default function InvitesCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations('diagnostics.invites');
  const hasyx = useHasyx();
  const [loading, setLoading] = useState(false);
  const [createCode, setCreateCode] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [myInvites, setMyInvites] = useState<InviteRow[]>([]);
  const [myInvited, setMyInvited] = useState<InvitedRow[]>([]);
  const [allInvites, setAllInvites] = useState<InviteRow[]>([]);
  const [allInvited, setAllInvited] = useState<InvitedRow[]>([]);

  const userId = useMemo(() => hasyx.userId, [hasyx.userId]);

  async function refresh() {
    if (!userId) return;
    setLoading(true);
    try {
      const mine = await hasyx.select<InviteRow[]>({
        table: 'invites',
        where: { user_id: { _eq: userId } },
        returning: ['id', 'code', 'created_at', 'updated_at', 'user_id'],
        role: 'me',
      });
      setMyInvites(Array.isArray(mine) ? mine : mine ? [mine as any] : []);

      const invitedMine = await hasyx.select<InvitedRow[]>({
        table: 'invited',
        where: { _or: [{ user_id: { _eq: userId } }, { invite: { user_id: { _eq: userId } } }] },
        returning: ['id', 'invite_id', 'user_id', 'created_at'],
        role: 'me',
      });
      setMyInvited(Array.isArray(invitedMine) ? invitedMine : invitedMine ? [invitedMine as any] : []);

      try {
        const allI = await hasyx.select<InviteRow[]>({
          table: 'invites',
          where: {},
          returning: ['id', 'code', 'created_at', 'updated_at', 'user_id'],
          role: (hasyx as any)?.apolloClient?._options?.secret ? 'admin' : undefined,
        });
        setAllInvites(Array.isArray(allI) ? allI : allI ? [allI as any] : []);
      } catch {}

      try {
        const allId = await hasyx.select<InvitedRow[]>({
          table: 'invited',
          where: {},
          returning: ['id', 'invite_id', 'user_id', 'created_at'],
          role: (hasyx as any)?.apolloClient?._options?.secret ? 'admin' : undefined,
        });
        setAllInvited(Array.isArray(allId) ? allId : allId ? [allId as any] : []);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [userId]);

  async function createInvite() {
    if (!userId) { toast.error('No user'); return; }
    setLoading(true);
    try {
      const res = await hasyx.insert<InviteRow>({
        table: 'invites',
        object: { user_id: userId, code: createCode || undefined },
        returning: ['id', 'code', 'created_at', 'user_id'],
        role: 'me'
      });
      toast.success(`Invite created: ${(res as any)?.code || ''}`);
      setCreateCode('');
      refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  }

  async function redeemInvite() {
    setLoading(true);
    try {
      const result = await hasyx.invite(redeemCode.trim());
      if (result?.success) {
        toast.success('Invite redeemed');
        setRedeemCode('');
        refresh();
      } else {
        toast.error(result?.message || 'Failed to redeem invite');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to redeem invite');
    } finally {
      setLoading(false);
    }
  }

  async function deleteInviteRow(id: string) {
    setLoading(true);
    try {
      await hasyx.delete({ table: 'invites', pk_columns: { id }, returning: ['id'], role: 'me' });
      toast.success('Invite deleted');
      refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete invite');
    } finally { setLoading(false); }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Invites</CardTitle>
        <CardDescription>Create, redeem, and inspect invites</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input placeholder="Custom code (optional)" value={createCode} onChange={e => setCreateCode(e.target.value)} />
          <Button disabled={loading} onClick={createInvite}>Create Invite</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Input placeholder="Invite code" value={redeemCode} onChange={e => setRedeemCode(e.target.value)} />
          <Button disabled={loading || !redeemCode.trim()} onClick={redeemInvite}>Redeem Invite</Button>
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>My invites</CardTitle>
              <CardDescription>Total: {myInvites.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myInvites.map(i => (
                  <div key={i.id} className="flex items-center justify-between border rounded-md p-2">
                    <div className="text-sm">
                      <div>Code: <b>{i.code}</b></div>
                      <div className="text-muted-foreground">id: {i.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(i.code)}>Copy</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteInviteRow(i.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
                {myInvites.length === 0 && <div className="text-sm text-muted-foreground">No invites</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My invited relations</CardTitle>
              <CardDescription>Total: {myInvited.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myInvited.map(r => (
                  <div key={r.id} className="border rounded-md p-2 text-sm">
                    <div>id: {r.id}</div>
                    <div>invite_id: {r.invite_id}</div>
                    <div>user_id: {r.user_id}</div>
                    <div>created_at: {r.created_at}</div>
                  </div>
                ))}
                {myInvited.length === 0 && <div className="text-sm text-muted-foreground">No invited records</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>All invites (admin)</CardTitle>
              <CardDescription>Total: {allInvites.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allInvites.map(i => (
                  <div key={i.id} className="border rounded-md p-2 text-sm">
                    <div>code: <b>{i.code}</b></div>
                    <div>id: {i.id}</div>
                    <div>user_id: {i.user_id}</div>
                  </div>
                ))}
                {allInvites.length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All invited (admin)</CardTitle>
              <CardDescription>Total: {allInvited.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allInvited.map(r => (
                  <div key={r.id} className="border rounded-md p-2 text-sm">
                    <div>id: {r.id}</div>
                    <div>invite_id: {r.invite_id}</div>
                    <div>user_id: {r.user_id}</div>
                    <div>created_at: {r.created_at}</div>
                  </div>
                ))}
                {allInvited.length === 0 && <div className="text-sm text-muted-foreground">—</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}


