"use client";

import sidebar from "@/app/sidebar";
import { SidebarLayout } from "hasyx/components/sidebar/layout";
import { useTranslations } from 'hasyx';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useHasyx } from 'hasyx';
import { options } from 'hasyx/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "hasyx/components/ui/card";
import { Button } from "hasyx/components/ui/button";
import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { z } from 'zod';
import Files from '@/components/files/files';
import { MultiSelectHasyx } from 'hasyx/components/multi-select-hasyx';

export default function ValidationPage() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const hasyx = useHasyx();

  const userId = session?.user?.id as string | undefined;

  const userSchema = useMemo(() => {
    const schema = (options as any)?.users;
    // console.log('[validation/page] userSchema raw', schema);
    // console.log('[validation/page] userSchema shape', (schema as any)?.def?.shape);
    return schema;
  }, []);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // console.log('[validation/page] render', { status, userId, hasUserSchema: Boolean(userSchema) });


  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!userId) return;
      // console.log('[validation/page] load start', { userId });
      setLoading(true);
      setError(null);
      try {
        const rows = await hasyx.select<any>({
          table: 'options',
          where: { item_id: { _eq: userId } },
          returning: ['id','key','string_value','number_value','boolean_value','jsonb_value','to_id']
        });
        // console.log('[validation/page] load rows', rows);
        if (cancelled) return;
        const map: Record<string, any> = {};
        const props: any = (jsonSchema as any)?.properties || {};
        for (const row of (rows || [])) {
          const k = row.key as string;
          const isArray = (props[k] as any)?.type === 'array';
          if (row.to_id != null) {
            if (isArray) {
              if (!Array.isArray(map[k])) map[k] = [];
              (map[k] as any[]).push(row.to_id);
            } else {
              map[k] = row.to_id;
            }
          } else if (row.jsonb_value != null) {
            map[k] = row.jsonb_value;
          } else if (row.string_value != null) {
            map[k] = row.string_value;
          } else if (row.number_value != null) {
            map[k] = row.number_value;
          } else if (row.boolean_value != null) {
            map[k] = row.boolean_value;
          }
        }
        // console.log('[validation/page] setFormData from load', map);
        setFormData(map);
      } catch (e: any) {
        setError(e?.message || 'Failed to load options');
        // console.log('[validation/page] load error', e);
      } finally {
        if (!cancelled) setLoading(false);
        // console.log('[validation/page] load end');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId, hasyx]);

  const jsonSchema = useMemo(() => {
    try {
      const toJSONSchema = (z as any).toJSONSchema;
      if (typeof toJSONSchema === 'function' && userSchema) {
        const s: any = toJSONSchema(userSchema, { target: 'draft-07' });
        const props: any = s?.properties || {};
        // Post-process using JSON Schema custom keys produced by z.toJSONSchema
        Object.keys(props).forEach((key) => {
          const p: any = props[key] || {};
          if (p?.multiple === true) {
            // Convert to array schema and move original into items
            const { multiple, ...rest } = p;
            props[key] = { type: 'array', items: { ...rest } };
          }
        });
        // console.log('[validation/page] jsonSchema generated (zod v4)', s);
        return s;
      }
    } catch (e) {
      // console.log('[validation/page] toJSONSchema failed, falling back', e);
    }
    return { type: 'object', properties: {} } as any;
  }, [userSchema]);

  // Build uiSchema from generated JSON Schema (custom keys: widget, multiple)
  const uiSchema = useMemo(() => {
    const ui: any = {};
    try {
      const props: any = (jsonSchema as any)?.properties || {};
      Object.keys(props).forEach((key) => {
        const p: any = props[key] || {};
        if (!ui[key]) ui[key] = {};
        if (p?.widget === 'file-id') {
          ui[key]['ui:field'] = 'avatar-file-id';
        }
        if (p?.type === 'array') {
          ui[key]['ui:options'] = { addable: true, removable: true, orderable: false };
          ui[key]['ui:field'] = 'friend-ids';
        }
      });
    } catch {}
    // console.log('[validation/page] uiSchema generated', ui);
    return ui;
  }, [jsonSchema]);

  // Custom widgets for special fields
  const widgets = useMemo(() => {
    const FileIdWidget = (props: any) => {
      const { value, onChange, disabled } = props;
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">User avatar file id (uuid from storage.files)</div>
          {value ? (
            <div className="bg-card/50 border rounded-lg p-3">
              <div className="text-sm">File ID: <span className="font-mono">{value}</span></div>
              <div className="mt-2 flex items-center gap-2">
                <Button type="button" variant="secondary" disabled={disabled}>Replace</Button>
                <Button type="button" variant="ghost" onClick={() => onChange?.(undefined)} disabled={disabled}>Clear</Button>
              </div>
            </div>
          ) : (
            <Files
              multiple={false}
              disabled={disabled}
              onUploadComplete={(fileId) => {
                // console.log('[validation/page] file-id upload complete', fileId);
                onChange?.(fileId);
              }}
              onUploadError={(err) => {
                console.error('[validation/page] file-id upload error', err);
              }}
            >
              <Button type="button" variant="secondary" disabled={disabled}>Upload avatar</Button>
            </Files>
          )}
        </div>
      );
    };
    return { 'file-id': FileIdWidget } as any;
  }, []);

  // Custom fields
  const fields = useMemo(() => {
    const AvatarFileField = (props: any) => {
      const { formData, onChange, disabled, schema } = props;
      const value = formData as string | undefined;
      const [fileMeta, setFileMeta] = useState<any | null>(null);
      const isImage = (mime?: string) => typeof mime === 'string' && mime.startsWith('image/');

      useEffect(() => {
        let active = true;
        async function fetchMeta() {
          try {
            if (!value) { if (active) setFileMeta(null); return; }
            const row = await hasyx.select<any>({
              table: 'files',
              pk_columns: { id: value },
              returning: ['id','name','size','mimeType','createdAt','isUploaded']
            });
            if (active) setFileMeta(row || null);
          } catch {
            if (active) setFileMeta(null);
          }
        }
        fetchMeta();
        return () => { active = false; };
      }, [value, hasyx]);

      return (
        <div className="space-y-3">
          {schema?.title && <div className="font-medium">{schema.title}</div>}
          {schema?.description && (
            <div className="text-xs text-muted-foreground">{schema.description}</div>
          )}

          {value ? (
            <div className="flex items-center gap-3 bg-card/50 border rounded-lg p-3">
              {isImage(fileMeta?.mimeType) ? (
                <img
                  src={`/api/files/${value}`}
                  alt={fileMeta?.name || value}
                  className="w-12 h-12 object-cover rounded border"
                />
              ) : (
                <div className="w-12 h-12 rounded border flex items-center justify-center text-lg">📄</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" title={fileMeta?.name || value}>{fileMeta?.name || value}</div>
                <div className="text-xs text-muted-foreground">{fileMeta?.mimeType || 'file'}{fileMeta?.size ? ` • ${fileMeta.size} B` : ''}</div>
              </div>
              <div className="flex items-center gap-2">
                <Files
                  multiple={false}
                  disabled={disabled}
                  onUploadComplete={(fileId) => onChange?.(fileId)}
                >
                  <Button type="button" variant="secondary" disabled={disabled}>Replace</Button>
                </Files>
                <Button type="button" variant="ghost" onClick={() => onChange?.(undefined)} disabled={disabled}>Clear</Button>
              </div>
            </div>
          ) : (
            <Files
              multiple={false}
              disabled={disabled}
              onUploadComplete={(fileId) => onChange?.(fileId)}
            >
              <Button type="button" variant="secondary" disabled={disabled}>Upload avatar</Button>
            </Files>
          )}
        </div>
      );
    };

    const FriendIdsArrayField = (props: any) => {
      const { formData, onChange, disabled, schema } = props;
      const values: string[] = Array.isArray(formData) ? formData : [];
      // console.log('[validation/page] FriendIdsArrayField render', { 
      //   values, 
      //   formData, 
      //   propsKeys: Object.keys(props),
      //   schemaTitle: schema?.title 
      // });

      return (
        <div className="space-y-2">
          {schema?.title && <div className="font-medium">{schema.title}</div>}
          {schema?.description && (
            <div className="text-xs text-muted-foreground">{schema.description}</div>
          )}
          <MultiSelectHasyx
            value={values}
            onValueChange={(v) => {
              // console.log('[validation/page] friend_id onValueChange', v);
              onChange?.(v);
            }}
            placeholder="Select friends..."
            queryGenerator={(search: string) => ({
              table: 'users',
              where: search && search.length >= 2 ? { name: { _ilike: `%${search}%` } } : {},
              returning: ['id','name'],
              limit: search && search.length >= 2 ? 10 : 50,
            })}
            selectedQueryGenerator={(ids: string[]) => ({
              table: 'users',
              where: { id: { _in: ids } },
              returning: ['id','name'],
              limit: ids.length,
            })}
          />
        </div>
      );
    };
    const fields = { 'friend-ids': FriendIdsArrayField, 'avatar-file-id': AvatarFileField };
    // console.log('[validation/page] fields generated', Object.keys(fields));
    return fields as any;
  }, []);

  const save = async () => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Persist per key: delete existing and insert new values
      const keysToSave = Object.keys((jsonSchema as any)?.properties || {}).filter((k) => (formData as any)[k] !== undefined);
      // console.log('[validation/page] save start', { keysToSave, formData });
      if (keysToSave.length === 0) return;

      // Prepare inserts (compute payloads first for logging)
      const inserts: any[] = [];
      const props: any = (jsonSchema as any)?.properties || {};
      for (const key of keysToSave) {
        const val = (formData as any)[key];
        if (val == null || val === '' || (Array.isArray(val) && val.length === 0)) continue;

        const isArray = (props[key] as any)?.type === 'array';
        if (key === 'avatar') {
          inserts.push({ key, item_id: userId, to_id: val });
          continue;
        }
        if (key === 'friend_id' && isArray) {
          const list: any[] = Array.isArray(val) ? val : [val].filter(Boolean);
          for (const toId of list) {
            inserts.push({ key, item_id: userId, to_id: toId });
          }
          continue;
        }

        if (key === 'notifications') {
          inserts.push({ key, item_id: userId, jsonb_value: val });
          continue;
        }

        // default string field
        inserts.push({ key, item_id: userId, string_value: val });
      }

      // console.log('[validation/page] inserts', inserts);
      // Удаляем отсутствующие ключи в форме (например, avatar = undefined → удалить опцию)
      const schemaProps: any = (jsonSchema as any)?.properties || {};
      const allKeys = Object.keys(schemaProps);
      for (const key of allKeys) {
        if ((formData as any)[key] === undefined) {
          // console.log('[validation/page] key missing in formData, deleting existing', key);
          await hasyx.delete({ table: 'options', where: { item_id: { _eq: userId }, key: { _eq: key } } });
        }
      }

      if (inserts.length > 0) {
        // Delete once per key that we are inserting, then insert
        const deletedKeys = new Set<string>();
        for (const obj of inserts) {
          try {
            if (!deletedKeys.has(obj.key)) {
              // console.log('[validation/page] deleting existing for key', obj.key);
              await hasyx.delete({
                table: 'options',
                where: { item_id: { _eq: userId }, key: { _eq: obj.key } },
              });
              deletedKeys.add(obj.key);
            }
            // console.log('[validation/page] inserting', obj);
            await hasyx.insert({ table: 'options', object: obj, returning: ['id'] });
            // console.log('[validation/page] insert ok', obj.key);
          } catch (e: any) {
            const details = (e && (e.details || e.cause || e.graphQLErrors)) || null;
            // console.log('[validation/page] insert error', obj.key, e?.message, details);
            throw e;
          }
        }
        // console.log('[validation/page] all inserts done');
      }

      setSuccess('Saved');
    } catch (e: any) {
      setError(e?.message || 'Save failed');
      // console.log('[validation/page] save error', e);
    } finally {
      setSaving(false);
      // console.log('[validation/page] save end');
    }
  };

  return (
    <SidebarLayout sidebarData={sidebar} breadcrumb={[
      { title: 'Hasyx', link: '/' },
      { title: t('nav.validation'), link: '/hasyx/validation' }
    ]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t('pages.validation.title')}</h1>
          <p className="text-muted-foreground">{t('pages.validation.description')}</p>
        </div>

        {status === 'loading' && (
          <Card>
            <CardHeader>
              <CardTitle>Loading…</CardTitle>
              <CardDescription>Please wait while we prepare your form.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {status !== 'loading' && !userId && (
          <Card>
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>Please sign in to edit your profile options.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {userId && (
          <Card>
            <CardHeader>
              <CardTitle>User options</CardTitle>
              <CardDescription>Edit your profile properties defined in schema.tsx</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                schema={jsonSchema as any}
                uiSchema={uiSchema as any}
                widgets={widgets as any}
                fields={fields as any}
                formData={formData}
                onChange={(e: any) => { 
                  console.log('[validation/page] onChange', e.formData); 
                  setFormData(e.formData || {}); 
                }}
                onSubmit={(e: any) => { 
                  console.log('[validation/page] onSubmit', e.formData); 
                  setFormData(e.formData || {}); 
                  save(); 
                }}
                validator={validator}
                liveValidate={false}
              >
                <div className="mt-4 flex items-center gap-3">
                  <Button type="submit" disabled={saving || loading}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                  {error && <span className="text-red-600 text-sm">{error}</span>}
                  {success && <span className="text-green-600 text-sm">{success}</span>}
                </div>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarLayout>
  );
}
