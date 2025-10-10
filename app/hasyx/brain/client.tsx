"use client";

import { useCallback, useMemo, useEffect } from 'react';
import { Cyto, CytoStyle } from 'hasyx/lib/cyto';
import { useSubscription, useHasyx } from 'hasyx';
import { CytoNode as OptionCytoNode } from 'hasyx/components/entities/options';
import { toast } from 'sonner';

const stylesheet = [
  { selector: 'node', style: { 'background-color': '#0ea5e9', 'label': 'data(label)', 'color': '#111827', 'text-wrap': 'wrap' } },
  { selector: 'edge', style: { 'line-color': '#94a3b8', 'target-arrow-shape': 'triangle', 'target-arrow-color': '#94a3b8', 'curve-style': 'bezier' } },
  { 
    selector: 'node.brain-option', 
    style: { 
      'background-color': '#ffffff', 
      'background-opacity': 0,
      'shape': 'rectangle',
      'label': '',
      'width': 'auto',
      'height': 'auto',
    } 
  },
];

export default function Client() {
  const hasyx = useHasyx();
  
  // Get userId from Hasyx instance (synced with session/JWT)
  const userId = useMemo(() => hasyx.userId, [hasyx.userId]);
  const isAuthenticated = useMemo(() => !!userId, [userId]);

  // Subscribe to all brain options with their result options (item_options)
  const subscriptionOptions = useMemo(() => ({
    table: 'options',
    where: {
      key: {
        _in: [
          'brain',
          'brain_string',
          'brain_number',
          'brain_object',
          'brain_formula',
          'brain_ask',
          'brain_js',
          'brain_query',
          'brain_prop_id',
          'brain_name'
        ]
      }
    },
    returning: [
      'id', 
      'key', 
      'item_id', 
      'user_id', 
      'string_value', 
      'number_value', 
      'jsonb_value', 
      'to_id', 
      'created_at', 
      'updated_at',
      // Include result options (brain_string) that point to this option via item_id
      { item_options: ['id', 'key', 'string_value', 'number_value', 'jsonb_value', 'created_at', 'updated_at'] }
    ],
  }), []);

  const { data: options = [], loading, error } = useSubscription(subscriptionOptions);
  
  // Debug: log subscription query on mount
  useEffect(() => {
    if (hasyx?.generate) {
      try {
        const generated = hasyx.generate({ operation: 'subscription', ...subscriptionOptions });
        console.log('[Brain Client] 🔍 Generated GraphQL Query:');
        console.log(generated.queryString);
        console.log('[Brain Client] 🔍 Variables:', generated.variables);
      } catch (e) {
        console.error('[Brain Client] Failed to generate query for debug:', e);
      }
    }
  }, [hasyx, subscriptionOptions]);

  // Helper function to extract ${variable} template variables
  const extractTemplateVars = (expression: string): string[] => {
    if (!expression) return [];
    
    const names = new Set<string>();
    const templateRegexp = /\$\{([a-zA-Z_][a-zA-Z0-9_\.]*)\}/g;
    let match;
    
    while ((match = templateRegexp.exec(expression)) !== null) {
      names.add(match[1]);
    }
    
    return Array.from(names).sort();
  };

  // Analyze brain_ask/brain_formula options to build names, used, and hipotetics
  const brainAnalysis = useMemo(() => {
    // names: { name: id } - maps brain_name to brain_ask/brain_formula id
    const names: Record<string, string> = {};

    // used: { id: string[] } - maps brain_ask/brain_formula id to array of variable names it uses
    const used: Record<string, string[]> = {};

    // hipotetics: array of potential brain_prop_id entries
    const hipotetics: Array<{ item_id: string; to_id: string; name: string }> = [];

    // First pass: collect brain_name values from item_options
    options.forEach((option: any) => {
      if ((option.key === 'brain_ask' || option.key === 'brain_formula') && option.item_options) {
        // Look for brain_name in item_options
        option.item_options.forEach((childOption: any) => {
          if (childOption.key === 'brain_name' && childOption.string_value) {
            names[childOption.string_value] = option.id;
            console.log(`[Brain Analysis] Found brain_name "${childOption.string_value}" for ${option.key} ${option.id}`);
          }
        });
      }
    });

    // Second pass: extract variable names from brain_ask/brain_formula expressions
    // Uses ${variable} template syntax
    options.forEach((option: any) => {
      if ((option.key === 'brain_ask' || option.key === 'brain_formula') && option.string_value) {
        // Parse ${variable} templates
        const varNames = extractTemplateVars(option.string_value);
        if (varNames.length > 0) {
          used[option.id] = varNames;
          console.log(`[Brain Analysis] ${option.key} ${option.id} uses template variables:`, varNames);

          // Create hipotetics for each used variable
          varNames.forEach(varName => {
            if (names[varName]) {
              // Found a matching brain_name
              hipotetics.push({
                item_id: option.id,
                to_id: names[varName],
                name: varName
              });
              console.log(`[Brain Analysis] Hypothetical link: ${option.id} -> ${names[varName]} (${varName})`);
            }
          });
        }
      }
    });

    console.log('[Brain Analysis] Summary:', {
      namesCount: Object.keys(names).length,
      usedCount: Object.keys(used).length,
      hipotetics: hipotetics.length
    });

    return { names, used, hipotetics };
  }, [options]);

  // Debug: log options data and check item_options
  useEffect(() => {
    console.log('[Brain Client] Options received:', options);
    console.log('[Brain Client] First option:', options[0]);
    if (options[0]?.item_options) {
      console.log('[Brain Client] ✅ item_options present:', options[0].item_options);
    } else {
      console.log('[Brain Client] ❌ item_options missing in first option');
    }
    
    // Log a sample option to see full structure
    if (options.length > 0) {
      console.log('[Brain Client] Sample option keys:', Object.keys(options[0]));
    }
  }, [options]);

  const onGraphLoaded = useCallback((cy: any) => {
    if (global) (global as any).cy = cy;
    cy.zoom(1);
    cy.center();

    // Click anywhere to create a new brain_string option
    cy.on('tap', async (evt: any) => {
      if (evt.target !== cy) return;
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error('Please sign in to create brain options');
        return;
      }

      const pos = evt.position;

      try {
        const result = await hasyx.insert({
          table: 'options',
          object: {
            key: 'brain_string',
            string_value: '',
            // No item_id - this is a global brain option
            // user_id is set automatically by the options_set_user_id_trigger
          },
          returning: ['id', 'key', 'string_value'],
        });

        // The new option will appear automatically via subscription
        toast.success('Brain option created');

        // Position the node at click location and lock it temporarily
        setTimeout(() => {
          const node = cy.$id(result.id);
          if (node && node.length > 0) {
            node.position(pos);
            node.lock(); // Lock position temporarily
            
            // Unlock after a brief moment to allow manual dragging
            setTimeout(() => {
              node.unlock();
            }, 500);
          }
        }, 100);
      } catch (error) {
        console.error('Failed to create brain option:', error);
        toast.error('Failed to create option');
      }
    });
  }, [hasyx, isAuthenticated]);

  const layoutConfig = useMemo(() => ({ 
    name: 'cola',
    refresh: 10,
    maxSimulationTime: 2000,
    fit: false,
    nodeDimensionsIncludeLabels: true,
    edgeLength: 150,
    nodeSpacing: 80,
    randomize: false, // Don't randomize initial positions
    avoidOverlap: true, // Force nodes to not overlap
    handleDisconnected: true, // Handle disconnected components
    convergenceThreshold: 0.01,
    infinite: false,
  }), []);

  if (error) {
    console.error('Subscription error:', error);
  }

  return (
    <div className="w-full h-full relative">
      <Cyto onLoaded={onGraphLoaded} buttons={true} layout={layoutConfig}>
        <CytoStyle stylesheet={stylesheet} />
        
        {/* Render all brain options as CytoNodes */}
        {options.map((option: any) => (
          <OptionCytoNode
            key={option.id}
            data={option}
          />
        ))}
      </Cyto>

      {/* Status indicators - ordered by importance */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {!isAuthenticated ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ Sign in to create brain options
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-green-800 dark:text-green-200">
            ✓ Click anywhere to create
          </div>
        )}
        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-4 py-2 rounded-lg shadow-lg text-sm text-blue-800 dark:text-blue-200">
            Loading brain options...
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-2 rounded-lg shadow-lg text-sm text-red-800 dark:text-red-200">
            Error loading options
          </div>
        )}
      </div>
    </div>
  );
}
