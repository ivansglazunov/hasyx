"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Textarea } from 'hasyx/components/ui/textarea';
import { Button } from 'hasyx/components/ui/button';
import { Check, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { cn } from 'hasyx/lib/utils';
import { z } from 'zod';
import { options as schemaOptions } from '@/schema';
import { HasyxConstructorButton } from 'hasyx/lib/constructor';
import { useHasyx } from 'hasyx';
import { useDebounceCallback } from '@react-hook/debounce';
import { useBrainContextStore } from 'hasyx/lib/brain/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'hasyx/components/ui/dropdown-menu';

/**
 * Available brain option types
 */
const BRAIN_OPTION_TYPES = [
  { key: 'brain_string', label: 'String' },
  { key: 'brain_number', label: 'Number' },
  { key: 'brain_object', label: 'Object' },
  { key: 'brain_formula', label: 'Formula' },
  { key: 'brain_ask', label: 'Ask' },
  { key: 'brain_js', label: 'JavaScript' },
  { key: 'brain_query', label: 'Query' },
] as const;

/**
 * Option type selector component
 */
function OptionTypeSelector({
  data,
  onSelect,
}: {
  data: { key: string; [key: string]: any };
  onSelect: (newKey: string) => void;
}) {
  const currentType = BRAIN_OPTION_TYPES.find(t => t.key === data.key);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {BRAIN_OPTION_TYPES.map((type) => (
          <DropdownMenuItem
            key={type.key}
            onClick={() => onSelect(type.key)}
            className={cn(
              "cursor-pointer",
              data.key === type.key && "bg-accent"
            )}
          >
            {type.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Wrapper component with dotted background zone and optional header
 */
function BrainOptionWrapper({ 
  children, 
  className,
  data,
  headerContent,
}: { 
  children: React.ReactNode; 
  className?: string;
  data?: { id: string; [key: string]: any };
  headerContent?: React.ReactNode;
}) {
  return (
    <div 
      className={cn("relative", className)}
      style={{
        pointerEvents: 'none', // Dotted zone doesn't block events
        backgroundImage: 'radial-gradient(circle, rgba(100, 100, 100, 0.2) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        padding: '20px',
        paddingTop: '30px', // Extra space for header
      }}
    >
      {/* Header over dotted zone */}
      {data && (
        <div 
          className="absolute top-0 left-0 right-0 px-5 pt-2 pb-1"
          style={{ pointerEvents: 'all' }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-foreground/70">
              {data.id}
            </span>
            {headerContent}
          </div>
        </div>
      )}
      
      <div 
        className="border border-white rounded-md overflow-hidden"
        style={{ pointerEvents: 'all' }} // Content zone receives events
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Action buttons column (delete + save)
 */
function ActionButtons({ 
  onSave, 
  onDelete,
  isSaving 
}: { 
  onSave?: () => void; 
  onDelete?: () => void;
  isSaving?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {onDelete && (
        <Button
          onClick={onDelete}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {onSave && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

/**
 * Brain String Component - editable text area for brain_string options
 */
export function BrainStringComponent({ 
  data,
  value, 
  onChange, 
  onSave,
  onDelete,
  onTypeChange,
  placeholder = "Enter text...",
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: string;
  onChange: (value: string) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-start gap-2 p-2 bg-card w-[300px]">
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <OptionTypeSelector data={data} onSelect={onTypeChange} />
          </div>
        )}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-[100px] resize-none bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2"
        />
        <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain Ask Component - prompt editor for brain_ask options with result display
 */
export function BrainAskComponent({
  data,
  value,
  onChange,
  onSave,
  onDelete,
  onTypeChange,
  placeholder = "Enter prompt...",
  className,
}: {
  data: { id: string; key: string; item_options?: any[]; [key: string]: any };
  value: string;
  onChange: (value: string) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [localUpdatedAt, setLocalUpdatedAt] = useState<number | null>(null);
  const hasyx = useHasyx();

  // brain_name editor
  const nameOption = data.item_options?.find((opt: any) => opt.key === 'brain_name');
  const dbNameValue: string | undefined = nameOption?.string_value || undefined;
  const [nameInput, setNameInput] = useState<string>(dbNameValue || '');
  const userTouchedRef = useRef(false);
  useEffect(() => {
    if (!userTouchedRef.current && !nameInput && dbNameValue) {
      setNameInput(dbNameValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbNameValue]);
  const debouncedUpsertName = useDebounceCallback(async (nextValue: string) => {
    try {
      const existing = await hasyx.select<any[]>({
        table: 'options',
        where: { key: { _eq: 'brain_name' }, item_id: { _eq: data.id } },
        returning: ['id'],
        limit: 1,
      });
      if (existing && existing.length > 0) {
        await hasyx.update({ table: 'options', pk_columns: { id: existing[0].id }, _set: { string_value: nextValue } });
      } else {
        await hasyx.insert({ table: 'options', object: { key: 'brain_name', string_value: nextValue, item_id: data.id } });
      }
    } catch (e) {
      // ignore transient errors in background typing
    }
  }, 400);
  const headerStatus = useMemo(() => {
    if (nameInput === (dbNameValue ?? '')) return (
      <span className="text-xs text-green-600">✓</span>
    );
    return (
      <span className="text-[10px] text-muted-foreground truncate max-w-[140px]" title={dbNameValue || ''}>{dbNameValue || ''}</span>
    );
  }, [nameInput, dbNameValue]);
  const headerContent = (
    <div className="flex items-center gap-2 w-full">
      <input
        value={nameInput}
        onChange={(e) => { userTouchedRef.current = true; setNameInput(e.target.value); debouncedUpsertName(e.target.value); }}
        placeholder="name..."
        className="flex-1 text-xs bg-muted/50 rounded px-2 py-1 border border-transparent focus:border-border outline-none"
      />
      {headerStatus}
    </div>
  );

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
      setLocalUpdatedAt(Date.now());
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Find result option (brain_string with item_id pointing to this option)
  const resultOption = data.item_options?.find((opt: any) => opt.key === 'brain_string');
  const resultValue = resultOption?.string_value;
  const calculating = useMemo(() => {
    try {
      const hasInput = typeof value === 'string' && value.trim() !== '';
      if (!hasInput) return false;
      return isSaving || data?.updated_at > (resultOption?.updated_at || 0);
    } catch {
      return false;
    }
  }, [data?.updated_at, resultOption?.updated_at, value, isSaving, localUpdatedAt]);
  
  // Determine result state
  let resultState: 'empty' | 'loading' | 'ready' = 'empty';
  if (!value || value.trim() === '') {
    resultState = 'empty';
  } else if (resultValue) {
    resultState = 'ready';
  } else {
    resultState = 'loading';
  }

  return (
    <BrainOptionWrapper className={className} data={data} headerContent={headerContent}>
      <div className="bg-card w-[300px]">
        {/* Input area */}
        <div className="flex items-start gap-2 p-2">
          {onTypeChange && (
            <div className="flex flex-col gap-1">
              <OptionTypeSelector data={data} onSelect={onTypeChange} />
            </div>
          )}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-[100px] resize-none bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2"
          />
          <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
        </div>
        
        {/* Result area */}
        <div className="p-2 bg-muted/30">
          <div className="bg-muted rounded-md p-3 min-h-[60px] relative">
            {calculating && (
              <div className="absolute top-2 right-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {resultState === 'empty' && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-lg">❓</span>
                <span>Вопрос еще не задан</span>
              </div>
            )}
            {resultState === 'loading' && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Генерация ответа</span>
              </div>
            )}
            {resultState === 'ready' && (
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {resultValue}
              </div>
            )}
          </div>
        </div>
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain JS Component - code editor for brain_js options
 */
export function BrainJSComponent({
  data,
  value,
  onChange,
  onSave,
  onDelete,
  onTypeChange,
  placeholder = "// Enter JavaScript code...",
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: string;
  onChange: (value: string) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-start gap-2 p-2 bg-card w-[300px]">
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <OptionTypeSelector data={data} onSelect={onTypeChange} />
          </div>
        )}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-[100px] resize-none bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-xs px-3 py-2"
          spellCheck={false}
        />
        <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain Number Component - for brain_number options
 */
export function BrainNumberComponent({
  data,
  value,
  onChange,
  onSave,
  onDelete,
  onTypeChange,
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: number;
  onChange: (value: number) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  className?: string;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Determine font size based on number length
  const numberString = String(value);
  const fontSize = numberString.length <= 8 ? '2em' : '1em';

  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-center gap-2 p-2 bg-card w-[300px]">
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <OptionTypeSelector data={data} onSelect={onTypeChange} />
          </div>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 px-3 py-2 bg-muted/50 border-0 focus-visible:outline-none w-full text-center rounded-md"
          style={{ fontSize }}
        />
        <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain Object Component - for brain_object options
 */
export function BrainObjectComponent({
  data,
  value,
  onChange,
  onSave,
  onDelete,
  onTypeChange,
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: any;
  onChange: (value: any) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  className?: string;
}) {
  const [jsonString, setJsonString] = useState(() => 
    JSON.stringify(value || {}, null, 2)
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (newValue: string) => {
    setJsonString(newValue);
    try {
      const parsed = JSON.parse(newValue);
      onChange(parsed);
    } catch {
      // Invalid JSON, don't update
    }
  };

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-start gap-2 p-2 bg-card w-[300px]">
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <OptionTypeSelector data={data} onSelect={onTypeChange} />
          </div>
        )}
        <Textarea
          value={jsonString}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='{"key": "value"}'
          className="flex-1 h-[100px] resize-none bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-xs px-3 py-2"
          spellCheck={false}
        />
        <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain Query Component - uses Constructor for query building
 */
export function BrainQueryComponent({
  data,
  value,
  onChange,
  onDelete,
  onTypeChange,
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: any;
  onChange: (value: any) => void;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  className?: string;
}) {
  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-start gap-2 p-2 bg-card w-[300px]">
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <OptionTypeSelector data={data} onSelect={onTypeChange} />
          </div>
        )}
        <div className="flex-1">
          <HasyxConstructorButton
            value={value || { table: 'users', where: {}, returning: ['id'], role: 'anonymous' }}
            onChange={onChange}
            defaultTable="users"
            className="w-full"
          >
            <span className="text-xs">Edit Query</span>
          </HasyxConstructorButton>
        </div>
        <ActionButtons onDelete={onDelete} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Brain Formula Component - for brain_formula options with result display
 */
export function BrainFormulaComponent({
  data,
  value,
  onChange,
  onSave,
  onDelete,
  onTypeChange,
  placeholder = "Enter formula...",
  className,
}: {
  data: { id: string; key: string; item_options?: any[]; [key: string]: any };
  value: string;
  onChange: (value: string) => void;
  onSave?: () => Promise<void>;
  onDelete?: () => void;
  onTypeChange?: (newKey: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const hasyx = useHasyx();

  // brain_name editor
  const nameOption = data.item_options?.find((opt: any) => opt.key === 'brain_name');
  const dbNameValue: string | undefined = nameOption?.string_value || undefined;
  const [nameInput, setNameInput] = useState<string>(dbNameValue || '');
  const userTouchedRef = useRef(false);
  useEffect(() => {
    if (!userTouchedRef.current && !nameInput && dbNameValue) {
      setNameInput(dbNameValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbNameValue]);
  const debouncedUpsertName = useDebounceCallback(async (nextValue: string) => {
    try {
      const existing = await hasyx.select<any[]>({
        table: 'options',
        where: { key: { _eq: 'brain_name' }, item_id: { _eq: data.id }, user_id: { _eq: data.user_id } },
        returning: ['id'],
        limit: 1,
      });
      if (existing && existing.length > 0) {
        await hasyx.update({ table: 'options', pk_columns: { id: existing[0].id }, _set: { string_value: nextValue } });
      } else {
        await hasyx.insert({ table: 'options', object: { key: 'brain_name', string_value: nextValue, item_id: data.id, user_id: data.user_id } });
      }
    } catch (e) {
      // ignore
    }
  }, 400);
  const headerStatus = useMemo(() => {
    if (nameInput === (dbNameValue ?? '')) return (
      <span className="text-xs text-green-600">✓</span>
    );
    return (
      <span className="text-[10px] text-muted-foreground truncate max-w-[140px]" title={dbNameValue || ''}>{dbNameValue || ''}</span>
    );
  }, [nameInput, dbNameValue]);
  const headerContent = (
    <div className="flex items-center gap-2 w-full">
      <input
        value={nameInput}
        onChange={(e) => { userTouchedRef.current = true; setNameInput(e.target.value); debouncedUpsertName(e.target.value); }}
        placeholder="name..."
        className="flex-1 text-xs bg-muted/50 rounded px-2 py-1 border border-transparent focus:border-border outline-none"
      />
      {headerStatus}
    </div>
  );

  // Debug: parse variables in formula input and show above the textarea
  const [varNames, setVarNames] = useState<string[]>([]);
  const availableNames = useBrainContextStore(s => s.availableNames);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { parseBrainNames } = await import('hasyx/lib/brain');
        const vars = await parseBrainNames(value || '');
        if (active) setVarNames(Array.isArray(vars) ? vars : []);
      } catch {
        // Fallback simple parser
        try {
          const matches = Array.from(String(value || '').matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g)).map(m => m[1]);
          const unique = Array.from(new Set(matches)).sort();
          if (active) setVarNames(unique);
        } catch {
          if (active) setVarNames([]);
        }
      }
    })();
    return () => { active = false; };
  }, [value]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Find result option (brain_string with item_id pointing to this option)
  const resultOption = data.item_options?.find((opt: any) => opt.key === 'brain_string');
  const resultValue = resultOption?.string_value;
  const calculating = useMemo(() => {
    try {
      const hasInput = typeof value === 'string' && value.trim() !== '';
      if (!hasInput) return false;
      console.log('[COMPONENT]', data, resultOption);
      return isSaving || data?.updated_at > (resultOption?.updated_at || 0);
    } catch {
      return false;
    }
  }, [data]);
  
  // Determine result state
  let resultState: 'empty' | 'loading' | 'ready' = 'empty';
  if (!value || value.trim() === '') {
    resultState = 'empty';
  } else if (resultValue) {
    resultState = 'ready';
  } else {
    resultState = 'loading';
  }

  return (
    <BrainOptionWrapper className={className} data={data} headerContent={headerContent}>
      <div className="bg-card w-[300px]">
        {/* Debug variables row */}
        <div className="px-2 pt-1 text-[11px] text-muted-foreground space-y-0.5">
          <div className="flex flex-wrap gap-1 items-center">
            <span className="opacity-70">Vars:</span>
            {varNames.length > 0 ? varNames.map(v => (
              <span key={v} className="px-1.5 py-0.5 bg-muted rounded border border-border text-foreground/80">{v}</span>
            )) : <span className="opacity-50">none</span>}
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            <span className="opacity-70">Available:</span>
            {availableNames && availableNames.length > 0 ? availableNames.map(v => (
              <span key={v} className="px-1.5 py-0.5 bg-muted rounded border border-dashed text-foreground/70">{v}</span>
            )) : <span className="opacity-50">none</span>}
          </div>
        </div>
        {/* Input area */}
        <div className="flex items-start gap-2 p-2">
          {onTypeChange && (
            <div className="flex flex-col gap-1">
              <OptionTypeSelector data={data} onSelect={onTypeChange} />
            </div>
          )}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-[100px] resize-none bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm px-3 py-2"
          />
          <ActionButtons onDelete={onDelete} onSave={onSave ? handleSave : undefined} isSaving={isSaving} />
        </div>
        
        {/* Result area */}
        <div className="p-2 bg-muted/30">
          <div className="bg-muted rounded-md p-3 min-h-[60px] relative">
            {calculating && (
              <div className="absolute top-2 right-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            {resultState === 'empty' && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-lg">🔢</span>
                <span>Формула еще не задана</span>
              </div>
            )}
            {resultState === 'loading' && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Вычисление результата</span>
              </div>
            )}
            {resultState === 'ready' && (
              <div className="text-sm text-foreground font-mono">
                = {resultValue}
              </div>
            )}
          </div>
        </div>
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Default Brain Component - for other brain option types
 */
export function DefaultBrainComponent({
  data,
  value,
  onDelete,
  className,
}: {
  data: { id: string; key: string; [key: string]: any };
  value: any;
  onDelete?: () => void;
  className?: string;
}) {
  return (
    <BrainOptionWrapper className={className} data={data}>
      <div className="flex items-start gap-2 p-2 bg-card w-[300px]">
        <div className="flex-1 text-sm">
          {typeof value === 'object' ? (
            <pre className="text-xs overflow-auto">{JSON.stringify(value, null, 2)}</pre>
          ) : (
            <span>{String(value || 'No value')}</span>
          )}
        </div>
        <ActionButtons onDelete={onDelete} />
      </div>
    </BrainOptionWrapper>
  );
}

/**
 * Component registry - maps option keys to their React components
 * This is the source of truth for which component to use for each option key
 */
const BRAIN_COMPONENT_REGISTRY = {
  'brain': DefaultBrainComponent,
  'brain_string': BrainStringComponent,
  'brain_number': BrainNumberComponent,
  'brain_object': BrainObjectComponent,
  'brain_formula': BrainFormulaComponent,
  'brain_ask': BrainAskComponent,
  'brain_js': BrainJSComponent,
  'brain_query': BrainQueryComponent,
  'brain_prop_id': DefaultBrainComponent,
  'brain_name': DefaultBrainComponent,
} as const;

/**
 * Get the appropriate component for a brain option based on table and key
 * Reads BrainComponent from schema metadata via z.toJSONSchema()
 * @param table - The table name (e.g., "*" for wildcard, "" for global)
 * @param key - The option key (e.g., "brain_string")
 * @returns The component function or DefaultBrainComponent if not found
 */
export function getOptionComponent(table: string, key: string): React.ComponentType<any> {
  // Normalize table name
  const schemaKey = table === '*' ? '*' : table === '' ? '' : table;
  const tableSchema = (schemaOptions as any)[schemaKey];
  
  if (!tableSchema) {
    return DefaultBrainComponent;
  }

  try {
    // Convert Zod schema to JSON Schema to extract metadata
    const jsonSchema = z.toJSONSchema(tableSchema);
    
    // Get the property schema
    const properties = (jsonSchema as any).properties;
    if (!properties || !properties[key]) {
      // Fallback to registry for brain options
      if (isBrainOption(key)) {
        return (BRAIN_COMPONENT_REGISTRY as any)[key] || DefaultBrainComponent;
      }
      return DefaultBrainComponent;
    }
    
    const propertySchema = properties[key];
    
    // Check for BrainComponent in metadata
    const componentName = propertySchema.BrainComponent || propertySchema['x-meta']?.BrainComponent;
    
    if (componentName && typeof componentName === 'string') {
      // Map component name to actual component
      const componentMap: Record<string, React.ComponentType<any>> = {
        'BrainStringComponent': BrainStringComponent,
        'BrainAskComponent': BrainAskComponent,
        'BrainJSComponent': BrainJSComponent,
        'BrainNumberComponent': BrainNumberComponent,
        'BrainObjectComponent': BrainObjectComponent,
        'BrainQueryComponent': BrainQueryComponent,
        'BrainFormulaComponent': BrainFormulaComponent,
        'DefaultBrainComponent': DefaultBrainComponent,
      };
      
      return componentMap[componentName] || DefaultBrainComponent;
    }
    
    // Fallback to registry for brain options
    if (isBrainOption(key)) {
      return (BRAIN_COMPONENT_REGISTRY as any)[key] || DefaultBrainComponent;
    }
    
  } catch (e) {
    console.warn('[getOptionComponent] Error converting schema:', e);
    // Fallback to registry
    if (isBrainOption(key)) {
      return (BRAIN_COMPONENT_REGISTRY as any)[key] || DefaultBrainComponent;
    }
  }
  
  return DefaultBrainComponent;
}

/**
 * Check if an option key is a brain option
 */
export function isBrainOption(key: string): boolean {
  return key.startsWith('brain_') || key === 'brain';
}

/**
 * Get all brain option keys from the schema
 */
export function getBrainOptionKeys(): string[] {
  const keys: string[] = [];
  
  // Get from global options ("")
  const globalSchema = (schemaOptions as any)[''];
  if (globalSchema?.shape) {
    Object.keys(globalSchema.shape).forEach(key => {
      if (isBrainOption(key)) keys.push(key);
    });
  }
  
  // Get from wildcard options ("*")
  const wildcardSchema = (schemaOptions as any)['*'];
  if (wildcardSchema?.shape) {
    Object.keys(wildcardSchema.shape).forEach(key => {
      if (isBrainOption(key)) keys.push(key);
    });
  }
  
  return [...new Set(keys)]; // Remove duplicates
}
