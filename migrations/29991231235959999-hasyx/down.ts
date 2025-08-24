import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';
import { down } from 'hasyx/lib/hasyx/down-hasyx';

// Determine project root to load .env from there
const projectRoot = process.cwd();
dotenv.config({ path: path.join(projectRoot, '.env') });

// Function to run hasyx schema
async function runHasuraSchema(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('📊 Generating schema using hasyx schema command...');
    
    const child = spawn('npm', ['run', 'schema'], {
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Schema generated successfully with proper table mappings');
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
  console.log('🔄 Running updated hasyx view DOWN migration with improved schema handling...');
  
  try {
    // Generate schema directly (best-effort). If fails (e.g., network), continue.
    try {
      await runHasuraSchema();
    } catch (e) {
      console.warn('⚠️ Schema generation failed, continuing DOWN migration anyway. Reason:', (e as any)?.message || e);
    }
    
    // Check for tables in hasura-schema.json
    const schemaPath = path.join(projectRoot, 'public', 'hasura-schema.json');
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      try {
        const schema = JSON.parse(schemaContent);
        if (schema.hasyx && schema.hasyx.tableMappings) {
          const mappingsCount = Object.keys(schema.hasyx.tableMappings).length;
          console.log(`✓ Found ${mappingsCount} table mappings in schema file`);
        } else {
          console.warn('⚠️ No table mappings found in schema file');
        }
      } catch (err) {
        console.error('❌ Error parsing schema file:', err);
      }
    }
    
    // Run migration
    if (await down()) {
      console.log('✅ Hasyx View migration DOWN completed successfully.');
      process.exit(0);
    } else {
      console.error('❌ Hasyx View migration DOWN failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Migration process failed:', err);
    // Continue with non-zero exit is disruptive to full-unmigrate chain; exit 0 to allow rest to proceed
    process.exit(0);
  }
}

run(); 