import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createApolloClient } from '../apollo/apollo';
import { Hasyx } from '../hasyx/hasyx';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { hasyxConfig } from '../config';
import { generateEnv } from '../config/env';
import { generateDockerCompose } from '../config/docker-compose';
import { zodToJsonSchema } from 'zod-to-json-schema';

const CONFIG_FILENAME = 'hasyx.config.json';
function getConfigFilePath(): string { return path.join(process.cwd(), CONFIG_FILENAME); }
function readConfig(): any { const p = getConfigFilePath(); if (!fs.existsSync(p)) return {}; try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; } }
function writeConfig(config: any) { fs.writeFileSync(getConfigFilePath(), JSON.stringify(config, null, 2)); }

async function assertAdmin(authOptions: any): Promise<{ ok: true; userId: string } | { ok: false; status: number; message: string }>{
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id;
    if (!userId) return { ok: false, status: 401, message: 'Unauthorized: no session' };
    const apollo = createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET });
    const hasyx = new Hasyx(apollo, Generator(schema as any));
    const isAdmin = await hasyx.isAdmin(userId);
    if (!isAdmin) return { ok: false, status: 403, message: 'Forbidden: user is not admin' };
    return { ok: true, userId };
  } catch { return { ok: false, status: 500, message: 'Internal error during admin check' }; }
}

export async function handleConfigGET(authOptions: any) {
  const admin = await assertAdmin(authOptions);
  if (!admin.ok) return NextResponse.json({ ok: false, error: admin.message }, { status: admin.status });
  const config = readConfig();
  const fileSchema = (hasyxConfig as any).file as z.ZodSchema<any>;
  let schemaJson: any | null = null;
  try { const maybe = (z as any).toJSONSchema; if (typeof maybe === 'function') schemaJson = maybe(fileSchema as any, { target: 'draft-7', reused: 'inline' }); } catch {}
  if (!schemaJson) {
    try { schemaJson = zodToJsonSchema(fileSchema as any, { name: 'HasyxConfig', $refStrategy: 'none' } as any); } catch { schemaJson = zodToJsonSchema(fileSchema as any, 'HasyxConfig' as any); }
    if (schemaJson && schemaJson.$ref) {
      const name = String(schemaJson.$ref).split('/').pop();
      const defs = (schemaJson as any).definitions || (schemaJson as any).$defs;
      if (name && defs && defs[name]) schemaJson = { ...defs[name], definitions: defs };
    }
  }
  function adapt(node: any): any {
    if (!node || typeof node !== 'object') return node;
    if (node.type === 'reference-selector') {
      const referenceKey = node.referenceKey || node.data;
      const choices = referenceKey && config && typeof config === 'object' ? Object.keys((config as any)[referenceKey] || {}) : [];
      const adapted: any = { type: 'string' };
      if (choices.length > 0) adapted.enum = choices;
      if (node.title) adapted.title = node.title;
      if (node.description) adapted.description = node.description;
      return adapted;
    }
    if (node.type === 'keys') {
      const addSchema = node.add ? adapt(node.add) : { type: 'object' };
      const adapted: any = { type: 'object', additionalProperties: addSchema, propertyNames: { type: 'string' } };
      if (node.title) adapted.title = node.title;
      if (node.description) adapted.description = node.description;
      return adapted;
    }
    if (node.type === 'variant-editor') {
      const props = node.properties || {};
      const adaptedProps: any = {};
      for (const [k, v] of Object.entries(props)) adaptedProps[k] = adapt(v);
      const adapted: any = { type: 'object', properties: adaptedProps, additionalProperties: false };
      if (Array.isArray(node.required)) adapted.required = node.required;
      if (node.title) adapted.title = node.title;
      if (node.description) adapted.description = node.description;
      return adapted;
    }
    const copy: any = Array.isArray(node) ? [] : { ...node };
    if (copy.properties && typeof copy.properties === 'object') {
      const nextProps: any = {};
      for (const [k, v] of Object.entries(copy.properties)) nextProps[k] = adapt(v);
      copy.properties = nextProps;
    }
    if (copy.items) copy.items = adapt(copy.items);
    if (copy.additionalProperties && typeof copy.additionalProperties === 'object') copy.additionalProperties = adapt(copy.additionalProperties);
    return copy;
  }
  const adaptedSchema = adapt(schemaJson);
  type FieldDef = { key: string; label: string; description?: string; kind: 'string' | 'number' | 'boolean' | 'reference'; referenceKey?: string; isRequired?: boolean; enumValues?: Array<string | number>; defaultValue?: any; };
  function unwrap(field: any): any {
    let current: any = field;
    for (let i = 0; i < 6; i++) {
      if (!current || typeof current !== 'object') break;
      const def: any = current._def || {};
      if (current instanceof z.ZodOptional || current instanceof z.ZodNullable || current instanceof z.ZodDefault) { current = def.innerType || def.type || current; continue; }
      if (def.type && def.type._def) { current = def.type; continue; }
      if (def.schema && def.schema._def) { current = def.schema; continue; }
      break;
    }
    return current;
  }
  function getKind(field: any): FieldDef['kind'] { const base = unwrap(field); const meta = typeof (base as any)?.meta === 'function' ? (base as any).meta() : {}; if (meta?.type === 'reference-selector') return 'reference'; if (base instanceof z.ZodBoolean) return 'boolean'; if (base instanceof z.ZodNumber) return 'number'; return 'string'; }
  function extractFieldsFromObjectSchema(obj: any): FieldDef[] {
    if (!(obj instanceof z.ZodObject)) return [];
    const shape: Record<string, any> = (obj as any).shape || {};
    const meta = typeof (obj as any).meta === 'function' ? (obj as any).meta() : {};
    const orderedKeys: string[] = Array.isArray((meta as any)?.fields) ? (meta as any).fields.filter((k: any) => typeof k === 'string' && shape[k]) : Object.keys(shape);
    const result: FieldDef[] = [];
    for (const key of orderedKeys) {
      const fieldSchema: any = shape[key];
      const base = unwrap(fieldSchema);
      const fMeta = typeof fieldSchema?.meta === 'function' ? fieldSchema.meta() : (typeof base?.meta === 'function' ? base.meta() : {});
      const kind = getKind(fieldSchema);
      const isOptional = (fieldSchema instanceof z.ZodOptional) || (fieldSchema instanceof z.ZodNullable);
      let enumValues: Array<string | number> | undefined;
      if (base && (base as any)._def) enumValues = (base as any)._def?.values || (base as any)._def?.options || (base as any).options || (base as any).enum || undefined;
      let defaultValue: any = undefined;
      if (fieldSchema instanceof z.ZodDefault) defaultValue = (fieldSchema as any)._def?.defaultValue;
      result.push({ key, label: (fMeta as any)?.title || key, description: (base as any)?._def?.description || (fMeta as any)?.description, kind, referenceKey: (fMeta as any)?.referenceKey, isRequired: !isOptional, enumValues, defaultValue });
    }
    return result;
  }
  function serializeUI(root: any) { const sections: Array<{ key: string; type: 'variant' | 'keys'; title?: string; description?: string; fields?: FieldDef[] }>=[]; if (!(root instanceof z.ZodObject)) return { sections }; const rootShape: Record<string, any> = (root as any).shape || {}; for (const [key, sch] of Object.entries<any>(rootShape)) { const meta = typeof sch?.meta === 'function' ? sch.meta() : {}; if ((meta as any)?.type === 'reference-selector') { sections.push({ key, type: 'variant', title: (meta as any)?.title || key, description: (meta as any)?.description }); continue; } const schMeta = typeof sch?.meta === 'function' ? sch.meta() : {}; if ((schMeta as any)?.type === 'keys') { const add = (schMeta as any)?.add; let fields: FieldDef[] | undefined; if (add) { const addMeta = typeof add?.meta === 'function' ? add.meta() : {}; if ((addMeta as any)?.type === 'variant-editor' && add instanceof z.ZodObject) fields = extractFieldsFromObjectSchema(add); else if (add instanceof z.ZodObject) fields = extractFieldsFromObjectSchema(add); } sections.push({ key, type: 'keys', title: (schMeta as any)?.title || key, description: (schMeta as any)?.description, fields }); } } return { sections }; }
  const ui = serializeUI(fileSchema);
  return NextResponse.json({ ok: true, config, schema: adaptedSchema, ui });
}

export async function handleConfigPOST(req: NextRequest, authOptions: any) {
  const admin = await assertAdmin(authOptions);
  if (!admin.ok) return NextResponse.json({ ok: false, error: admin.message }, { status: admin.status });
  const body = await req.json();
  const candidate = (body as any)?.config ?? body;
  const schemaZ = (hasyxConfig as any).file as z.ZodSchema<any>;
  const parsed = schemaZ.safeParse(candidate);
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  writeConfig(parsed.data);
  try { generateEnv(); } catch {}
  try { generateDockerCompose(); } catch {}
  return NextResponse.json({ ok: true });
}


