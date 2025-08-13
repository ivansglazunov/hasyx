import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import hasuraSchema from '@/app/hasyx/hasura-schema.json';
import { Generator } from 'hasyx/lib/generator';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { hasyxConfig } from 'hasyx/lib/config';
import { generateEnv } from 'hasyx/lib/config/env';
import { generateDockerCompose } from 'hasyx/lib/config/docker-compose';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const runtime = 'nodejs';

const CONFIG_FILENAME = 'hasyx.config.json';

function getConfigFilePath(): string {
  return path.join(process.cwd(), CONFIG_FILENAME);
}

function readConfig(): any {
  const configPath = getConfigFilePath();
  if (!fs.existsSync(configPath)) {
    return {};
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeConfig(config: any) {
  const configPath = getConfigFilePath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function assertAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: number; message: string }> {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id;
    if (!userId) return { ok: false, status: 401, message: 'Unauthorized: no session' };

    const apollo = createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET });
    const hasyx = new Hasyx(apollo, Generator(hasuraSchema as any));
    const isAdmin = await hasyx.isAdmin(userId);
    if (!isAdmin) return { ok: false, status: 403, message: 'Forbidden: user is not admin' };
    return { ok: true, userId };
  } catch (_e) {
    return { ok: false, status: 500, message: 'Internal error during admin check' };
  }
}

export async function GET() {
  try {
    const admin = await assertAdmin();
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.message }, { status: admin.status });
    }
    const config = readConfig();
    const fileSchema = (hasyxConfig as any).file as z.ZodSchema<any>;
    // Prefer Zod v4 native JSON Schema conversion when available
    let schema: any | null = null;
    try {
      const maybeToJSONSchema = (z as any).toJSONSchema;
      if (typeof maybeToJSONSchema === 'function') {
        schema = maybeToJSONSchema(fileSchema as any, { target: 'draft-7', reused: 'inline' });
      }
    } catch {}

    // Fallback to zod-to-json-schema if native not available
    if (!schema) {
      try {
        schema = zodToJsonSchema(fileSchema as any, { name: 'HasyxConfig', $refStrategy: 'none' } as any);
      } catch {
        schema = zodToJsonSchema(fileSchema as any, 'HasyxConfig' as any);
      }
      // If result is a $ref wrapper, inline it
      if (schema && schema.$ref) {
        const name = String(schema.$ref).split('/').pop();
        const defs = (schema as any).definitions || (schema as any).$defs;
        if (name && defs && defs[name]) {
          schema = { ...defs[name], definitions: defs };
        }
      }
    }

    // Adapt our custom meta types to standard JSON Schema for rjsf
    function adapt(node: any): any {
      if (!node || typeof node !== 'object') return node;

      // Handle reference-selector → string with enum from current config keys
      if (node.type === 'reference-selector') {
        const referenceKey = node.referenceKey || node.data;
        const choices = referenceKey && config && typeof config === 'object' ? Object.keys(config[referenceKey] || {}) : [];
        const adapted: any = { type: 'string' };
        if (choices.length > 0) {
          adapted.enum = choices;
        }
        if (node.title) adapted.title = node.title;
        if (node.description) adapted.description = node.description;
        return adapted;
      }

      // Handle keys collection → object with additionalProperties
      if (node.type === 'keys') {
        const addSchema = node.add ? adapt(node.add) : { type: 'object' };
        const adapted: any = {
          type: 'object',
          additionalProperties: addSchema,
          propertyNames: { type: 'string' },
        };
        if (node.title) adapted.title = node.title;
        if (node.description) adapted.description = node.description;
        return adapted;
      }

      // Handle variant-editor → object
      if (node.type === 'variant-editor') {
        const props = node.properties || {};
        const adaptedProps: any = {};
        for (const [k, v] of Object.entries(props)) {
          adaptedProps[k] = adapt(v);
        }
        const adapted: any = {
          type: 'object',
          properties: adaptedProps,
          additionalProperties: false,
        };
        if (Array.isArray(node.required)) adapted.required = node.required;
        if (node.title) adapted.title = node.title;
        if (node.description) adapted.description = node.description;
        return adapted;
      }

      // Recurse into objects/arrays
      const copy: any = Array.isArray(node) ? [] : { ...node };
      if (copy.properties && typeof copy.properties === 'object') {
        const nextProps: any = {};
        for (const [k, v] of Object.entries(copy.properties)) {
          nextProps[k] = adapt(v);
        }
        copy.properties = nextProps;
      }
      if (copy.items) {
        copy.items = adapt(copy.items);
      }
      if (copy.additionalProperties && typeof copy.additionalProperties === 'object') {
        copy.additionalProperties = adapt(copy.additionalProperties);
      }
      return copy;
    }

    const adaptedSchema = adapt(schema);

    // Serialize UI meta from Zod schemas to drive Web UI similar to Ink
    type FieldDef = {
      key: string;
      label: string;
      description?: string;
      kind: 'string' | 'number' | 'boolean' | 'reference';
      referenceKey?: string;
      isRequired?: boolean;
      enumValues?: Array<string | number>;
      defaultValue?: any;
    };

    function unwrap(field: any): any {
      let current: any = field;
      for (let i = 0; i < 6; i++) {
        if (!current || typeof current !== 'object') break;
        const def: any = current._def || {};
        if (current instanceof z.ZodOptional || current instanceof z.ZodNullable || current instanceof z.ZodDefault) {
          current = def.innerType || def.type || current;
          continue;
        }
        if (def.type && def.type._def) {
          current = def.type;
          continue;
        }
        if (def.schema && def.schema._def) {
          current = def.schema;
          continue;
        }
        break;
      }
      return current;
    }

    function getKind(field: any): FieldDef['kind'] {
      const base = unwrap(field);
      const meta = typeof base?.meta === 'function' ? base.meta() : {};
      if (meta?.type === 'reference-selector') return 'reference';
      if (base instanceof z.ZodBoolean) return 'boolean';
      if (base instanceof z.ZodNumber) return 'number';
      return 'string';
    }

    function extractFieldsFromObjectSchema(obj: any): FieldDef[] {
      if (!(obj instanceof z.ZodObject)) return [];
      const shape: Record<string, any> = (obj as any).shape || {};
      const meta = typeof obj.meta === 'function' ? obj.meta() : {};

      // Respect ordering if provided in meta.fields
      const orderedKeys: string[] = Array.isArray(meta?.fields)
        ? meta.fields.filter((k: any) => typeof k === 'string' && shape[k])
        : Object.keys(shape);

      const result: FieldDef[] = [];
      for (const key of orderedKeys) {
        const fieldSchema: any = shape[key];
        const base = unwrap(fieldSchema);
        const fMeta = typeof fieldSchema?.meta === 'function' ? fieldSchema.meta() : (typeof base?.meta === 'function' ? base.meta() : {});
        const kind = getKind(fieldSchema);
        const isOptional = (fieldSchema instanceof z.ZodOptional) || (fieldSchema instanceof z.ZodNullable);
        // enum values detection
        let enumValues: Array<string | number> | undefined;
        if (base && (base as any)._def) {
          enumValues = (base as any)._def?.values
            || (base as any)._def?.options
            || (base as any).options
            || (base as any).enum
            || undefined;
        }
        // default value detection
        let defaultValue: any = undefined;
        if (fieldSchema instanceof z.ZodDefault) {
          defaultValue = (fieldSchema as any)._def?.defaultValue;
        }
        result.push({
          key,
          label: fMeta?.title || key,
          description: (base as any)?._def?.description || fMeta?.description,
          kind,
          referenceKey: fMeta?.referenceKey,
          isRequired: !isOptional,
          enumValues,
          defaultValue,
        });
      }
      return result;
    }

    function serializeUI(root: any) {
      const sections: Array<{
        key: string;
        type: 'variant' | 'keys';
        title?: string;
        description?: string;
        fields?: FieldDef[]; // for keys.add object schemas (e.g., variant editor, host, hasura, etc.)
      }> = [];

      if (!(root instanceof z.ZodObject)) return { sections };
      const rootShape: Record<string, any> = (root as any).shape || {};

      for (const [key, sch] of Object.entries<any>(rootShape)) {
        const meta = typeof sch?.meta === 'function' ? sch.meta() : {};
        if (meta?.type === 'reference-selector') {
          sections.push({
            key,
            type: 'variant',
            title: meta?.title || key,
            description: meta?.description,
          });
          continue;
        }
        // keys collections
        const schMeta = typeof sch?.meta === 'function' ? sch.meta() : {};
        if (schMeta?.type === 'keys') {
          // Try to extract fields from the add schema
          const add = schMeta?.add;
          let fields: FieldDef[] | undefined;
          if (add) {
            const addMeta = typeof add?.meta === 'function' ? add.meta() : {};
            if (addMeta?.type === 'variant-editor' && add instanceof z.ZodObject) {
              fields = extractFieldsFromObjectSchema(add);
            } else if (add instanceof z.ZodObject) {
              fields = extractFieldsFromObjectSchema(add);
            }
          }
          sections.push({
            key,
            type: 'keys',
            title: schMeta?.title || key,
            description: schMeta?.description,
            fields,
          });
        }
      }
      return { sections };
    }

    const ui = serializeUI(fileSchema);

    return NextResponse.json({ ok: true, config, schema: adaptedSchema, ui });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await assertAdmin();
    if (!admin.ok) {
      return NextResponse.json({ ok: false, error: admin.message }, { status: admin.status });
    }
    const body = await req.json();
    const candidate = body?.config ?? body;

    // Validate with Zod schema to ensure structure is correct
    const schema = (hasyxConfig as any).file as z.ZodSchema<any>;
    const parsed = schema.safeParse(candidate);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    writeConfig(parsed.data);

    // Side effects: regenerate .env and docker-compose.yml
    try { generateEnv(); } catch (e) { /* keep going, report below */ }
    try { generateDockerCompose(); } catch (e) { /* keep going, report below */ }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || String(error) }, { status: 500 });
  }
}

