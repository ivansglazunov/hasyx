"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

type ConfigObject = Record<string, any>;

async function fetchConfig(): Promise<{ config: ConfigObject; schema: any }> {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load config');
  const data = await res.json();
  return { config: data?.config || {}, schema: data?.schema };
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
  const [config, setConfig] = useState<ConfigObject | null>(null);
  const [jsonSchema, setJsonSchema] = useState<any | null>(null);
  const [formData, setFormData] = useState<ConfigObject | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

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
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = useCallback(async (next: ConfigObject) => {
    setSaving(true);
    setError(null);
    try {
      // Prune invalid keys entries according to JSON Schema additionalProperties.required
      function pruneConfig(cfg: any, schema: any): any {
        if (!schema || !schema.properties) return cfg;
        const updated = { ...cfg };
        for (const [sectionKey, sectionSchema] of Object.entries<any>(schema.properties)) {
          const sectionValue = (cfg as any)[sectionKey];
          if (!sectionValue) continue;
          const ap = (sectionSchema as any).additionalProperties;
          if ((sectionSchema as any).type === 'object' && ap && typeof ap === 'object' && ap.properties) {
            const required: string[] = Array.isArray((ap as any).required) ? (ap as any).required : [];
            const newSection: Record<string, any> = {};
            for (const [k, v] of Object.entries<any>(sectionValue)) {
              if (!v || typeof v !== 'object') continue;
              const hasAllRequired = required.every((r) => v[r] !== undefined && v[r] !== null && v[r] !== '');
              if (hasAllRequired || required.length === 0) {
                newSection[k] = v;
              }
            }
            updated[sectionKey] = newSection;
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

  if (!config || !jsonSchema || !formData) {
    return <div style={{ padding: 16 }}>Loading configuration...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Form
          schema={jsonSchema as any}
          formData={formData}
          validator={validator}
          uiSchema={uiSchema}
          liveValidate={true}
          showErrorList={false}
          templates={{
            TitleFieldTemplate: () => null,
            DescriptionFieldTemplate: () => null,
          } as any}
          onChange={(evt) => {
            setFormData(evt.formData as ConfigObject);
            // Save only when there are no validation errors
            const hasErrors = Array.isArray((evt as any).errors) && (evt as any).errors.length > 0;
            setDirty(!hasErrors);
          }}
          onError={(errs) => {
            setError(`Validation errors: ${errs.length}`);
          }}
        />
        <div style={{ marginTop: 12, minHeight: 20 }}>
          {saving && <span style={{ color: '#888' }}>Saving…</span>}
          {!saving && dirty && !error && <span style={{ color: '#888' }}>Changes saved</span>}
        </div>
        {error && (
          <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
        )}
      </div>
      <div style={{ width: 360 }}>
        <pre style={{ background: '#0b0b0b', color: '#ddd', padding: 12, borderRadius: 8, overflow: 'auto', height: 'calc(100vh - 220px)' }}>
{JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default HasyxConfigForm;