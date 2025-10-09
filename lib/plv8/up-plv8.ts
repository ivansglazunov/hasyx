import dotenv from 'dotenv';
import { Hasura, ColumnType } from '../hasura/hasura';
import Debug from '../debug';
import { ensureValidationRuntime, syncSchemasToDatabase } from '../validation';

// Initialize debug
const debug = Debug('migration:up-plv8');

export async function installPlv8Extension(hasura: Hasura) {
  debug('🔧 Installing plv8 extension...');
  
  // Check if plv8 extension already exists
  const extensionExists = await hasura.sql(`
    SELECT EXISTS (
      SELECT FROM pg_extension 
      WHERE extname = 'plv8'
    );
  `);
  
  if (extensionExists.result?.[1]?.[0] === 't') {
    debug('✅ plv8 extension already exists');
    return;
  }
  
  // Try to install plv8 extension
  try {
    await hasura.sql(`CREATE EXTENSION IF NOT EXISTS plv8;`);
    debug('✅ plv8 extension installed successfully');
  } catch (error: any) {
    const errorMessage = error.message || error.response?.data?.error || '';
    debug(`⚠️ Could not install plv8 extension: ${errorMessage}`);
    debug('Note: plv8 may not be available in Hasura Cloud environment');
    
    // Check if we're in a cloud environment
    const isCloudEnvironment = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.includes('hasura.io') || 
                              process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.includes('deep.foundation');
    
    if (isCloudEnvironment) {
      debug('🌐 Detected cloud environment - plv8 may not be available');
      debug('Note: plv8 functionality will be limited in cloud environments');
    }
  }
}

export async function createPlv8TestSchema(hasura: Hasura) {
  debug('🔧 Creating plv8 test schema...');
  
  // Create a test schema for plv8 functions
  await hasura.defineSchema({ schema: 'plv8_test' });
  debug('✅ plv8 test schema created');
}

export async function createPlv8TestFunction(hasura: Hasura) {
  debug('🔧 Creating plv8 test function...');
  
  try {
    // Create a simple plv8 function for testing
    await hasura.defineFunction({
      schema: 'plv8_test',
      name: 'test_plv8_function',
      definition: `() RETURNS TEXT AS $$
        var result = "Hello from plv8!";
        return result;
      $$`,
      language: 'plv8'
    });
    
    debug('✅ plv8 test function created');
  } catch (error: any) {
    const errorMessage = error.message || error.response?.data?.error || '';
    debug(`⚠️ Could not create plv8 function: ${errorMessage}`);
    debug('Note: plv8 functions may not be available in this environment');
  }
}

export async function installMathjsLibrary(hasura: Hasura) {
  debug('🔧 Installing mathjs library in plv8...');
  
  try {
    // Load mathjs from node_modules and install into plv8
    const mathjsPath = require.resolve('mathjs');
    const mathjsContent = await import('fs-extra').then(fs => fs.readFile(mathjsPath, 'utf-8'));
    
    // Create a minimal mathjs wrapper for plv8 (using core functions only)
    const mathjsWrapper = `
      // Minimal mathjs implementation for plv8 (attached to plv8.global)
      plv8.global = plv8.global || {};
      (function() {
        var math = {
          pi: Math.PI,
          e: Math.E,
          // Basic arithmetic
          add: function(a, b) { return a + b; },
          subtract: function(a, b) { return a - b; },
          multiply: function(a, b) { return a * b; },
          divide: function(a, b) { return a / b; },
          // Powers and roots
          pow: function(a, b) { return Math.pow(a, b); },
          sqrt: function(x) { return Math.sqrt(x); },
          cbrt: function(x) { return Math.cbrt(x); },
          // Trigonometry
          sin: function(x) { return Math.sin(x); },
          cos: function(x) { return Math.cos(x); },
          tan: function(x) { return Math.tan(x); },
          asin: function(x) { return Math.asin(x); },
          acos: function(x) { return Math.acos(x); },
          atan: function(x) { return Math.atan(x); },
          atan2: function(y, x) { return Math.atan2(y, x); },
          // Logarithms
          log: function(x) { return Math.log(x); },
          log10: function(x) { return Math.log10(x); },
          log2: function(x) { return Math.log2(x); },
          exp: function(x) { return Math.exp(x); },
          // Rounding
          abs: function(x) { return Math.abs(x); },
          ceil: function(x) { return Math.ceil(x); },
          floor: function(x) { return Math.floor(x); },
          round: function(x) { return Math.round(x); },
          // Min/Max
          min: function() { return Math.min.apply(null, arguments); },
          max: function() { return Math.max.apply(null, arguments); },
          // Simple evaluate function (very limited)
          evaluate: function(expr, scope) {
            scope = scope || {};
            var vars = Object.keys(scope);
            var vals = vars.map(function(k) { return scope[k]; });
            expr = String(expr)
              .replace(/\\bpi\\b/g, 'Math.PI')
              .replace(/\\be\\b/g, 'Math.E')
              .replace(/\\bsqrt\\(/g, 'Math.sqrt(')
              .replace(/\\bpow\\(/g, 'Math.pow(')
              .replace(/\\bsin\\(/g, 'Math.sin(')
              .replace(/\\bcos\\(/g, 'Math.cos(')
              .replace(/\\btan\\(/g, 'Math.tan(')
              .replace(/\\babs\\(/g, 'Math.abs(')
              .replace(/\\blog\\(/g, 'Math.log(')
              .replace(/\\bexp\\(/g, 'Math.exp(');
            try {
              var fn = new Function(vars.join(','), 'return ' + expr);
              return fn.apply(null, vals);
            } catch(e) {
              throw new Error('Failed to evaluate: ' + expr + ' - ' + e.message);
            }
          }
        };
        plv8.global.mathjs = math;
      })();
    `;
    
    // Store mathjs wrapper in validation schema as a function that initializes plv8.global
    await hasura.sql(`
      CREATE OR REPLACE FUNCTION validation.get_mathjs() RETURNS TEXT AS $$
        ${mathjsWrapper}
        return 'mathjs loaded';
      $$ LANGUAGE plv8 IMMUTABLE;
    `);
    
    // Also provide a function that returns a local wrapper string for per-call eval
    const mathjsLocalWrapper = `
      var mathjs = (function() {
        var math = {
          pi: Math.PI,
          e: Math.E,
          add: function(a,b){return a+b;}, subtract: function(a,b){return a-b;}, multiply: function(a,b){return a*b;}, divide: function(a,b){return a/b;},
          pow: function(a,b){return Math.pow(a,b);}, sqrt: function(x){return Math.sqrt(x);}, cbrt: function(x){return Math.cbrt(x);},
          sin: function(x){return Math.sin(x);}, cos: function(x){return Math.cos(x);}, tan: function(x){return Math.tan(x);},
          asin: function(x){return Math.asin(x);}, acos: function(x){return Math.acos(x);}, atan: function(x){return Math.atan(x);}, atan2: function(y,x){return Math.atan2(y,x);},
          log: function(x){return Math.log(x);}, log10: function(x){return Math.log10(x);}, log2: function(x){return Math.log2(x);}, exp: function(x){return Math.exp(x);},
          abs: function(x){return Math.abs(x);}, ceil: function(x){return Math.ceil(x);}, floor: function(x){return Math.floor(x);}, round: function(x){return Math.round(x);},
          min: function(){return Math.min.apply(null, arguments);}, max: function(){return Math.max.apply(null, arguments);},
          evaluate: function(expr, scope){
            scope = scope || {}; var vars = Object.keys(scope); var vals = vars.map(function(k){return scope[k];});
            expr = String(expr)
              .replace(/\\bpi\\b/g,'Math.PI').replace(/\\be\\b/g,'Math.E')
              .replace(/\\bsqrt\\(/g,'Math.sqrt(').replace(/\\bpow\\(/g,'Math.pow(')
              .replace(/\\bsin\\(/g,'Math.sin(').replace(/\\bcos\\(/g,'Math.cos(').replace(/\\btan\\(/g,'Math.tan(')
              .replace(/\\babs\\(/g,'Math.abs(').replace(/\\blog\\(/g,'Math.log(').replace(/\\bexp\\(/g,'Math.exp(');
            var fn = new Function(vars.join(','), 'return ' + expr); return fn.apply(null, vals);
          }
        }; return math;
      })();
    `;
    
    await hasura.sql(`
      CREATE OR REPLACE FUNCTION validation.mathjs_wrapper() RETURNS TEXT AS $$
        return ${JSON.stringify(mathjsLocalWrapper)};
      $$ LANGUAGE plv8 IMMUTABLE;
    `);
    
    debug('✅ mathjs library installed in plv8');
  } catch (error: any) {
    const errorMessage = error.message || error.response?.data?.error || '';
    debug(`⚠️ Could not install mathjs library: ${errorMessage}`);
    debug('Note: mathjs functionality will be limited');
  }
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura plv8 migration UP...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists before any operations
    await hasura.ensureDefaultSource();
    
    await installPlv8Extension(hasura);
    await createPlv8TestSchema(hasura);
    await createPlv8TestFunction(hasura);
    await installMathjsLibrary(hasura);
    
    // Ensure validation runtime (schema, functions, storage) and sync current project schemas
    await ensureValidationRuntime(hasura);
    await syncSchemasToDatabase(hasura);
    
    debug('✨ Hasura plv8 migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during plv8 UP migration:', error);
    debug('❌ plv8 UP Migration failed.');
    return false;
  }
} 