"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { Button } from 'hasyx/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'hasyx/components/ui/select';
import { useTranslations } from 'hasyx';

type ConfigObject = Record<string, any>;

type UISchemaSection = {
  key: string;
  type: 'variant' | 'keys';
  title?: string;
  description?: string;
  fields?: Array<{
    key: string;
    label: string;
    description?: string;
    kind: 'string' | 'number' | 'boolean' | 'reference';
    referenceKey?: string;
    isRequired?: boolean;
    enumValues?: string[];
    defaultValue?: any;
  }>;
};

async function fetchConfig(): Promise<{ config: ConfigObject; schema: any; ui: { sections: UISchemaSection[] } }> {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load config');
  const data = await res.json();
  return { config: data?.config || {}, schema: data?.schema, ui: data?.ui };
}

async function saveConfig(config: ConfigObject): Promise<void> {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ? JSON.stringify(err.error) : 'Failed to save config');
  }
}

export function HasyxConfigForm() {
  const t = useTranslations();
  const [config, setConfig] = useState<ConfigObject | null>(null);
  const [jsonSchema, setJsonSchema] = useState<any | null>(null);
  const [formData, setFormData] = useState<ConfigObject | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [ui, setUi] = useState<{ sections: UISchemaSection[] } | null>(null);

  type ViewState =
    | { name: 'root' }
    | { name: 'variant' }
    | { name: 'keys'; sectionKey: string }
    | { name: 'keyForm'; sectionKey: string; keyName: string }
    | { name: 'variantForm'; keyName: string };

  const [view, setView] = useState<ViewState>({ name: 'root' });

  const uiSchema = useMemo(() => ({
    'ui:submitButtonOptions': { norender: true },
  }), []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchConfig();
      // Debug logs for investigation in browser console
      // eslint-disable-next-line no-console
      console.log('[HasyxConfigForm] schema (server):', data.schema);
      setConfig(data.config);
      setFormData(data.config);
      setJsonSchema(data.schema);
      setUi(data.ui || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = useCallback(async (next: ConfigObject) => {
    setSaving(true);
    setError(null);
    try {
      // Resolve $ref in JSON Schema
      function resolveRef(root: any, node: any): any {
        if (!node) return node;
        if (node.$ref && typeof node.$ref === 'string') {
          const path = node.$ref.replace(/^#\//, '').split('/');
          let cur: any = root;
          for (const p of path) {
            if (cur && typeof cur === 'object') cur = cur[p];
          }
          return cur || node;
        }
        return node;
      }

      // Compute required fields for a keys section from UI metadata when JSON Schema doesn't expose them
      function getRequiredFromUI(sectionKey: string): string[] {
        const fields = ui?.sections?.find(s => s.key === sectionKey)?.fields || [];
        return fields.filter((f: any) => f.isRequired).map((f: any) => f.key);
      }

      // Normalize top-level: ensure all schema-defined properties exist; map legacy aliases
      function normalizeTopLevel(cfg: any, schema: any): any {
        const result: any = {};
        const props = (schema && (schema as any).properties) || {};
        // legacy alias: telegram -> telegramBot
        const aliasedCfg = { ...cfg };
        if (aliasedCfg.telegram && !aliasedCfg.telegramBot) {
          aliasedCfg.telegramBot = aliasedCfg.telegram;
          delete aliasedCfg.telegram;
        }
        // copy known keys, initialize missing
        for (const key of Object.keys(props)) {
          const prop = (props as any)[key];
          const isKeysCollection = prop && prop.type === 'object' && !!prop.additionalProperties;
          if (aliasedCfg[key] !== undefined) {
            result[key] = aliasedCfg[key];
          } else if (isKeysCollection) {
            result[key] = {};
          } else if (key === 'variant') {
            result[key] = aliasedCfg[key] ?? '';
          } else {
            result[key] = aliasedCfg[key];
          }
        }
        return result;
      }

      // Prune invalid keys entries according to JSON Schema additionalProperties.required and drop unknown root keys
      function pruneConfig(cfg: any, schema: any): any {
        if (!schema || !schema.properties) return cfg;
        const updated: any = normalizeTopLevel(cfg, schema);

        for (const [sectionKey, sectionSchema] of Object.entries<any>(schema.properties)) {
          const sectionValue = (updated as any)[sectionKey];
          if (!sectionValue) continue;
          const apRaw = (sectionSchema as any).additionalProperties;
          const ap = resolveRef(schema, apRaw);
          if ((sectionSchema as any).type === 'object' && ap && typeof ap === 'object') {
            let required: string[] = Array.isArray((ap as any).required) ? (ap as any).required : [];
            if (!required || required.length === 0) {
              // fallback to UI metadata
              required = getRequiredFromUI(sectionKey);
            }
            if (required.length === 0 && (ap as any).properties && typeof (ap as any).properties === 'object') {
              // If JSON Schema uses property-level required, prefer it (already read above). Otherwise leave empty
            }
            const newSection: Record<string, any> = {};
            for (const [k, v] of Object.entries<any>(sectionValue)) {
              if (!v || typeof v !== 'object') continue;
              const hasAllRequired = required.every((r) => v[r] !== undefined && v[r] !== null && v[r] !== '');
              if (hasAllRequired || required.length === 0) {
                newSection[k] = v;
              }
            }
            (updated as any)[sectionKey] = newSection;
          }
        }
        return updated;
      }

      const cleaned = pruneConfig(next, jsonSchema);
      await saveConfig(cleaned);
      setConfig(cleaned);
      setFormData(cleaned);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }, []);

  // Auto-save on change with debounce, no explicit Save/Reload buttons
  useEffect(() => {
    if (!dirty || !formData) return;
    const id = setTimeout(() => {
      handleSave(formData);
    }, 500);
    return () => clearTimeout(id);
  }, [dirty, formData, handleSave]);

  // Helpers
  const getCount = (sectionKey: string) => {
    const value = (formData as any)[sectionKey];
    if (value && typeof value === 'object') return Object.keys(value).length;
    if (Array.isArray(value)) return value.length;
    return value ? 1 : 0;
  };

  const getVariantSummary = () => {
    const vKey = (formData as any).variant as string | undefined;
    const variants = (formData as any).variants || {};
    if (vKey && variants[vKey]) {
      const v = variants[vKey];
      const host = v?.host || 'no host';
      const hasura = v?.hasura || 'no hasura';
      return `${vKey}: ${host} -> ${hasura}`;
    }
    return String(vKey || 'not set');
  };

  const rootSections: UISchemaSection[] = useMemo(() => ui?.sections || [], [ui]);

  // Save helpers for nested editors
  const updateConfig = useCallback((next: any) => {
    setFormData(next);
    setDirty(true);
  }, []);

  if (!config || !jsonSchema || !formData) {
    return <div style={{ padding: 16 }}>{t('config.loading')}</div>;
  }

  // Views
  const renderRoot = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Variant selector entry */}
        <Card className="cursor-pointer" onClick={() => setView({ name: 'variant' })}>
          <CardHeader>
            <CardTitle>{t('config.variant')}</CardTitle>
            <CardDescription>{getVariantSummary()}</CardDescription>
          </CardHeader>
        </Card>

        {/* Keys sections */}
        {rootSections.filter(s => s.type === 'keys').map((s) => (
          <Card key={s.key} className="cursor-pointer" onClick={() => setView({ name: 'keys', sectionKey: s.key })}>
            <CardHeader>
              <CardTitle>{s.key}</CardTitle>
              <CardDescription>{t('config.items', { count: getCount(s.key) })}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  const renderVariant = () => {
    const variants = Object.keys((formData as any).variants || {});
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView({ name: 'root' })}>{t('config.back')}</Button>
          <div className="text-xl font-semibold">{t('config.selectVariant')}</div>
        </div>
        <div className="max-w-sm">
          <Select value={(formData as any).variant || ''} onValueChange={(value) => {
            const next = { ...(formData as any), variant: value };
            updateConfig(next);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('config.pickVariant')} />
            </SelectTrigger>
            <SelectContent>
              {variants.map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderKeys = (sectionKey: string) => {
    const entries = Object.keys(((formData as any)[sectionKey]) || {});
    const handleAdd = () => {
      const name = prompt(`New ${sectionKey} key name`);
      if (!name) return;
      const next = { ...(formData as any) };
      next[sectionKey] = { ...(next[sectionKey] || {}), [name]: {} };
      updateConfig(next);
    };
    const handleDelete = (keyName: string) => {
      const next = { ...(formData as any) };
      const { [keyName]: _removed, ...rest } = next[sectionKey] || {};
      next[sectionKey] = rest;
      updateConfig(next);
    };
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView({ name: 'root' })}>{t('config.back')}</Button>
          <div className="text-xl font-semibold">{sectionKey}</div>
          <div className="ml-auto">
            <Button onClick={handleAdd}>{t('config.add')}</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {entries.map((k) => (
            <Card key={k}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{k}</CardTitle>
                  <CardDescription>{t('config.editSection', { section: sectionKey })}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setView({ name: 'keyForm', sectionKey, keyName: k })}>{t('config.open')}</Button>
                  <Button variant="destructive" onClick={() => handleDelete(k)}>{t('config.delete')}</Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderKeyForm = (sectionKey: string, keyName: string) => {
    // Per-key schema is additionalProperties of section
    const rootSchema: any = jsonSchema as any;
    const sectionSchema = rootSchema?.properties?.[sectionKey];
    // Prefer UI meta to build a clean object schema for RJSF when Zod adapters confuse types
    const metaFields = ui?.sections?.find(s => s.key === sectionKey)?.fields;
    let itemSchema: any = sectionSchema?.additionalProperties || { type: 'object' };
    if (Array.isArray(metaFields) && metaFields.length > 0) {
      const properties: Record<string, any> = {};
      const required: string[] = [];
      for (const f of metaFields) {
        let fieldSchema: any = {};
        if (f.kind === 'boolean') fieldSchema = { type: 'boolean' };
        else if (f.kind === 'number') fieldSchema = { type: 'number' };
        else if (f.kind === 'reference') fieldSchema = { type: 'string', enum: Object.keys(((formData as any)[f.referenceKey || ''] || {})) };
        else fieldSchema = { type: 'string' };
        if (Array.isArray((f as any).enumValues) && (f as any).enumValues.length > 0) {
          fieldSchema.enum = (f as any).enumValues;
        }
        if ((f as any).defaultValue !== undefined) {
          fieldSchema.default = (f as any).defaultValue;
        }
        properties[f.key] = fieldSchema;
        if (f.isRequired) required.push(f.key);
      }
      itemSchema = { type: 'object', properties, additionalProperties: false };
      if (required.length > 0) itemSchema.required = required;
    }
    // Provide root definitions to allow $ref resolution inside item schema
    const defs = (rootSchema && (rootSchema.definitions || rootSchema.$defs)) || undefined;
    const schemaForForm = defs ? { ...itemSchema, definitions: defs } : itemSchema;
    const initial = (((formData as any)[sectionKey] || {})[keyName]) || {};
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView({ name: 'keys', sectionKey })}>{t('config.back')}</Button>
          <div className="text-xl font-semibold">{sectionKey} / {keyName}</div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Form
              schema={schemaForForm as any}
              formData={initial}
              validator={validator}
              uiSchema={uiSchema}
              liveValidate={true}
              showErrorList={false}
              templates={{ TitleFieldTemplate: () => null, DescriptionFieldTemplate: () => null } as any}
              onChange={(evt) => {
                const data = evt.formData as Record<string, any>;
                const next = { ...(formData as any) };
                next[sectionKey] = { ...(next[sectionKey] || {}), [keyName]: data };
                updateConfig(next);
              }}
              onError={(errs) => setError(t('config.validationErrors', { count: errs.length }))}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  // Variant details form (same as key form but fixed section = 'variants')
  const renderVariantForm = (keyName: string) => {
    const sectionKey = 'variants';
    return renderKeyForm(sectionKey, keyName);
  };

  // When in keys view for 'variants', clicking Open should navigate to variantForm
  const effectiveView = ((): ViewState => {
    if (view.name === 'keyForm' && view.sectionKey === 'variants') {
      return { name: 'variantForm', keyName: view.keyName };
    }
    return view;
  })();

  return (
    <div className="flex flex-col gap-3">
      {effectiveView.name === 'root' && renderRoot()}
      {effectiveView.name === 'variant' && renderVariant()}
      {effectiveView.name === 'keys' && renderKeys(effectiveView.sectionKey)}
      {effectiveView.name === 'keyForm' && renderKeyForm(effectiveView.sectionKey, effectiveView.keyName)}
      {effectiveView.name === 'variantForm' && renderVariantForm(effectiveView.keyName)}

      <div className="text-sm text-muted-foreground min-h-5">
        {saving && <span>{t('config.saving')}</span>}
        {!saving && dirty && !error && <span>{t('config.changesSaved')}</span>}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}

export default HasyxConfigForm;