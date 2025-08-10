import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import Debug from './debug';
import { Hasura } from './hasura/hasura';

const debug = Debug('validation');

export interface ValidationRule {
  schema?: string;
  table: string;
  column: string;
  validate: string; // path.to.schema.from.root.in.generated.schemas
  schemaSet?: string; // optional key in validation.schemas (defaults to 'project')
}

export interface ValidationConfig {
  validation: ValidationRule[];
}

export type GeneratedSchemas = Record<string, any>;

/**
 * Generate JSON Schemas for project Zod schemas by running a small TSX script in the project context.
 * The script imports schema.tsx and lib/config.tsx, converts Zod schemas using zod-to-json-schema,
 * and prints a single JSON to stdout.
 */
export async function generateProjectJsonSchemas(): Promise<GeneratedSchemas> {
  const projectRoot = process.cwd();

  const inlineTsx = `
import path from 'path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

(async () => {
  async function tryImport(modulePath: string) {
    try {
      return await import(modulePath);
    } catch (e) {
      return null;
    }
  }

  const result: any = { schema: {}, config: {} };

  // Load project schema.tsx
  const schemaPath = path.resolve(process.cwd(), 'schema.tsx');
  const schemaModule = await tryImport(schemaPath);
  if (schemaModule && schemaModule.schema && typeof schemaModule.schema === 'object') {
    const entries = Object.entries(schemaModule.schema);
    for (const [key, val] of entries) {
      if (val && typeof (val as any)._def === 'object') {
        result.schema[key] = zodToJsonSchema(val as z.ZodTypeAny, { name: \`schema.\${key}\` });
      }
    }
  }

  // Load lib/config.tsx (hasyxConfig)
  const configPath = path.resolve(process.cwd(), 'lib', 'config.tsx');
  const configModule = await tryImport(configPath);
  if (configModule && (configModule as any).hasyxConfig) {
    const hc = (configModule as any).hasyxConfig;
    // Pick only Zod schemas from hasyxConfig top-level keys
    for (const key of Object.keys(hc)) {
      const val = (hc as any)[key];
      if (val && typeof val === 'object' && typeof (val as any)._def === 'object' && typeof (val as any).parse === 'function') {
        // Looks like a Zod schema
        try {
          result.config[key] = zodToJsonSchema(val as z.ZodTypeAny, { name: \`config.\${key}\` });
        } catch (e) {
          // ignore failing schemas; keep generation resilient
        }
      }
    }
  }

  process.stdout.write(JSON.stringify(result));
})();
`;

  // Ensure zod-to-json-schema is available, install if missing
  let needInstall = false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require.resolve('zod-to-json-schema');
  } catch {
    needInstall = true;
  }

  if (needInstall) {
    console.log('📦 Installing zod-to-json-schema for validation sync...');
    const install = spawn.sync('npm', ['install', 'zod-to-json-schema@^3.23.5', '--save-dev'], { stdio: 'inherit', cwd: projectRoot });
    if (install.status !== 0) {
      throw new Error('Failed to install zod-to-json-schema');
    }
  }

  const run = spawn.sync('npx', ['tsx', '-e', inlineTsx], { cwd: projectRoot, encoding: 'utf-8' });
  if (run.status !== 0) {
    throw new Error(`Failed to generate schemas via tsx: ${run.stderr || run.stdout}`);
  }
  const json = run.stdout?.trim();
  if (!json) throw new Error('Empty schema generation output');
  const parsed = JSON.parse(json);
  return parsed;
}

export async function writeSchemasToFile(schemas: GeneratedSchemas, filePath: string = 'schema.json') {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  await fs.writeJson(abs, schemas, { spaces: 2 });
  debug(`Wrote schemas to ${abs}`);
}

export async function syncSchemasToDatabase(hasura?: Hasura, schemas?: GeneratedSchemas) {
  const hasu = hasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await hasu.ensureDefaultSource();

  // Ensure schema and tables
  await hasu.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);
  await hasu.sql(`
    CREATE TABLE IF NOT EXISTS validation.schemas (
      name TEXT PRIMARY KEY,
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const data = schemas || (await generateProjectJsonSchemas());
  const payload = JSON.stringify(data).replace(/'/g, "''");
  await hasu.sql(`
    INSERT INTO validation.schemas (name, content, updated_at)
    VALUES ('project', '${payload}'::jsonb, NOW())
    ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
  `);
}

export async function loadValidationConfigFromFile(): Promise<ValidationConfig | null> {
  const configPath = path.join(process.cwd(), 'hasyx.config.json');
  if (!(await fs.pathExists(configPath))) return null;
  try {
    const json = await fs.readJson(configPath);
    if (Array.isArray(json.validation)) {
      return { validation: json.validation } as ValidationConfig;
    }
    return null;
  } catch {
    return null;
  }
}

export async function removeAllValidationTriggers(hasura: Hasura) {
  await hasura.sql(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT n.nspname AS schema_name, c.relname AS table_name, t.tgname AS trigger_name
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE NOT t.tgisinternal AND t.tgname LIKE 'hasyx_validation_%'
      ) LOOP
        BEGIN
          EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON '
                  || quote_ident(r.schema_name) || '.' || quote_ident(r.table_name) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
          -- ignore
        END;
      END LOOP;
    END $$;
  `);
}

export async function applyValidationRules(hasura: Hasura, config: ValidationConfig) {
  debug('Applying validation rules...');
  // Ensure plv8 validation functions exist (migration may have created them). Create if missing.
  await ensureValidationRuntime(hasura);

  // Remove existing triggers to avoid duplicates
  // Do not perform global cleanup here to keep operation fast in tests; per-rule DROP happens below

  for (const rule of config.validation) {
    const sch = rule.schema || 'public';
    const tbl = rule.table;
    const col = rule.column;
    const pathArg = rule.validate;
    const schemaSet = rule.schemaSet || 'project';
    const triggerName = `hasyx_validation_${sch}_${tbl}_${col}`;
    await hasura.sql(`
      DROP TRIGGER IF EXISTS ${triggerName} ON ${sch}.${tbl};
      CREATE TRIGGER ${triggerName}
        BEFORE INSERT OR UPDATE OF ${col} ON ${sch}.${tbl}
        FOR EACH ROW
        EXECUTE FUNCTION validation.validate_column('${col}', '${pathArg}', '${schemaSet}');
    `);
  }
}

export async function ensureValidationRuntime(hasura: Hasura) {
  // Ensure validation schema exists
  await hasura.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);
  // Ensure validate functions exist
  // Minimal JSON Schema validator (supports: type, enum, minLength, maxLength, pattern, minimum, maximum, format: email)
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION validation.validate_json(value JSONB, schema_path TEXT, schema_set TEXT DEFAULT 'project') RETURNS VOID AS $$
      var rows = plv8.execute("SELECT content FROM validation.schemas WHERE name = $1 LIMIT 1", [schema_set]);
      if (!rows || rows.length === 0) {
        plv8.elog(ERROR, 'Validation schemas not found in validation.schemas for set: ' + schema_set);
      }
      var root = rows[0].content;
      function resolvePath(obj, p) {
        var parts = (p || '').split('.');
        var cur = obj;
        for (var i=0;i<parts.length;i++){ cur = (cur && cur[parts[i]]) || null; }
        return cur;
      }
      var schema = resolvePath(root, schema_path);
      if (!schema) { plv8.elog(ERROR, 'Schema not found at path: ' + schema_path); }
      function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '')); }
      // In plv8, jsonb scalar often maps directly to JS scalar; avoid double JSON roundtrips
      var instance = value;
      function typeOf(v){ if (v === null) return 'null'; if (Array.isArray(v)) return 'array'; return typeof v; }
      function validate(inst, sch){
        var errs = [];
        var t = sch.type;
        if (t){
          var ok = false;
          if (Array.isArray(t)) { ok = t.indexOf(typeOf(inst)) !== -1; }
          else { ok = typeOf(inst) === t; }
          if (!ok) errs.push('type mismatch: expected ' + JSON.stringify(t) + ', got ' + typeOf(inst));
        }
        if (sch.enum){
          var ok2 = false; for (var i=0;i<sch.enum.length;i++){ if (JSON.stringify(inst) === JSON.stringify(sch.enum[i])) { ok2 = true; break; } }
          if (!ok2) errs.push('not in enum');
        }
        if (typeOf(inst) === 'string'){
          if (sch.minLength != null && String(inst).length < sch.minLength) errs.push('minLength');
          if (sch.maxLength != null && String(inst).length > sch.maxLength) errs.push('maxLength');
          if (sch.pattern){ try { var re = new RegExp(sch.pattern); if (!re.test(String(inst))) errs.push('pattern'); } catch(e){} }
          if (sch.format === 'email' && !isEmail(inst)) errs.push('email format');
        }
        if (typeOf(inst) === 'number' || typeOf(inst) === 'integer'){
          if (sch.minimum != null && Number(inst) < sch.minimum) errs.push('minimum');
          if (sch.maximum != null && Number(inst) > sch.maximum) errs.push('maximum');
          if (t === 'integer' && Math.floor(Number(inst)) !== Number(inst)) errs.push('integer');
        }
        if (typeOf(inst) === 'array' && sch.items){
          for (var i=0;i<inst.length;i++){
            var childErrs = validate(inst[i], sch.items);
            if (childErrs.length){ errs.push('items['+i+']: '+childErrs.join('; ')); }
          }
        }
        if (typeOf(inst) === 'object' && sch.properties){
          // required
          if (Array.isArray(sch.required)){
            for (var i=0;i<sch.required.length;i++){
              var rk = sch.required[i];
              if (!(rk in inst)) errs.push('required.'+rk);
            }
          }
          for (var key in sch.properties){
            if (Object.prototype.hasOwnProperty.call(inst, key)){
              var childErrs2 = validate(inst[key], sch.properties[key]);
              if (childErrs2.length){ errs.push(key+': '+childErrs2.join('; ')); }
            }
          }
        }
        return errs;
      }
      var errors = validate(instance, schema);
      if (errors.length){ plv8.elog(ERROR, 'Validation failed: ' + errors.join(', ')); }
    $$ LANGUAGE plv8;
  `);

  await hasura.sql(`
    CREATE OR REPLACE FUNCTION validation.validate_column() RETURNS TRIGGER AS $$
      var column_name = (typeof TG_ARGV !== 'undefined' && TG_ARGV.length > 0) ? TG_ARGV[0] : null;
      var schema_path = (typeof TG_ARGV !== 'undefined' && TG_ARGV.length > 1) ? TG_ARGV[1] : null;
      var schema_set = (typeof TG_ARGV !== 'undefined' && TG_ARGV.length > 2) ? TG_ARGV[2] : 'project';
      if (!column_name || !schema_path) {
        plv8.elog(ERROR, 'validate_column requires column_name and schema_path via TG_ARGV');
      }
      var value = NEW[column_name];
      if (value === null || typeof value === 'undefined') {
        return NEW;
      }
      var rows = plv8.execute("SELECT content FROM validation.schemas WHERE name = $1 LIMIT 1", [schema_set]);
      if (!rows || rows.length === 0) { plv8.elog(ERROR, 'Validation schemas not found'); }
      var root = rows[0].content;
      function resolvePath(obj, p){ var parts=(p||'').split('.'); var cur=obj; for (var i=0;i<parts.length;i++){ cur=(cur&&cur[parts[i]])||null; } return cur; }
      var schema = resolvePath(root, schema_path);
      if (!schema) { plv8.elog(ERROR, 'Schema not found at path: ' + schema_path); }
      function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '')); }
      function typeOf(v){ if (v === null) return 'null'; if (Array.isArray(v)) return 'array'; return typeof v; }
      function validate(inst, sch){
        var errs = [];
        var t = sch.type;
        if (t){
          var ok = false;
          if (Array.isArray(t)) { ok = t.indexOf(typeOf(inst)) !== -1; }
          else { ok = typeOf(inst) === t; }
          if (!ok) errs.push('type mismatch: expected ' + JSON.stringify(t) + ', got ' + typeOf(inst));
        }
        if (sch.enum){
          var ok2 = false; for (var i=0;i<sch.enum.length;i++){ if (JSON.stringify(inst) === JSON.stringify(sch.enum[i])) { ok2 = true; break; } }
          if (!ok2) errs.push('not in enum');
        }
        if (typeOf(inst) === 'string'){
          if (sch.minLength != null && String(inst).length < sch.minLength) errs.push('minLength');
          if (sch.maxLength != null && String(inst).length > sch.maxLength) errs.push('maxLength');
          if (sch.pattern){ try { var re = new RegExp(sch.pattern); if (!re.test(String(inst))) errs.push('pattern'); } catch(e){} }
          if (sch.format === 'email' && !isEmail(inst)) errs.push('email format');
        }
        if (typeOf(inst) === 'number' || typeOf(inst) === 'integer'){
          if (sch.minimum != null && Number(inst) < sch.minimum) errs.push('minimum');
          if (sch.maximum != null && Number(inst) > sch.maximum) errs.push('maximum');
          if (t === 'integer' && Math.floor(Number(inst)) !== Number(inst)) errs.push('integer');
        }
        if (typeOf(inst) === 'array' && sch.items){
          for (var i=0;i<inst.length;i++){
            var childErrs = validate(inst[i], sch.items);
            if (childErrs.length){ errs.push('items['+i+']: '+childErrs.join('; ')); }
          }
        }
        if (typeOf(inst) === 'object' && sch.properties){
          if (Array.isArray(sch.required)){
            for (var i=0;i<sch.required.length;i++){
              var rk = sch.required[i];
              if (!(rk in inst)) errs.push('required.'+rk);
            }
          }
          for (var key in sch.properties){
            if (Object.prototype.hasOwnProperty.call(inst, key)){
              var childErrs2 = validate(inst[key], sch.properties[key]);
              if (childErrs2.length){ errs.push(key+': '+childErrs2.join('; ')); }
            }
          }
        }
        return errs;
      }
      var errors = validate(value, schema);
      if (errors.length){ plv8.elog(ERROR, 'Validation failed: ' + errors.join(', ')); }
      return NEW;
    $$ LANGUAGE plv8;
  `);
}

export async function processConfiguredValidationDefine(hasura?: Hasura) {
  const hasu = hasura || new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
  await hasu.ensureDefaultSource();
  const cfg = await loadValidationConfigFromFile();
  if (!cfg || !cfg.validation || cfg.validation.length === 0) {
    console.log('⚠️ No validation rules found in hasyx.config.json');
    return;
  }
  // Ensure schemas are synced into DB before defining
  await syncSchemasToDatabase(hasu);
  await applyValidationRules(hasu, cfg);
  console.log('✅ Validation rules defined');
}

export async function processConfiguredValidationUndefine(hasura?: Hasura) {
  const hasu = hasura || new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
  await hasu.ensureDefaultSource();
  await removeAllValidationTriggers(hasu);
  console.log('✅ Validation rules removed');
}


