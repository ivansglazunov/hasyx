"use client";

import React from 'react';
import { Button as UIButton } from 'hasyx/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Badge } from 'hasyx/components/ui/badge';
import { Input } from 'hasyx/components/ui/input';
import { CytoNode as CytoNodeComponent } from 'hasyx/lib/cyto';
import { getOptionComponent, DefaultBrainComponent } from 'hasyx/lib/brain/components';
import { X, Brain } from 'lucide-react';
import { useTranslations } from 'hasyx';
import { cn } from 'hasyx/lib/utils';
import { useState, useCallback } from 'react';
import { useHasyx } from 'hasyx';
import { toast } from 'sonner';

interface OptionData {
  id: string;
  key: string;
  item_id?: string | null;
  user_id: string;
  string_value?: string | null;
  number_value?: number | null;
  jsonb_value?: any;
  to_id?: string | null;
  created_at?: string;
  updated_at?: string;
  __typename?: string;
  [key: string]: any;
}

export function Button({ data, ...props }: {
  data: OptionData | string;
  [key: string]: any;
}) {
  const optionId = typeof data === 'string' ? data : data?.id;
  const optionData = typeof data === 'object' ? data : null;
  
  const displayValue = optionData?.string_value || 
                      optionData?.number_value?.toString() || 
                      (optionData?.jsonb_value ? JSON.stringify(optionData.jsonb_value) : '') ||
                      `Option ${optionId}`;

  return (
    <UIButton
      variant="outline"
      className="h-auto p-2 justify-start gap-2 min-w-0"
      {...props}
    >
      <Brain className="w-4 h-4 flex-shrink-0" />
      <span className="truncate text-xs font-mono">{optionData?.key || 'option'}</span>
      <span className="truncate text-xs text-muted-foreground">{displayValue}</span>
    </UIButton>
  );
}

export function Card({ data, onClose, ...props }: {
  data: OptionData | string;
  onClose?: () => void;
  [key: string]: any;
}) {
  const t = useTranslations('entities.options');
  const optionId = typeof data === 'string' ? data : data?.id;
  const optionData = typeof data === 'object' ? data : null;
  
  if (!optionData && typeof data === 'string') {
    return (
      <UICard className="w-80" {...props}>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            Option ID: {data}
            <br />
            <span className="text-xs">No additional data available</span>
          </div>
        </CardContent>
      </UICard>
    );
  }

  const value = optionData?.string_value || 
                optionData?.number_value || 
                optionData?.jsonb_value;

  return (
    <UICard className="w-80" {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-mono">{optionData?.key}</CardTitle>
              <p className="text-sm text-muted-foreground">Brain Option</p>
            </div>
          </div>
          {onClose && (
            <UIButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </UIButton>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="outline" className="text-xs font-mono">ID: {optionData?.id}</Badge>
            {optionData?.item_id && (
              <Badge variant="secondary" className="text-xs">Item: {optionData.item_id.slice(0, 8)}</Badge>
            )}
          </div>
          
          {value !== undefined && value !== null && (
            <div className="mt-3">
              <div className="text-xs font-medium mb-1">Value:</div>
              <div className="bg-muted rounded p-2 text-xs font-mono overflow-auto max-h-32">
                {typeof value === 'object' ? (
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                ) : (
                  <span>{String(value)}</span>
                )}
              </div>
            </div>
          )}

          {optionData?.to_id && (
            <div className="text-xs text-muted-foreground">
              References: {optionData.to_id.slice(0, 8)}...
            </div>
          )}

          {optionData?.created_at && (
            <div className="text-xs text-muted-foreground">
              Created: {new Date(optionData.created_at).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </UICard>
  );
}

export function CytoNode({ data, ...props }: {
  data: OptionData;
  [key: string]: any;
}) {
  const hasyx = useHasyx();
  
  console.log('[CytoNode] Rendering with data:', {
    id: data.id,
    key: data.key,
    user_id: data.user_id,
    item_id: data.item_id,
    string_value: data.string_value,
    number_value: data.number_value,
  });
  
  // Determine the table (global "" or wildcard "*")
  const table = data?.item_id ? '*' : '';
  
  // Get the appropriate component for this option type
  const OptionComponent = React.useMemo(() => {
    const component = getOptionComponent(table, data?.key);
    console.log(`[CytoNode] table="${table}", key="${data?.key}", component:`, component?.name || 'null');
    return component || DefaultBrainComponent;
  }, [table, data?.key]);

  // State management for different value types
  const [stringValue, setStringValue] = useState(data?.string_value || '');
  const [numberValue, setNumberValue] = useState(data?.number_value || 0);
  const [objectValue, setObjectValue] = useState(data?.jsonb_value || {});
  const [queryValue, setQueryValue] = useState(data?.jsonb_value || {});

  // Sync state with data changes
  React.useEffect(() => {
    setStringValue(data?.string_value || '');
    setNumberValue(data?.number_value || 0);
    setObjectValue(data?.jsonb_value || {});
    setQueryValue(data?.jsonb_value || {});
  }, [data?.string_value, data?.number_value, data?.jsonb_value]);

  const handleSave = useCallback(async () => {
    if (!data?.id) return;
    
    try {
      // Determine which field to update based on option key
      let _set: any = {};
      if (data.key === 'brain_string' || data.key === 'brain_ask' || data.key === 'brain_js' || data.key === 'brain_formula') {
        _set = { string_value: stringValue };
      } else if (data.key === 'brain_number') {
        _set = { number_value: numberValue };
      } else if (data.key === 'brain_object') {
        _set = { jsonb_value: objectValue };
      } else if (data.key === 'brain_query') {
        _set = { jsonb_value: queryValue };
      }

      console.log('[CytoNode] Saving option:', { id: data.id, key: data.key, _set });
      
      const result = await hasyx.update({
        table: 'options',
        pk_columns: { id: data.id },
        _set,
        returning: ['id', 'key', 'string_value', 'number_value', 'jsonb_value', 'user_id'],
      });
      
      console.log('[CytoNode] Update result:', result);
      
      if (!result) {
        throw new Error('Update returned null - record not found or no permissions');
      }
      
      toast.success('Brain option updated');
    } catch (error) {
      console.error('[CytoNode] Failed to update brain option:', error);
      toast.error('Failed to update option: ' + (error as any)?.message);
    }
  }, [hasyx, data?.id, data?.key, stringValue, numberValue, objectValue, queryValue]);

  const handleDelete = useCallback(async () => {
    if (!data?.id) return;
    
    try {
      await hasyx.delete({
        table: 'options',
        where: { id: { _eq: data.id } },
      });
      toast.success('Brain option deleted');
    } catch (error) {
      console.error('[CytoNode] Failed to delete brain option:', error);
      toast.error('Failed to delete option');
    }
  }, [hasyx, data?.id]);

  const handleTypeChange = useCallback(async (newKey: string) => {
    if (!data?.id) return;
    
    try {
      // Determine default value for new type and clear others
      let _set: any = {
        key: newKey,
        string_value: null,
        number_value: null,
        jsonb_value: null,
        boolean_value: null,
      };
      
      // Set default value based on new type (validator requires exactly one value)
      if (newKey === 'brain_string') {
        _set.string_value = 'New text';
      } else if (newKey === 'brain_ask') {
        _set.string_value = 'Enter your question...';
      } else if (newKey === 'brain_js') {
        _set.string_value = '// Enter JavaScript code';
      } else if (newKey === 'brain_formula') {
        _set.string_value = '1 + 1';
      } else if (newKey === 'brain_number') {
        _set.number_value = 0;
      } else if (newKey === 'brain_object' || newKey === 'brain_query') {
        _set.jsonb_value = {};
      } else {
        // Fallback to string for unknown types
        _set.string_value = 'Default value';
      }
      
      await hasyx.update({
        table: 'options',
        pk_columns: { id: data.id },
        _set,
      });
      
      toast.success(`Changed type to ${newKey}`);
    } catch (error) {
      console.error('[CytoNode] Failed to change option type:', error);
      toast.error('Failed to change type: ' + (error as any)?.message);
    }
  }, [hasyx, data?.id]);

  // Component props based on type
  const componentProps = React.useMemo(() => {
    if (data.key === 'brain_string' || data.key === 'brain_ask' || data.key === 'brain_js' || data.key === 'brain_formula') {
      return {
        data,
        value: stringValue,
        onChange: setStringValue,
        onSave: handleSave,
        onDelete: handleDelete,
        onTypeChange: handleTypeChange,
      };
    } else if (data.key === 'brain_number') {
      return {
        data,
        value: numberValue,
        onChange: setNumberValue,
        onSave: handleSave,
        onDelete: handleDelete,
        onTypeChange: handleTypeChange,
      };
    } else if (data.key === 'brain_object') {
      return {
        data,
        value: objectValue,
        onChange: setObjectValue,
        onSave: handleSave,
        onDelete: handleDelete,
        onTypeChange: handleTypeChange,
      };
    } else if (data.key === 'brain_query') {
      return {
        data,
        value: queryValue,
        onChange: (newValue: any) => {
          setQueryValue(newValue);
          // Auto-save for query component
          hasyx.update({
            table: 'options',
            pk_columns: { id: data.id },
            _set: { jsonb_value: newValue },
          }).then(() => {
            toast.success('Query updated');
          }).catch((error) => {
            console.error('Failed to update query:', error);
            toast.error('Failed to update query');
          });
        },
        onDelete: handleDelete,
        onTypeChange: handleTypeChange,
      };
    } else {
      return {
        data,
        value: data?.string_value || data?.number_value || data?.jsonb_value,
        onDelete: handleDelete,
        onTypeChange: handleTypeChange,
      };
    }
  }, [data, stringValue, numberValue, objectValue, queryValue, handleSave, handleDelete, handleTypeChange, hasyx]);

  return (
    <CytoNodeComponent
      {...props}
      element={{
        id: data.id,
        data: {
          id: data.id,
          label: '', // No label - component will handle display
        },
        ...props?.element,
        classes: cn('entity', 'brain-option', props.classes)
      }}
    >
      <OptionComponent {...componentProps} />
    </CytoNodeComponent>
  );
}

