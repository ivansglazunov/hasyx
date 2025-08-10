import dotenv from 'dotenv';
import { Hasura, ColumnType } from './hasura/hasura';
import Debug from './debug';
import { v4 as uuidv4 } from 'uuid';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import {
  generateProjectJsonSchemas,
  ensureValidationRuntime,
  syncSchemasToDatabase,
  applyValidationRules,
} from './validation';

dotenv.config();
const debug = Debug('test:validation');

// Skip when not local
describe('Validation generator and DB runtime', () => {
  it('generator should produce json schema map containing schema and/or config', async () => {
    const schemas = await generateProjectJsonSchemas();
    expect(typeof schemas).toBe('object');
    // At least have container keys
    expect(schemas).toHaveProperty('schema');
    expect(schemas).toHaveProperty('config');
  }, 30000);

  it('cli validation sync should create validation.schemas row', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    // Ensure table exists (idempotent)
    await hasura.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);
    await hasura.sql(`CREATE TABLE IF NOT EXISTS validation.schemas (name TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`);

    const run = spawn.sync('npm', ['run', 'cli', '--', 'validation', 'sync'], { encoding: 'utf-8' });
    const ok = run.status === 0;
    expect(ok).toBe(true);

    const row = await hasura.sql(`SELECT name FROM validation.schemas WHERE name='project' LIMIT 1;`);
    expect(row.result?.[1]?.[0]).toBe('project');
  }, 60000);

  it('should validate email column using configured schema path via plv8', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    const result = await hasura.sql(`
      SELECT EXISTS (
        SELECT FROM pg_extension 
        WHERE extname = 'plv8'
      );
    `);
    const plv8Available = result.result?.[1]?.[0] === 't';
    expect(plv8Available).toBe(true);

    // Prepare runtime and sync minimal schema containing schema.email
    await ensureValidationRuntime(hasura);
    const sample = { schema: { email: { type: 'string', format: 'email' } } } as any;
    await hasura.sql(`CREATE SCHEMA IF NOT EXISTS validation;`);
    await hasura.sql(`CREATE TABLE IF NOT EXISTS validation.schemas (name TEXT PRIMARY KEY, content JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`);
    await hasura.sql(`
      INSERT INTO validation.schemas (name, content, updated_at)
      VALUES ('project', '${JSON.stringify(sample).replace(/'/g, "''")}'::jsonb, NOW())
      ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
    `);

    const testSchema = `test_validation_${uuidv4().replace(/-/g, '_')}`;
    try {
      await hasura.defineSchema({ schema: testSchema });
      await hasura.defineTable({ schema: testSchema, table: 'users', id: 'id', type: ColumnType.UUID });
      await hasura.defineColumn({ schema: testSchema, table: 'users', name: 'email', type: ColumnType.TEXT });

      await applyValidationRules(hasura, {
        validation: [
          { schema: testSchema, table: 'users', column: 'email', validate: 'schema.email' }
        ]
      });

      // Helper to capture error message deterministically
      await hasura.sql(`
        CREATE OR REPLACE FUNCTION "${testSchema}".try_sql(cmd text) RETURNS text AS $$
        DECLARE errmsg text;
        BEGIN
          BEGIN
            EXECUTE cmd;
            RETURN 'ok';
          EXCEPTION WHEN others THEN
            GET STACKED DIAGNOSTICS errmsg = MESSAGE_TEXT;
            RETURN errmsg;
          END;
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Valid
      const okRes = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (email) VALUES ('a@b.co');$q$);`);
      expect(okRes.result?.[1]?.[0]).toBe('ok');

      // Invalid
      const badRes = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (email) VALUES ('invalid');$q$);`);
      expect(badRes.result?.[1]?.[0]).not.toBe('ok');

      // Update path
      const okUpd = await hasura.sql(`SELECT "${testSchema}".try_sql($q$UPDATE "${testSchema}".users SET email='ok@ok.io'$q$);`);
      expect(okUpd.result?.[1]?.[0]).toBe('ok');
      const badUpd = await hasura.sql(`SELECT "${testSchema}".try_sql($q$UPDATE "${testSchema}".users SET email='bad'$q$);`);
      expect(badUpd.result?.[1]?.[0]).not.toBe('ok');

      // NULL is allowed if column nullable
      await hasura.sql(`ALTER TABLE "${testSchema}".users ALTER COLUMN email DROP NOT NULL;`);
      const nullIns = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (email) VALUES (NULL);$q$);`);
      expect(nullIns.result?.[1]?.[0]).toBe('ok');
    } finally {
      await hasura.deleteSchema({ schema: testSchema, cascade: true });
    }
  }, 60000);

  it('cli validation define/undefine via hasyx.config.json should enforce rule and then clean up', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    const testSchema = `test_validation_cli_${uuidv4().replace(/-/g, '_')}`;
    const configPath = path.join(process.cwd(), 'hasyx.config.json');
    const originalConfig = await fs.readFile(configPath, 'utf-8');
    try {
      await hasura.defineSchema({ schema: testSchema });
      await hasura.defineTable({ schema: testSchema, table: 'users', id: 'id', type: ColumnType.UUID });
      await hasura.defineColumn({ schema: testSchema, table: 'users', name: 'email', type: ColumnType.TEXT });

      // Sync schemas to DB (baseline)
      const syncRun = spawn.sync('npm', ['run', 'cli', '--', 'validation', 'sync'], { encoding: 'utf-8' });
      expect(syncRun.status).toBe(0);

      // Enrich project content with a test schema path schema._test_email
      await hasura.sql(`
        UPDATE validation.schemas
        SET content = jsonb_set(content, '{schema,_test_email}', '{"type":"string","format":"email"}'::jsonb, true),
            updated_at = NOW()
        WHERE name = 'project';
      `);

      // Add rule to hasyx.config.json for our test table/column using the injected path
      const cfg = JSON.parse(originalConfig);
      if (!Array.isArray(cfg.validation)) cfg.validation = [];
      cfg.validation.push({ schema: testSchema, table: 'users', column: 'email', validate: 'schema._test_email' });
      await fs.writeFile(configPath, JSON.stringify(cfg, null, 2));

      // Define via CLI
      const defineRun = spawn.sync('npm', ['run', 'cli', '--', 'validation', 'define'], { encoding: 'utf-8' });
      expect(defineRun.status).toBe(0);

      // Helper
      await hasura.sql(`
        CREATE OR REPLACE FUNCTION "${testSchema}".try_sql(cmd text) RETURNS text AS $$
        DECLARE errmsg text;
        BEGIN
          BEGIN
            EXECUTE cmd;
            RETURN 'ok';
          EXCEPTION WHEN others THEN
            GET STACKED DIAGNOSTICS errmsg = MESSAGE_TEXT;
            RETURN errmsg;
          END;
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Invalid should fail while trigger exists
      const bad1 = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (email) VALUES ('invalid');$q$);`);
      expect(bad1.result?.[1]?.[0]).not.toBe('ok');

      // Run CLI undefine
      const undef = spawn.sync('npm', ['run', 'cli', '--', 'validation', 'undefine'], { encoding: 'utf-8' });
      expect(undef.status).toBe(0);

      // Now invalid should pass (no trigger)
      const bad2 = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (email) VALUES ('invalid');$q$);`);
      expect(bad2.result?.[1]?.[0]).toBe('ok');
    } finally {
      // Restore hasyx.config.json and resync to clean DB content
      await fs.writeFile(configPath, originalConfig);
      spawn.sync('npm', ['run', 'cli', '--', 'validation', 'sync'], { encoding: 'utf-8' });
      await hasura.deleteSchema({ schema: testSchema, cascade: true });
    }
  }, 120000);

  it('tmp plv8 check', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();

    // Check extension
    const ext = await hasura.sql(`SELECT EXISTS (SELECT FROM pg_extension WHERE extname = 'plv8');`);
    const available = ext.result?.[1]?.[0] === 't';
    // Extra diagnostics
    const ver = await hasura.sql(`SELECT version(), current_database(), current_setting('server_version'), current_setting('server_version_num');`);
    // pg_available_extensions
    const avail = await hasura.sql(`SELECT name, default_version, installed_version, comment FROM pg_available_extensions WHERE name='plv8';`);
    // Attempt create
    let createErr: string | null = null;
    try {
      await hasura.sql(`CREATE EXTENSION IF NOT EXISTS plv8;`);
    } catch (e: any) {
      createErr = e?.message || e?.response?.data?.error || String(e);
    }
    console.log('plv8 exists before:', available);
    console.log('server info:', ver.result);
    console.log('pg_available_extensions plv8:', avail.result);
    console.log('create extension error:', createErr);
    // Final recheck
    const ext2 = await hasura.sql(`SELECT EXISTS (SELECT FROM pg_extension WHERE extname = 'plv8');`);
    const available2 = ext2.result?.[1]?.[0] === 't';
    console.log('plv8 exists after:', available2);
    expect(available2).toBe(true);

    // Create temp schema/function and call it
    const sch = `tmp_plv8_${uuidv4().replace(/-/g, '_')}`;
    try {
      await hasura.defineSchema({ schema: sch });
      await hasura.defineFunction({
        schema: sch,
        name: 'hello',
        definition: `() RETURNS TEXT AS $$
          var msg = 'ok';
          return msg;
        $$`,
        language: 'plv8'
      });
      const res = await hasura.sql(`SELECT "${sch}".hello();`);
      expect(res.result?.[1]?.[0]).toBe('ok');
    } finally {
      await hasura.deleteSchema({ schema: sch, cascade: true });
    }
  }, 30000);
});


