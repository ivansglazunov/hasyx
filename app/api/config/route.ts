import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { hasyxConfig } from '@/lib/config';
import { generateEnv } from '@/lib/config/env';
import { generateDockerCompose } from '@/lib/config/docker-compose';
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

export async function GET() {
  try {
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

    return NextResponse.json({ ok: true, config, schema: adaptedSchema });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

