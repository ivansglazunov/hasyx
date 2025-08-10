import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';
import { up } from '@/lib/hasyx/up-hasyx';
import Debug from '@/lib/debug';
const debug = Debug('migration:2999-hasyx');

// Determine project root to load .env from there
// This assumes migrations are run from the project root or `process.cwd()` is the project root.
const projectRoot = process.cwd(); 
dotenv.config({ path: path.join(projectRoot, '.env') });

// Function to run hasyx schema
async function runHasuraSchema(): Promise<void> {
  return new Promise((resolve, reject) => {
    debug('📊 Generating schema using hasyx schema command...');
    
    const child = spawn('npm', ['run', 'schema'], {
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        debug('✅ Schema generated successfully with proper table mappings');
        resolve();
      } else {
        console.error(`❌ Schema generation failed with code ${code}`);
        reject(new Error(`Schema generation failed with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      console.error('❌ Failed to start schema generation process:', err);
      reject(err);
    });
  });
}

async function run() {
  console.log('🔄 Running hasyx view migration...');
  
  try {
    // Generate schema directly
    await runHasuraSchema();
    
    // Check for tables in hasura-schema.json
    const schemaPath = path.join(projectRoot, 'public', 'hasura-schema.json');
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      try {
        const schema = JSON.parse(schemaContent);
        if (schema.hasyx && schema.hasyx.tableMappings) {
          const mappingsCount = Object.keys(schema.hasyx.tableMappings).length;
          debug(`✓ Found ${mappingsCount} table mappings in schema file`);
        } else {
          debug('⚠️ No table mappings found in schema file');
        }
      } catch (err) {
        debug(`❌ Error parsing schema file: ${String(err)}`);
      }
    }
    
    // Run migration
    if (await up()) {
      console.log('✅ Hasyx View migration completed.');
      process.exit(0);
    } else {
      console.error('❌ Hasyx View migration failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Migration process failed:', err);
    process.exit(1);
  }
}

run(); 