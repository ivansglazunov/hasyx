import Debug from '../debug';
import * as mathjs from 'mathjs';

const debug = Debug('brain');

/**
 * Parse brain names (variables) from template expressions
 * Uses ${variable} syntax for explicit variable references
 * 
 * @param expression - Formula or prompt with ${variable} placeholders
 * @returns Array of unique variable names found in ${...} placeholders
 * 
 * @example
 * parseBrainNames("${x} + ${y} * 2") // => ["x", "y"]
 * parseBrainNames("sqrt(${temperature}) + ${pressure}") // => ["temperature", "pressure"]
 * parseBrainNames("What is ${temperature}?") // => ["temperature"]
 */
export async function parseBrainNames(expression: string): Promise<string[]> {
  if (!expression || typeof expression !== 'string') {
    return [];
  }

  const names = new Set<string>();
  
  // Match ${variableName} pattern
  // Allows alphanumeric, underscore, and dots (for nested access like ${user.name})
  const templateRegexp = /\$\{([a-zA-Z_][a-zA-Z0-9_\.]*)\}/g;
  let match;
  
  while ((match = templateRegexp.exec(expression)) !== null) {
    const variableName = match[1];
    names.add(variableName);
  }
  
  debug('[parseBrainNames] Expression:', expression);
  debug('[parseBrainNames] Found template variables:', Array.from(names));

  return Array.from(names).sort();
}

/**
 * Substitute brain names with their values in a template expression
 * Replaces ${variable} placeholders with actual values
 * 
 * @param expression - Formula or prompt with ${variable} placeholders
 * @param values - Object mapping variable names to their values
 * @returns Expression with substituted values
 * 
 * @example
 * substituteBrainNames("${x} + ${y} * 2", { x: 5, y: 3 }) // => "5 + 3 * 2"
 * substituteBrainNames("What is ${temp}?", { temp: "25°C" }) // => "What is 25°C?"
 */
export function substituteBrainNames(expression: string, values: Record<string, any>): string {
  if (!expression || typeof expression !== 'string') {
    return expression;
  }
  
  let result = expression;
  const templateRegexp = /\$\{([a-zA-Z_][a-zA-Z0-9_\.]*)\}/g;
  
  result = result.replace(templateRegexp, (match, variableName) => {
    if (variableName in values) {
      const value = values[variableName];
      // Convert value to string, handling null/undefined
      return value != null ? String(value) : match;
    }
    // Keep placeholder if no value provided
    return match;
  });
  
  debug('[substituteBrainNames] Original:', expression);
  debug('[substituteBrainNames] Substituted:', result);
  
  return result;
}

/**
 * Generate Hasyx query to find brain_string results by brain_name references
 * 
 * Queries structure:
 * - Find options with key='brain_string' 
 * - That have item_option (the brain_ask/brain_formula they belong to)
 * - Where that item_option has item_options with key='brain_name' and string_value matching our names
 * 
 * @param names - Array of brain_name values to search for
 * @returns Hasyx query object (without operation field)
 * 
 * @example
 * generateBrainResultsQueryFromNames(["temperature", "pressure"])
 * // Returns query to find brain_string results where parent has brain_name = "temperature" or "pressure"
 */
export function generateBrainResultsQueryFromNames(names: string[]): any {
  if (!names || names.length === 0) {
    return {
      table: 'options',
      where: { id: { _eq: '00000000-0000-0000-0000-000000000000' } }, // Never matches
      returning: ['id']
    };
  }

  // Query:
  // SELECT * FROM options 
  // WHERE key = 'brain_string'
  // AND item_id IN (
  //   SELECT id FROM options 
  //   WHERE id IN (
  //     SELECT item_id FROM options 
  //     WHERE key = 'brain_name' AND string_value IN names
  //   )
  // )
  
  return {
    table: 'options',
    where: {
      key: { _eq: 'brain_string' },
      item_option: {
        item_options: {
          key: { _eq: 'brain_name' },
          string_value: { _in: names }
        }
      }
    },
    returning: [
      'id',
      'key', 
      'string_value',
      'item_id',
      {
        item_option: [
          'id',
          'key',
          {
            item_options: {
              where: { key: { _eq: 'brain_name' } },
              returning: ['id', 'key', 'string_value']
            }
          }
        ]
      }
    ]
  };
}

