import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import { AI } from 'hasyx/lib/ai/ai';
import { OpenRouterProvider } from 'hasyx/lib/ai/providers/openrouter';
import Debug from 'hasyx/lib/debug';
import schema from '@/public/hasura-schema.json';

const debug = Debug('api:events:options');
const generate = Generator(schema as any);

export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  const { event, table } = payload;
  const { op, data } = event;
  const row = op === 'DELETE' ? data.old : data.new;

  // Route by key
  const key = row?.key as string | undefined;
  if (!key) return { success: true, skip: true };

  // Skip processing for DELETE operations
  if (op === 'DELETE') {
    debug(`Skipping ${key} processing for DELETE operation`);
    return { success: true, skip: true };
  }

  const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
  const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
  
  if (!HASURA_URL || !ADMIN_SECRET) {
    debug('Missing Hasura admin env');
    return { success: false, error: 'server_misconfigured' };
  }

  const apolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false
  }) as HasyxApolloClient;
  
  const hasyx = new Hasyx(apolloClient, generate);

  try {
    // Handle brain_formula - evaluate mathematical expression using mathjs
    if (key === 'brain_formula') {
      const formula = row?.string_value;
      debug('brain_formula: evaluating formula:', formula);
      
      if (!formula || typeof formula !== 'string') {
        debug('brain_formula: empty formula, skipping');
        return { success: true, skip: true };
      }

      try {
        // Extract variable names from formula
        const { parseBrainNames } = await import('hasyx/lib/brain');
        const variableNames = await parseBrainNames(formula);
        debug('brain_formula: extracted variable names:', variableNames);
        
        // TODO: Fetch variable values from brain_name references
        // For now, evaluate without variables
        
        // Dynamically import mathjs
        const mathjs = await import('mathjs');
        
        // Evaluate formula
        const result = mathjs.evaluate(formula);
        const stringResult = String(result);
        
        debug('brain_formula: result =', stringResult);

        // Store result in brain_string
        // First, check if brain_string already exists for this formula
        const existing = await hasyx.select<any[]>({
          table: 'options',
          where: {
            key: { _eq: 'brain_string' },
            item_id: { _eq: row.id },
            user_id: { _eq: row.user_id }
          },
          returning: ['id'],
          limit: 1
        });

        if (existing && existing.length > 0) {
          // Update existing brain_string
          await hasyx.update({
            table: 'options',
            pk_columns: { id: existing[0].id },
            _set: {
              string_value: stringResult
            }
          });
          debug('brain_formula: updated existing brain_string');
        } else {
          // Insert new brain_string
          debug('brain_formula: attempting INSERT with values:', {
            key: 'brain_string',
            string_value: stringResult,
            item_id: row.id,
            user_id: row.user_id
          });
          
          try {
            await hasyx.insert({
              table: 'options',
              object: {
                key: 'brain_string',
                string_value: stringResult,
                item_id: row.id,
                user_id: row.user_id,
              }
            });
            debug('brain_formula: inserted new brain_string');
          } catch (insertError: any) {
            debug('brain_formula: INSERT failed:', insertError?.message);
            debug('brain_formula: INSERT error details:', insertError?.details || insertError);
            throw insertError;
          }
        }

        debug('brain_formula: stored result in brain_string');
        return { success: true, result: stringResult };
      } catch (evalError: any) {
        debug('brain_formula: evaluation error:', evalError?.message);
        // Store error as result
        const errorMessage = `Error: ${evalError?.message || 'Formula evaluation failed'}`;
        
        const existing = await hasyx.select<any[]>({
          table: 'options',
          where: {
            key: { _eq: 'brain_string' },
            item_id: { _eq: row.id },
            user_id: { _eq: row.user_id }
          },
          returning: ['id'],
          limit: 1
        });

        if (existing && existing.length > 0) {
          await hasyx.update({
            table: 'options',
            pk_columns: { id: existing[0].id },
            _set: {
              string_value: errorMessage
            }
          });
        } else {
          await hasyx.insert({
            table: 'options',
            object: {
              key: 'brain_string',
              string_value: errorMessage,
              item_id: row.id,
              user_id: row.user_id,
            }
          });
        }
        
        return { success: true, error: evalError?.message };
      }
    }
    
    if (key === 'brain_ask') {
      // Evaluate prompt using AI provider
      const prompt = row?.string_value;
      if (!prompt) {
        debug('brain_ask: empty prompt, skipping');
        return { success: true, skip: true };
      }

      debug('brain_ask: processing prompt:', prompt);
      
      // Extract variable names from prompt
      const { parseBrainNames } = await import('hasyx/lib/brain');
      const variableNames = await parseBrainNames(prompt);
      debug('brain_ask: extracted variable names:', variableNames);
      
      // TODO: Fetch variable values and substitute in prompt
      // For now, process prompt as-is

      // Check for AI provider configuration
      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
      if (!OPENROUTER_API_KEY) {
        debug('brain_ask: OPENROUTER_API_KEY not configured');
        await hasyx.insert({
          table: 'options',
          object: {
            key: 'brain_string',
            string_value: 'Error: AI provider not configured (OPENROUTER_API_KEY missing)',
            item_id: row.id,
            user_id: row.user_id,
          },
          on_conflict: {
            constraint: 'options_pkey',
            update_columns: ['string_value', 'updated_at']
          }
        });
        return { success: true, warning: 'ai_not_configured' };
      }

      try {
        // Initialize AI provider without tools
        const provider = new OpenRouterProvider({
          token: OPENROUTER_API_KEY,
          model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free'
        });

        const ai = new AI({ 
          provider,
          systemPrompt: 'You are a helpful assistant. Provide concise and accurate responses.'
        });

        // Query AI
        const response = await ai.query({ role: 'user', content: prompt });
        
        debug('brain_ask: AI response received, length:', response.length);

        // Store result in brain_string
        await hasyx.insert({
          table: 'options',
          object: {
            key: 'brain_string',
            string_value: response,
            item_id: row.id,
            user_id: row.user_id,
          },
          on_conflict: {
            constraint: 'options_pkey',
            update_columns: ['string_value', 'updated_at']
          }
        });

        debug('brain_ask: stored AI response in brain_string');
      } catch (aiError: any) {
        debug('brain_ask: AI query error:', aiError?.message);
        // Store error as result
        await hasyx.insert({
          table: 'options',
          object: {
            key: 'brain_string',
            string_value: `Error: ${aiError?.message || 'AI query failed'}`,
            item_id: row.id,
            user_id: row.user_id,
          },
          on_conflict: {
            constraint: 'options_pkey',
            update_columns: ['string_value', 'updated_at']
          }
        });
      }

    } else if (key === 'brain_number') {
      debug('brain_number:', row?.number_value);
    } else if (key === 'brain_string') {
      debug('brain_string:', row?.string_value);
    } else if (key === 'brain_object') {
      debug('brain_object:', row?.jsonb_value);
    } else if (key === 'brain_js') {
      // Execute JS and capture stdout / object (placeholder)
      debug('brain_js code length:', (row?.string_value || '').length);
    } else if (key === 'brain_prop_id') {
      // Dependency pointer in options table
      debug('brain_prop_id to_id:', row?.to_id);
    } else if (key === 'brain_name') {
      debug('brain_name:', row?.string_value);
    } else if (key === 'brain_query') {
      // bool_exp query template with ${VAR} substitutions (placeholder)
      debug('brain_query template:', row?.jsonb_value);
    }
  } catch (e: any) {
    debug('Error handling options event:', e?.message || String(e));
    debug('Error stack:', e?.stack);
    debug('Error details:', JSON.stringify(e?.details || e, null, 2));
    return { success: false, error: 'brain_handler_failed', details: e?.message || String(e) };
  } finally {
    (apolloClient as any)?.terminate?.();
  }

  return { success: true };
});


