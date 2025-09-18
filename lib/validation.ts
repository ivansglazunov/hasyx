import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import Debug from './debug';
import { Hasura } from './hasura/hasura';

const debug = Debug('validation');

export interface ValidationRule {
  schema?: string;
  table: string;
  column?: string;
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
  // Direct schema generation to avoid import issues
  // Create temporary file for schema generation
  const projectRoot = process.cwd();
  const tempFile = path.join(projectRoot, 'temp-schema-gen.ts');
  const tempContent = `
import { z } from 'zod';

// Import actual schemas from schema.tsx to keep in sync
import * as projectSchema from './schema.tsx';

const schemas = projectSchema.schema;
const options = projectSchema.options;

  const result: any = { schema: {}, config: {} };

// Convert schemas to JSON Schema
for (const [key, val] of Object.entries(schemas)) {
  result.schema[key] = z.toJSONSchema(val);
}

// Convert options to JSON Schema with proper structure and include x-meta from Zod .meta()
result.options = {};
for (const [tableName, zodObj] of Object.entries(options as any)) {
  const json: any = z.toJSONSchema(zodObj as any);
  try {
    // Extract per-key meta from Zod shape
    const shape = typeof (zodObj as any)?._def?.shape === 'function' ? (zodObj as any)._def.shape() : (zodObj as any)?._def?.shape;
    if (shape && json && typeof json === 'object') {
      json.properties = json.properties || {};
      for (const key of Object.keys(json.properties || {})) {
        const zodType = shape[key];
        if (zodType && zodType._def) {
          const meta = (zodType._def.meta ?? zodType._def.metadata ?? null) as any;
          if (meta && typeof meta === 'object') {
            // Attach meta under non-standard extension key to keep JSON Schema valid
            json.properties[key]['x-meta'] = meta;
          }
        }
      }
    }
  } catch {
    // If meta extraction fails, proceed with plain schema
  }
  result.options[tableName] = json;
}

console.log(JSON.stringify(result));
`;

  // Write temporary file
  await fs.writeFile(tempFile, tempContent);

  try {
    // Using Zod 4's built-in toJSONSchema - no external dependencies needed
    const run = spawn.sync('npx', ['tsx', tempFile], { cwd: projectRoot, encoding: 'utf-8' });
  if (run.status !== 0) {
    throw new Error(`Failed to generate schemas via tsx: ${run.stderr || run.stdout}`);
  }
  const json = run.stdout?.trim();
  if (!json) throw new Error('Empty schema generation output');
  const parsed = JSON.parse(json);
  return parsed;
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(tempFile);
    } catch (e) {
      // ignore cleanup errors
    }
  }
}

// Removed file writer (schema.json) — schemas are synced directly into DB via validation.project_schemas()

export async function syncSchemasToDatabase(hasura?: Hasura, schemas?: GeneratedSchemas) {
  const hasu = hasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await hasu.ensureDefaultSource();
  // Ensure schema exists
  await hasu.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);

  // Generate or use provided schemas
  let data: GeneratedSchemas = schemas || (await generateProjectJsonSchemas());
  const originalData = JSON.parse(JSON.stringify(data));

  // Try to minimize payload by keeping only required schema paths from config
  try {
    const cfg = await loadValidationConfigFromFile();
    const requiredPaths: string[] = [];
    if (cfg && Array.isArray(cfg.validation)) {
      for (const rule of cfg.validation) {
        if (rule && typeof rule.validate === 'string') requiredPaths.push(rule.validate);
      }
    }
    if (requiredPaths.length > 0) {
      const pickPaths = (root: any, paths: string[]): any => {
        const out: any = {};
        for (const p of paths) {
          const parts = (p || '').split('.');
          let src: any = root;
          let dst: any = out;
          for (let i = 0; i < parts.length; i++) {
            const key = parts[i];
            if (!key) continue;
            if (src == null || typeof src !== 'object' || !(key in src)) {
              src = null;
              break;
            }
            if (i === parts.length - 1) {
              if (!(parts[0] in dst)) dst[parts[0]] = {};
              let cur = dst;
              for (let j = 0; j < parts.length - 1; j++) {
                const k = parts[j];
                cur[k] = cur[k] || {};
                cur = cur[k];
              }
              cur[key] = src[key];
            } else {
              // descend
              if (!(parts[0] in dst)) dst[parts[0]] = {};
              let cur = dst;
              for (let j = 0; j <= i; j++) {
                const k = parts[j];
                cur[k] = cur[k] || {};
                cur = cur[k];
              }
              src = src[key];
            }
          }
        }
        return out;
      };
      const minimal = pickPaths(data, requiredPaths);
      // Ensure structure keys exist
      if (!minimal.schema && data.schema) minimal.schema = {};
      if (!minimal.config && data.config) minimal.config = {};
      // CRITICAL: Always keep options schemas for runtime options validation
      if (!minimal.options && data.options) minimal.options = data.options;
      // Prefer minimal if it reduces size significantly or env hints local testing
      const fullStr = JSON.stringify(data);
      const minStr = JSON.stringify(minimal);
      const preferMinimal = (process.env.JEST_LOCAL === '1') || minStr.length < fullStr.length * 0.7;
      if (preferMinimal) data = minimal;
    }
  } catch {
    // ignore minimization errors
  }

  // Ensure full project schema set is available (avoid missing keys like schema.optionsProfile)
  // Merge config-derived schemas into schema namespace so bindings like schema.optionsProfile work
  if (originalData) {
    const mergedSchema: any = {};
    if (originalData.schema && typeof originalData.schema === 'object') Object.assign(mergedSchema, originalData.schema);
    if (originalData.config && typeof originalData.config === 'object') Object.assign(mergedSchema, originalData.config);
    if (Object.keys(mergedSchema).length > 0) data.schema = mergedSchema;
  }

  // Define or update plv8 function that returns the full project schemas JSON
  const payload = JSON.stringify(data).replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
  const fnBody = `return ${JSON.stringify(data)};`;
  await hasu.sql(`
    CREATE OR REPLACE FUNCTION validation.project_schemas() RETURNS JSONB AS $$
      ${fnBody}
    $$ LANGUAGE plv8 IMMUTABLE;
  `);
}

export async function loadValidationConfigFromFile(): Promise<ValidationConfig | null> {
  const configPath = path.join(process.cwd(), 'hasyx.config.json');
  if (!(await fs.pathExists(configPath))) return null;
  try {
    const json = await fs.readJson(configPath);
    const rules: ValidationRule[] = [];
    if (Array.isArray(json.validation)) {
      for (const r of json.validation) if (r) rules.push(r as ValidationRule);
    }
    if (json.validationRules && typeof json.validationRules === 'object' && !Array.isArray(json.validationRules)) {
      const values = Object.values(json.validationRules).filter(Boolean) as ValidationRule[];
      for (const r of values) rules.push(r);
    }
    if (rules.length > 0) return { validation: rules } as ValidationConfig;
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
    const pathArg = rule.validate;
    const schemaSet = rule.schemaSet || 'project';
    if (rule.column) {
      const col = rule.column;
    const triggerName = `hasyx_validation_${sch}_${tbl}_${col}`;
    await hasura.sql(`
      DROP TRIGGER IF EXISTS ${triggerName} ON ${sch}.${tbl};
      CREATE TRIGGER ${triggerName}
        BEFORE INSERT OR UPDATE OF ${col} ON ${sch}.${tbl}
        FOR EACH ROW
        EXECUTE FUNCTION validation.validate_column('${col}', '${pathArg}', '${schemaSet}');
    `);
    } else {
      // No table bindings in DB storage anymore; options trigger uses fixed path and project_schemas()
      /* no-op */
    }
  }
}

export async function ensureValidationRuntime(hasura: Hasura) {
  // Ensure validation schema exists
  await hasura.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);
  // Ensure validate functions exist
  // Minimal JSON Schema validator (supports: type, enum, minLength, maxLength, pattern, minimum, maximum, format: email)
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION validation.validate_json(value JSONB, schema_path TEXT, schema_set TEXT DEFAULT 'project') RETURNS VOID AS $$
      var rows = plv8.execute("SELECT validation.project_schemas() AS j");
      if (!rows || rows.length === 0) { plv8.elog(ERROR, 'project_schemas() returned no data'); }
      var root = rows[0].j;
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
      function typeOf(v){ 
        if (v === null) return 'null'; 
        if (Array.isArray(v)) return 'array'; 
        if (typeof v === 'number' && Math.floor(v) === v) return 'integer';
        return typeof v; 
      }
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
      var rows = plv8.execute("SELECT validation.project_schemas() AS j");
      if (!rows || rows.length === 0) { plv8.elog(ERROR, 'project_schemas() not found'); }
      var root = rows[0].j;
      function resolvePath(obj, p){ var parts=(p||'').split('.'); var cur=obj; for (var i=0;i<parts.length;i++){ cur=(cur&&cur[parts[i]])||null; } return cur; }
      var schema = resolvePath(root, schema_path);
      if (!schema) { plv8.elog(ERROR, 'Schema not found at path: ' + schema_path); }
      function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '')); }
      function typeOf(v){ 
        if (v === null) return 'null'; 
        if (Array.isArray(v)) return 'array'; 
        if (typeof v === 'number' && Math.floor(v) === v) return 'integer';
        return typeof v; 
      }
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

  await hasura.sql(`
    CREATE OR REPLACE FUNCTION validation.validate_option_key(option_key TEXT, schema_path TEXT DEFAULT 'options.users') RETURNS VOID AS $$
      var rows = plv8.execute("SELECT validation.project_schemas() AS j");
      if (!rows || rows.length === 0) { plv8.elog(ERROR, 'project_schemas() not found'); }
      var root = rows[0].j;
      function resolvePath(obj, p){ var parts=(p||'').split('.'); var cur=obj; for (var i=0;i<parts.length;i++){ cur=(cur&&cur[parts[i]])||null; } return cur; }
      var schema = resolvePath(root, schema_path);
      if (!schema) { plv8.elog(ERROR, 'Schema not found at path: ' + schema_path); }
      var props = (schema && schema.properties) || null;
      if (!props || typeof props !== 'object') { plv8.elog(ERROR, 'Bound schema is not an object with properties'); }
      if (!Object.prototype.hasOwnProperty.call(props, option_key)) { plv8.elog(ERROR, 'Unknown option key: ' + option_key); }
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
  debug('✅ Validation rules defined');
}

export async function processConfiguredValidationUndefine(hasura?: Hasura) {
  const hasu = hasura || new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
  await hasu.ensureDefaultSource();
  await removeAllValidationTriggers(hasu);
  console.log('✅ Validation rules removed');
}


