// This file is executed only in Node CLI context via dynamic import from lib/config.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';

// Initialize debug logging
let debug: any;
try {
  const Debug = require('./debug').default;
  debug = Debug('hasyx:ink');
} catch (e) {
  debug = () => {};
}

// Компонент для редактирования варианта - показывает список полей с текущими значениями
function VariantEditor({ 
  schema, 
  config, 
  onConfig, 
  meta,
  onBack,
  fullConfig
}: { 
  schema: z.ZodSchema; 
  config: any; 
  onConfig: (newConfig: any) => void; 
  meta: any;
  onBack?: () => void;
  fullConfig?: any;
}) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [localConfig, setLocalConfig] = useState(config);
  
  // console.log(`VariantEditor - config:`, config);
  // console.log(`VariantEditor - localConfig:`, localConfig);
  // console.log(`VariantEditor - meta:`, meta);
  // console.log(`VariantEditor - fullConfig:`, fullConfig);
  
  // Обновляем локальную конфигурацию при изменении входящей конфигурации
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  

  
  // Если выбрано поле, показываем соответствующий компонент для этого поля
  if (selectedField) {
    const fieldSchema = (schema as z.ZodObject<any>).shape[selectedField];
    const fieldMeta = fieldSchema.meta ? fieldSchema.meta() : {};
    
    // Если поле имеет тип 'text', используем TextInput
    if (fieldMeta.type === 'text') {
      return (
        <Box flexDirection="column" gap={1}>
          <Text color="cyan">{fieldMeta.title || selectedField}</Text>
          {fieldMeta.description && <Text color="gray">{fieldMeta.description}</Text>}
          <TextInput
            defaultValue={localConfig[selectedField] || ''}
            onChange={(value) => {
              console.log(`VariantEditor TextInput onChange for ${selectedField}:`, value);
            }}
            onSubmit={(value) => {
              console.log(`VariantEditor TextInput onSubmit for ${selectedField}:`, value);
              const newLocalConfig = { ...localConfig, [selectedField]: value };
              setLocalConfig(newLocalConfig);
              // Обновляем глобальную конфигурацию
              onConfig(newLocalConfig);
              // Возвращаемся к списку полей после ввода
              setSelectedField(null);
            }}
            placeholder={fieldMeta.placeholder || `Enter ${selectedField}`}
          />
          <Text color="gray">Press Enter to save, Ctrl+C to cancel</Text>
        </Box>
      );
    }
    
    // Для всех остальных полей используем ReferenceSelector
    return (
      <ReferenceSelector
        schema={fieldSchema}
        config={fullConfig}
        onConfig={(value) => {
          console.log(`VariantEditor - field ${selectedField} selected:`, value);
          const newLocalConfig = { ...localConfig, [selectedField]: value };
          setLocalConfig(newLocalConfig);
          // Обновляем глобальную конфигурацию
          onConfig(newLocalConfig);
          // Возвращаемся к списку полей после выбора
          setSelectedField(null);
        }}
        meta={fieldMeta}
        onBack={() => {
          console.log(`VariantEditor - back from field ${selectedField}`);
          setSelectedField(null);
        }}
      />
    );
  }
  
  // Показываем список полей с текущими значениями
  const fields = meta.fields || [];
  const options = fields.map(field => {
    const currentValue = localConfig[field] || 'not set';
    const fieldSchema = (schema as z.ZodObject<any>).shape[field];
    const fieldMeta = fieldSchema.meta ? fieldSchema.meta() : {};
    
    // Получаем описание значения из fullConfig
    let description = currentValue;
    if (fullConfig && fieldMeta.referenceKey) {
      // Специальная обработка для smsProviders
      if (fieldMeta.referenceKey === 'smsProviders' && currentValue) {
        if (currentValue.startsWith('smsru.')) {
          description = `sms.ru (${currentValue.replace('smsru.', '')})`;
        } else if (currentValue.startsWith('smsaero.')) {
          description = `SMSAero (${currentValue.replace('smsaero.', '')})`;
        }
      } else {
        const refData = fullConfig[fieldMeta.referenceKey]?.[currentValue];
        if (refData && fieldMeta.descriptionTemplate) {
          description = fieldMeta.descriptionTemplate(refData);
        }
      }
    }
    
    return {
      label: `${field}: ${description}`,
      value: field
    };
  });
  
  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">VariantEditor - {meta.title}</Text>
      <Text color="cyan">{meta.title}</Text>
      <Text color="gray">{meta.description}</Text>
      <Text color="gray">Select field to configure:</Text>
      <Select
        options={[
          { label: '< back', value: 'back' },
          ...options
        ]}
        onChange={(value) => {
          console.log(`VariantEditor - selected:`, value);
          if (value === 'back') {
            if (onBack) onBack();
          } else {
            setSelectedField(value);
          }
        }}
      />
    </Box>
  );
}

// Компонент для ввода пароля без автоматического submit
function CustomPasswordInput({ label, description, value, error, onChange, onSubmit }: {
  label: string;
  description?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isActive, setIsActive] = useState(true);

  useInput((input, key) => {
    if (!isActive) return;
    
    if (key.return) {
      console.log(`CustomPasswordInput - Enter pressed for ${label}`);
      onSubmit();
    } else if (key.backspace || key.delete) {
      const newValue = inputValue.slice(0, -1);
      console.log(`CustomPasswordInput - Backspace for ${label}:`, newValue);
      setInputValue(newValue);
      onChange(newValue);
    } else if (input && !key.ctrl && !key.meta && !key.alt) {
      const newValue = inputValue + input;
      console.log(`CustomPasswordInput - Input for ${label}:`, newValue);
      setInputValue(newValue);
      onChange(newValue);
    }
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyan">{label}</Text>
      {description && <Text color="gray">{description}</Text>}
      <Box>
        <Text>{'*'.repeat(inputValue.length)}</Text>
        <Text color="gray"> (hidden)</Text>
      </Box>
      <Text color="gray">Press Enter to continue</Text>
      {error && <Text color="red">{error}</Text>}
    </Box>
  );
}

// Компонент для булевого ввода с управлением через y/n и пробел
function CustomBooleanInput({ label, description, value, error, onChange, onSubmit }: {
  label: string;
  description?: string;
  value: boolean;
  error?: string;
  onChange: (value: boolean) => void;
  onSubmit: () => void;
}) {
  const [localValue, setLocalValue] = useState<boolean>(!!value);

  useEffect(() => {
    setLocalValue(!!value);
  }, [value]);

  useInput((input, key) => {
    const lower = (input || '').toLowerCase();
    if (lower === 'y') {
      debug(`CustomBooleanInput - setting value to true for ${label}`);
      setLocalValue(true);
      onChange(true);
      debug(`CustomBooleanInput - value set to true, waiting for useEffect auto-submit`);
      return;
    }
    if (lower === 'n') {
      debug(`CustomBooleanInput - setting value to false for ${label}`);
      setLocalValue(false);
      onChange(false);
      debug(`CustomBooleanInput - value set to false, waiting for useEffect auto-submit`);
      return;
    }
    if (key.space || key.left || key.right) {
      const next = !localValue;
      debug(`CustomBooleanInput - toggling value to ${next} for ${label}`);
      setLocalValue(next);
      onChange(next);
      return;
    }
    if (key.return) {
      debug(`CustomBooleanInput - Enter pressed for ${label}`);
      onSubmit();
    }
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="cyan">{label}</Text>
      {description && <Text color="gray">{description}</Text>}
      <Text>
        {localValue ? 'Yes' : 'No'}
        {'  '}
        <Text color="gray">(y/n, ←/→/Space to toggle, Enter to confirm)</Text>
      </Text>
      {error && <Text color="red">{error}</Text>}
    </Box>
  );
}

// Рендерер работает только с переданными снаружи схемами/данными

// Динамические импорты для избежания проблем с top-level await
let render: any;
let Box: any;
let Text: any;
let useInput: any;
let TextInput: any;
let Select: any;
let ConfirmInput: any;
let PasswordInput: any;

// Инициализация импортов
async function initializeInk() {
  // Use dynamic eval-import to avoid TypeScript module resolution issues under current moduleResolution
  // eslint-disable-next-line no-eval
  const ink: any = await (eval('import("ink")'));
  // eslint-disable-next-line no-eval
  const inkUI: any = await (eval('import("@inkjs/ui")'));
  
  render = ink.render;
  Box = ink.Box;
  Text = ink.Text;
  useInput = ink.useInput;
  TextInput = inkUI.TextInput;
  Select = inkUI.Select;
  ConfirmInput = inkUI.ConfirmInput;
  PasswordInput = inkUI.PasswordInput;
  // Схемы и конфиг передаются из вызывающей стороны
}

interface FormProps {
  schema: z.ZodSchema;
  onSubmit: (data: any) => void | Promise<void>;
  initialData?: Record<string, any>;
  parentConfig?: any; // Родительский конфиг для reference-selector полей
}

interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
}

export function Form({ schema, onSubmit, initialData = {}, parentConfig }: FormProps) {
  const [formData, setFormData] = useState<Record<string, FieldState>>({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const schemaMeta: any = (schema as any).meta ? (schema as any).meta() : {};
  
  // Используем ref для отслеживания последнего значения поля
  const lastFieldValue = useRef<any>(null);
  const isProcessingField = useRef(false);

  // Вспомогательная функция: разворачиваем обёртки (optional/nullable/default/effects)
  const unwrapField = useCallback((field: z.ZodTypeAny): z.ZodTypeAny => {
    let current: any = field as any;
    // Ограничим количество шагов, чтобы избежать потенциальных циклов
    for (let i = 0; i < 5; i++) {
      const def = current?._def || {};
      if (current instanceof z.ZodOptional || current instanceof z.ZodNullable || current instanceof z.ZodDefault) {
        current = def.innerType || current;
        continue;
      }
      // ZodEffects
      if (def.type && def.type._def) {
        current = def.type;
        continue;
      }
      if (def.schema && def.schema._def) {
        current = def.schema;
        continue;
      }
      break;
    }
    return current as z.ZodTypeAny;
  }, []);

  const coerceToBoolean = useCallback((raw: any): boolean => {
    if (typeof raw === 'boolean') return raw;
    if (raw === 1 || raw === '1') return true;
    if (raw === 0 || raw === '0') return false;
    const str = typeof raw === 'string' ? raw.toLowerCase().trim() : '';
    if (str === 'true' || str === 'yes' || str === 'y') return true;
    if (str === 'false' || str === 'no' || str === 'n') return false;
    return !!raw;
  }, []);

  // Получаем поля из Zod схемы
  const getSchemaFields = useCallback((schema: z.ZodSchema): Array<{ key: string; field: z.ZodSchema }> => {
    if (schema instanceof z.ZodObject) {
      return Object.entries(schema.shape).map(([key, field]) => ({ 
        key, 
        field: field as z.ZodSchema 
      }));
    }
    return [];
  }, []);

  const fields = getSchemaFields(schema);

  // Инициализация состояния формы
  useEffect(() => {
    if (isInitialized) return;
    
    console.log('Form initializing with initialData:', initialData);
    const initialFormData: Record<string, FieldState> = {};
    fields.forEach(({ key, field }) => {
      let value = initialData[key];
      console.log(`Initializing field ${key}:`, { rawValue: value, fieldType: field.constructor.name });
      const baseField: any = unwrapField(field as any);
      
      if (baseField instanceof z.ZodBoolean) {
        value = coerceToBoolean(value);
        console.log(`Boolean field ${key} initialized with:`, value);
      } else if (baseField instanceof z.ZodEnum) {
        // Initialize enum with existing value or the first enum option
        const enumValues = (baseField as any)._def?.values 
          || (baseField as any)._def?.options 
          || (baseField as any).options 
          || (baseField as any).enum 
          || [];
        if (value === undefined || value === null || value === '') {
          value = enumValues[0] ?? '';
        }
        console.log(`Enum field ${key} initialized with:`, value, `(values: ${JSON.stringify(enumValues)})`);
      } else if (baseField instanceof z.ZodNumber || baseField instanceof z.ZodDefault) {
        // Для числовых полей и полей с значением по умолчанию
        let defaultValue = 0;
        let innerSchema = baseField;
        
        if (baseField instanceof z.ZodDefault) {
          defaultValue = (baseField as any)._def?.defaultValue || 0;
          innerSchema = (baseField as any)._def?.innerType;
          console.log(`Default field ${key} inner schema:`, innerSchema.constructor.name);
        } else {
          defaultValue = (baseField as any)._def?.defaultValue || 0;
        }
        
        value = (value !== undefined && value !== null && value !== '') ? Number(value) : defaultValue;
        console.log(`Number/Default field ${key} initialized with:`, value, `(default: ${defaultValue})`);
      } else {
        value = value || '';
        console.log(`Form field ${key}:`, value);
      }
      initialFormData[key] = {
        value,
        touched: false,
      };
    });
    console.log('Form initialFormData:', initialFormData);
    setFormData(initialFormData);
    setIsInitialized(true);
  }, [fields, initialData, isInitialized]);

  const currentField = fields[currentFieldIndex];
  const currentFieldState = formData[currentField?.key];

  const validateField = useCallback((key: string, value: any): string | undefined => {
    try {
      if (schema instanceof z.ZodObject) {
        const fieldSchema = schema.shape[key];
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
      return 'Invalid value';
    }
  }, [schema]);

  const handleFieldChange = useCallback((value: any) => {
    const logData = { 
      field: currentField?.key, 
      value, 
      isProcessing: isProcessingField.current,
      hasCurrentField: !!currentField
    };
    debug(`Form handleFieldChange START:`, logData);
    
    if (!currentField || isProcessingField.current) {
      const blockData = { 
        noField: !currentField, 
        isProcessing: isProcessingField.current 
      };
      debug(`Form handleFieldChange BLOCKED:`, blockData);
      return;
    }
    
    debug(`Form handleFieldChange - currentField:`, currentField);
    debug(`Form handleFieldChange - lastFieldValue:`, lastFieldValue.current);
    
    // Предотвращаем повторные вызовы с тем же значением
    if (lastFieldValue.current === value) {
      debug(`Form handleFieldChange - skipping duplicate value`);
      return;
    }
    lastFieldValue.current = value;
    
    const error = validateField(currentField.key, value);
    const validationData = { field: currentField.key, value, error };
    debug(`Form validation result:`, validationData);
    
    setFormData(prev => {
      debug(`Form setFormData - prev:`, prev);
      const newData = {
      ...prev,
      [currentField.key]: {
        value,
        error,
        touched: true,
      },
      };
      debug(`Form setFormData - newData:`, newData);
      return newData;
    });
  }, [currentField, validateField]);

  const handleFieldSubmit = useCallback(() => {
    debug(`Form handleFieldSubmit START:`, { 
      currentField: currentField?.key, 
      error: currentFieldState?.error, 
      isProcessing: isProcessingField.current,
      currentFieldIndex,
      fieldsLength: fields.length
    });
    
    if (!currentField || currentFieldState?.error || isProcessingField.current) {
      debug(`Form handleFieldSubmit BLOCKED:`, { 
        noField: !currentField, 
        hasError: !!currentFieldState?.error, 
        isProcessing: isProcessingField.current 
      });
      return;
    }

    debug(`Form handleFieldSubmit - proceeding with submit`);
    isProcessingField.current = true;
    
    if (currentFieldIndex < fields.length - 1) {
      debug(`Form handleFieldSubmit - moving to next field`);
      setCurrentFieldIndex(prev => {
        debug(`Form setCurrentFieldIndex - from ${prev} to ${prev + 1}`);
        return prev + 1;
      });
      // Сбрасываем ref для следующего поля
      setTimeout(() => {
        debug(`Form handleFieldSubmit - resetting refs`);
        lastFieldValue.current = null;
        isProcessingField.current = false;
      }, 100);
    } else {
      debug(`Form handleFieldSubmit - all fields complete, calling handleSubmit`);
      // Все поля заполнены, показываем финальное подтверждение
      handleSubmit();
    }
  }, [currentField, currentFieldState?.error, currentFieldIndex, fields.length]);

  const handleSubmit = useCallback(async () => {
    debug(`Form handleSubmit called with formData:`, formData);
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const finalData: Record<string, any> = {};
      Object.entries(formData).forEach(([key, state]) => {
        finalData[key] = state.value;
      });
      
      debug(`Form submitting finalData:`, finalData);
      await onSubmit(finalData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, isSubmitting]);

  // Отключено: глобальный авто-переход по любому изменению значения поля
  // useEffect(() => {
  //   if (currentField && currentFieldState && !currentFieldState.error && currentFieldState.touched) {
  //     const timeoutId = setTimeout(() => {
  //       if (!isProcessingField.current) {
  //         debug(`Form useEffect - auto-submitting field ${currentField.key}`);
  //         handleFieldSubmit();
  //       }
  //     }, 100);
  //     
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [currentFieldState?.value, currentFieldState?.touched, currentFieldState?.error, currentField, handleFieldSubmit]);

  const renderField = useCallback(() => {
    if (!currentField || !isInitialized) return null;

    const { key, field } = currentField;
    const state = currentFieldState;
    const baseField: any = unwrapField(field as any);
    const description = (baseField as any)._def?.description || (field as any)._def?.description || '';
    const meta = (field as any).meta ? (field as any).meta() : {};
    
    // Проверяем, является ли поле reference-selector
    console.log(`Field ${key} meta:`, meta);
    console.log(`Field ${key} parentConfig:`, parentConfig);
    if (meta?.type === 'reference-selector' && parentConfig) {
      console.log(`Rendering ReferenceSelector for field ${key}`);
      return (
        <ReferenceSelector 
          schema={field}
          config={parentConfig}
          onConfig={(value) => {
            console.log(`ReferenceSelector onConfig - setting value and moving to next field`);
            handleFieldChange(value);
            // Явный переход к следующему полю после выбора
            setTimeout(() => {
              handleFieldSubmit();
            }, 100);
          }}
          meta={meta}
          onBack={() => {
            console.log(`ReferenceSelector onBack called - currentFieldIndex: ${currentFieldIndex}`);
            // Возвращаемся к предыдущему полю
            if (currentFieldIndex > 0) {
              console.log(`Setting currentFieldIndex from ${currentFieldIndex} to ${currentFieldIndex - 1}`);
              setCurrentFieldIndex(prev => prev - 1);
            } else {
              console.log(`Already at first field, cannot go back further`);
            }
          }}
        />
      );
    }

    // Определяем тип поля
    if (baseField instanceof z.ZodEnum) {
      let enumValues = (baseField as any)._def?.values 
        || (baseField as any)._def?.options 
        || (baseField as any).options 
        || (baseField as any).enum 
        || [];
      if ((!enumValues || enumValues.length === 0) && (baseField as any).meta) {
        const m = (baseField as any).meta();
        if (m?.options && Array.isArray(m.options)) enumValues = m.options;
      }
      const options = enumValues.map((v: any) => ({ label: String(v), value: v }));
      return (
        <Box flexDirection="column" gap={1}>
          <Text color="cyan">{key}</Text>
          {description && <Text color="gray">{description}</Text>}
          <Select
            options={options}
            onChange={(value) => {
              console.log(`Enum Select onChange for ${key}:`, value);
              handleFieldChange(value);
              // Если форма состоит из одного enum-поля (как files.backend) — сохраняем сразу,
              // чтобы избежать гонок со стейтом и повторных перезаписей
              if (fields.length <= 1) {
                try {
                  const immediateData: Record<string, any> = {};
                  Object.entries(formData).forEach(([k, st]) => {
                    immediateData[k] = k === key ? value : (st as FieldState).value;
                  });
                  if (!(key in immediateData)) immediateData[key] = value;
                  void onSubmit(immediateData);
                } catch {}
                return;
              }
              // Иначе переходим к следующему полю
              setTimeout(() => {
                handleFieldSubmit();
              }, 100);
            }}
          />
          {state?.error && <Text color="red">{state.error}</Text>}
        </Box>
      );
    }

    // Для строковых полей
    if (baseField instanceof z.ZodString) {
      const isPassword = key.toLowerCase().includes('secret') || 
                        key.toLowerCase().includes('password') || 
                        key.toLowerCase().includes('token');

      if (isPassword) {
        console.log(`Password field ${key}:`, { value: state?.value, defaultValue: state?.value || '' });
        return <CustomPasswordInput 
              key={`password-${currentFieldIndex}-${key}`}
          label={key}
          description={description}
          value={state?.value || ''}
          error={state?.error}
              onChange={handleFieldChange}
              onSubmit={handleFieldSubmit}
        />;
      }

      console.log(`Form renderField - creating TextInput for ${key}:`, {
        key: `text-${currentFieldIndex}-${key}`,
        defaultValue: state?.value || '',
        placeholder: `Enter ${key.toLowerCase()}`
      });

      return (
        <Box flexDirection="column" gap={1}>
          <Text color="cyan">{key}</Text>
          {description && <Text color="gray">{description}</Text>}
          <TextInput
            key={`text-${currentFieldIndex}-${key}`}
            defaultValue={state?.value || ''}
            onChange={(value) => {
              console.log(`TextInput onChange for ${key}:`, value);
              handleFieldChange(value);
            }}
            onSubmit={() => {
              console.log(`TextInput onSubmit for ${key} - Enter pressed`);
              handleFieldSubmit();
            }}
            placeholder={`Enter ${key.toLowerCase()}`}
          />
          {state?.error && <Text color="red">{state.error}</Text>}
        </Box>
      );
    }

    // Для булевых полей
    if (baseField instanceof z.ZodBoolean) {
      console.log(`Boolean field ${key}:`, { value: state?.value, defaultValue: state?.value || false });
      return (
        <CustomBooleanInput
          label={key}
          description={description}
          value={!!state?.value}
          error={state?.error}
          onChange={handleFieldChange}
          onSubmit={handleFieldSubmit}
        />
      );
    }

    // Для числовых полей и полей с значением по умолчанию
    if (field instanceof z.ZodNumber || field instanceof z.ZodDefault) {
      console.log(`Number field ${key}:`, { value: state?.value, defaultValue: state?.value || '' });
      return (
        <Box flexDirection="column" gap={1}>
          <Text color="cyan">{key}</Text>
          {description && <Text color="gray">{description}</Text>}
          <TextInput
            key={`number-${currentFieldIndex}-${key}`}
            defaultValue={String(state?.value || '')}
            onChange={(value) => {
              console.log(`NumberTextInput onChange for ${key}:`, value);
              // Преобразуем строку в число для числовых полей
              const numValue = parseInt(value, 10);
              if (!isNaN(numValue)) {
                handleFieldChange(numValue);
              } else {
                // Для невалидных чисел передаем undefined, чтобы показать ошибку
                handleFieldChange(undefined);
              }
            }}
            onSubmit={() => {
              console.log(`NumberTextInput onSubmit for ${key} - Enter pressed`);
              handleFieldSubmit();
            }}
            placeholder={`Enter ${key.toLowerCase()}`}
          />
          {state?.error && <Text color="red">{state.error}</Text>}
        </Box>
      );
    }

    // Для остальных типов используем текстовый ввод
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="cyan">{key}</Text>
        {description && <Text color="gray">{description}</Text>}
        <TextInput
          key={`text-${currentFieldIndex}-${key}`}
          defaultValue={state?.value || ''}
            onChange={(value) => {
              console.log(`GenericTextInput onChange for ${key}:`, value);
              handleFieldChange(value);
            }}
            onSubmit={() => {
              console.log(`GenericTextInput onSubmit for ${key} - Enter pressed`);
              handleFieldSubmit();
            }}
          placeholder={`Enter ${key.toLowerCase()}`}
        />
        {state?.error && <Text color="red">{state.error}</Text>}
      </Box>
    );
  }, [currentField, currentFieldState, isInitialized, handleFieldChange, handleFieldSubmit]);

  if (isSubmitting) {
    return (
      <Box>
        <Text color="yellow">Submitting form...</Text>
      </Box>
    );
  }

  if (fields.length === 0) {
    return (
      <Box>
        <Text color="red">No fields found in schema</Text>
      </Box>
    );
  }

  if (!isInitialized) {
    return (
      <Box>
        <Text color="yellow">Initializing form...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={2}>
      <Text color="green" bold>
        Form Configuration ({currentFieldIndex + 1}/{fields.length})
      </Text>
      {schemaMeta?.title && <Text color="cyan">{schemaMeta.title}</Text>}
      {schemaMeta?.description && <Text color="gray">{schemaMeta.description}</Text>}
      {renderField()}
      <Box marginTop={1}>
        <Text color="gray">
          Press Enter to continue, Ctrl+C to cancel
        </Text>
      </Box>
    </Box>
  );
}



// Универсальный компонент для добавления нового ключа
function AddNewKey({ schema, defaultKeys, onAdd, onBack }: { 
  schema: z.ZodSchema; 
  defaultKeys: string[]; 
  onAdd: (key: string, data: any) => void;
  onBack: () => void;
}) {
  const [custom, setCustom] = useState(false);
  const [keyName, setKeyName] = useState('');

  // Обработка клавиши Escape
  useInput((input, key) => {
    if (key.escape) {
      console.log(`AddNewKey useInput - Escape pressed`);
      if (custom) {
        setCustom(false);
        setKeyName('');
      } else {
        onBack();
      }
    }
  });

  const options = [
    { label: '< back', value: 'back' },
    ...defaultKeys.map(key => ({ label: key, value: key })),
    { label: 'custom', value: 'custom' }
  ];

  if (custom) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">AddNewKey</Text>
        <Text color="cyan">Enter custom name:</Text>
        <TextInput
          onChange={setKeyName}
          onSubmit={() => {
            if (keyName.trim()) {
              onAdd(keyName.trim(), {});
            }
          }}
          placeholder="Enter custom name"
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">AddNewKey</Text>
      <Text color="cyan">Select key or enter custom:</Text>
      <Select
        options={options}
        onChange={(value) => {
          if (value === 'back') {
            onBack();
          } else if (value === 'custom') {
            setCustom(true);
          } else {
            onAdd(value, {});
          }
        }}
      />
    </Box>
  );
}

// Универсальный компонент для списка ключей
function KeysList({ 
  schema, 
  config, 
  onConfig, 
  meta,
  onBack,
  fullConfig
}: { 
  schema: z.ZodSchema; 
  config: Record<string, any>; 
  onConfig: (newConfig: any) => void; 
  meta: any;
  onBack: () => void;
  fullConfig?: any; // Полный конфиг для reference-selector полей
}) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAction, setShowAction] = useState(false);

  // Обработка клавиши Escape
  useInput((input, key) => {
    if (key.escape) {
      console.log(`KeysList useInput - Escape pressed`);
      if (showAction) {
        setSelectedKey(null);
        setShowAction(false);
      } else if (showAdd) {
        setShowAdd(false);
      } else if (selectedKey) {
        setSelectedKey(null);
      }
    }
  });

  const keys = Object.keys(config);
  
  // Функция для получения описания ключа
  const getKeyDescription = (keyData: any) => {
    // Используем descriptionTemplate из метаданных схемы
    const schemaMeta = schema.meta ? schema.meta() : {};
    if (schemaMeta?.descriptionTemplate && typeof schemaMeta.descriptionTemplate === 'function') {
      return schemaMeta.descriptionTemplate(keyData);
    }
    return 'no description';
  };

  if (selectedKey && showAction) {
    const actionOptions = [
      { label: '< back', value: 'back' },
      { label: 'update', value: 'update' },
      { label: 'delete', value: 'delete' }
    ];

    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">KeysList - {selectedKey}</Text>
        <Text color="cyan">Select action:</Text>
        <Select
          options={actionOptions}
          onChange={(value) => {
            if (value === 'back') {
              setSelectedKey(null);
              setShowAction(false);
            } else if (value === 'update') {
              setShowAction(false);
            } else if (value === 'delete') {
              const { [selectedKey]: deleted, ...restConfig } = config;
              onConfig(restConfig);
              setSelectedKey(null);
              setShowAction(false);
              // Возвращаемся к списку после удаления
            }
          }}
        />
      </Box>
    );
  }

  if (selectedKey) {
    const addSchema = meta.add;
    const initialData = config[selectedKey] || {};
    
    // Проверяем метаданные схемы для определения типа редактора
    const addSchemaMeta = addSchema.meta ? addSchema.meta() : {};
    console.log(`KeysList - selectedKey: ${selectedKey}, addSchema meta:`, addSchemaMeta);
    
    // Если схема имеет тип 'variant-editor', используем VariantEditor
    if (addSchemaMeta?.type === 'variant-editor') {
      console.log('KeysList - Using VariantEditor for variant-editor schema');
      return (
        <Box flexDirection="column" gap={1}>
          <Text color="gray">KeysList - {selectedKey}</Text>
          <VariantEditor 
            schema={addSchema}
            config={initialData}
            onConfig={(formData) => {
              const updatedConfig = { ...config, [selectedKey]: formData };
              onConfig(updatedConfig);
              // НЕ возвращаемся к списку, остаемся в VariantEditor
              // setSelectedKey(null);
            }}
            meta={addSchemaMeta}
            onBack={() => {
              console.log('VariantEditor onBack - returning to KeysList');
              setSelectedKey(null);
            }}
            fullConfig={fullConfig || config}
          />
        </Box>
      );
    }
    
    // Для остальных схем используем Form
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">KeysList - {selectedKey}</Text>
        <Form 
          key={`form-${selectedKey}-${Date.now()}`}
          schema={addSchema} 
          initialData={initialData}
          parentConfig={fullConfig || config} // Передаем полный конфиг или локальный
          onSubmit={(formData) => {
            const updatedConfig = { ...config, [selectedKey]: formData };
            onConfig(updatedConfig);
            setSelectedKey(null);
            // Возвращаемся к списку после редактирования
          }}
        />
      </Box>
    );
  }

  if (showAdd) {
    return (
      <AddNewKey 
        schema={meta.add}
        defaultKeys={meta.default}
        onAdd={(key, data) => {
          // Создаем пустую структуру для нового ключа
          const updated = { ...config, [key]: {} };
          onConfig(updated);
          setShowAdd(false);
          // Возвращаемся к списку после создания
        }}
        onBack={() => setShowAdd(false)}
      />
    );
  }

  const options = [
    { label: '< back', value: 'back' },
    ...keys.map(key => ({ 
      label: `${key} (${getKeyDescription(config[key])})`, 
      value: key 
    })),
    { label: '+ add', value: 'add' }
  ];

  // Если нет ключей, показываем только опции back и add
  if (keys.length === 0) {
    const emptyOptions = [
      { label: '< back', value: 'back' },
      { label: '+ add', value: 'add' }
    ];

    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">KeysList - {meta.data}</Text>
        <Text color="cyan">No {meta.data} configurations found. Add one:</Text>
        <Select
          options={emptyOptions}
          onChange={(value) => {
            if (value === 'back') {
              onBack();
            } else if (value === 'add') {
              setShowAdd(true);
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">KeysList - {meta.data}</Text>
      <Text color="cyan">Select {meta.data} configuration:</Text>
      <Select
        options={options}
        onChange={(value) => {
          if (value === 'back') {
            onBack();
          } else if (value === 'add') {
            setShowAdd(true);
          } else {
            setSelectedKey(value);
            setShowAction(true);
          }
        }}
      />
    </Box>
  );
}

// Компонент для выбора из существующих конфигураций
function ReferenceSelector({ 
  schema, 
  config, 
  onConfig, 
  meta,
  onBack
}: { 
  schema: z.ZodSchema; 
  config: any; 
  onConfig: (newConfig: any) => void; 
  meta: any;
  onBack?: () => void;
}) {
  // Получаем список доступных конфигураций из конфига
  let references = config[meta.referenceKey] || {};
  let referenceKeys = Object.keys(references);
  
  // Специальная обработка для smsProviders - объединяем smsru и smsaero
  if (meta.referenceKey === 'smsProviders') {
    references = {};
    const smsruConfigs = config.smsru || {};
    const smsaeroConfigs = config.smsaero || {};
    
    // Добавляем все sms.ru конфигурации с префиксом
    Object.keys(smsruConfigs).forEach(key => {
      references[`smsru.${key}`] = { ...smsruConfigs[key], type: 'smsru', provider: 'sms.ru' };
    });
    
    // Добавляем все SMSAero конфигурации с префиксом  
    Object.keys(smsaeroConfigs).forEach(key => {
      references[`smsaero.${key}`] = { ...smsaeroConfigs[key], type: 'smsaero', provider: 'SMSAero' };
    });
    
    referenceKeys = Object.keys(references);
  }
  
  // Проверяем, является ли поле опциональным
  const isOptional = schema instanceof z.ZodOptional || schema instanceof z.ZodNullable;
  
  // Если нет конфигураций, показываем сообщение
  if (referenceKeys.length === 0) {
    const options = [
      { label: meta.backLabel, value: 'back' }
    ];
    
    // Добавляем опцию undefined для опциональных полей
    if (isOptional) {
      options.push({ label: 'undefined (remove field)', value: 'undefined' });
    }
    
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">ReferenceSelector - {meta.data}</Text>
        <Text color="cyan">{meta.title}</Text>
        <Text color="red">{meta.emptyMessage}</Text>
        <Select
          options={options}
          onChange={(value) => {
            if (value === 'back' && onBack) {
              onBack();
            } else if (value === 'undefined') {
              onConfig(undefined);
            }
          }}
        />
      </Box>
    );
  }
  
  // Если есть конфигурации, показываем список для выбора
  const options = [
    { label: meta.backLabel, value: 'back' },
    ...referenceKeys.map(key => ({ 
      label: `${key} (${getReferenceDescription(references[key], meta)})`, 
      value: key 
    }))
  ];
  
  // Добавляем опцию undefined для опциональных полей между списком и back
  if (isOptional) {
    options.splice(1, 0, { label: 'undefined (remove field)', value: 'undefined' });
  }
  
  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">ReferenceSelector - {meta.data}</Text>
      <Text color="cyan">{meta.title}</Text>
      <Text color="gray">{meta.description}</Text>
      <Select
        options={options}
        onChange={(value) => {
          console.log(`ReferenceSelector onChange:`, { value, meta: meta.data });
          if (value === 'back') {
            if (onBack) onBack();
          } else if (value === 'undefined') {
            // Убираем поле из конфигурации
            console.log(`ReferenceSelector calling onConfig with undefined`);
            onConfig(undefined);
          } else {
            // Устанавливаем выбранную конфигурацию
            console.log(`ReferenceSelector calling onConfig with:`, value);
            onConfig(value);
          }
        }}
      />
    </Box>
  );
}

// Функция для получения описания конфигурации
function getReferenceDescription(refData: any, meta: any) {
  // Используем шаблон из метаданных если есть
  if (meta.descriptionTemplate && typeof meta.descriptionTemplate === 'function') {
    return meta.descriptionTemplate(refData);
  }
  return 'no description';
}

// Компонент для выбора варианта
function VariantSelector({ 
  schema, 
  config, 
  onConfig, 
  meta,
  onBack
}: { 
  schema: z.ZodSchema; 
  config: any; 
  onConfig: (newConfig: any) => void; 
  meta: any;
  onBack?: () => void;
}) {
  // Получаем список доступных вариантов из конфига
  const variants = config[meta.variantsKey] || {};
  const variantKeys = Object.keys(variants);
  
  // Если нет вариантов, показываем сообщение
  if (variantKeys.length === 0) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="gray">VariantSelector</Text>
        <Text color="cyan">{meta.title}</Text>
        <Text color="red">{meta.emptyMessage}</Text>
        <Select
          options={[{ label: meta.backLabel, value: 'back' }]}
          onChange={(value) => {
            if (value === 'back' && onBack) {
              onBack();
            }
          }}
        />
      </Box>
    );
  }
  
  // Если есть варианты, показываем список для выбора
  const options = [
    { label: meta.backLabel, value: 'back' },
    ...variantKeys.map(key => ({ 
      label: `${key} (${variants[key]?.host || 'no host'} -> ${variants[key]?.hasura || 'no hasura'})`, 
      value: key 
    }))
  ];
  
  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">VariantSelector</Text>
      <Text color="cyan">{meta.title}</Text>
      <Text color="gray">{meta.description}</Text>
      <Select
        options={options}
        onChange={(value) => {
          if (value === 'back') {
            if (onBack) onBack();
          } else {
            // Устанавливаем выбранный вариант
            onConfig(value);
          }
        }}
      />
    </Box>
  );
}

// Универсальный компонент для секций конфигурации
function ConfigSection({ 
  schema, 
  config, 
  onConfig,
  onBack,
  fullConfig
}: { 
  schema: z.ZodSchema; 
  config: any; 
  onConfig: (newConfig: any) => void;
  onBack?: () => void;
  fullConfig?: any; // Полный конфиг для reference-selector полей
}) {
  const meta = (schema as any).meta ? (schema as any).meta() : undefined;
  // console.log('ConfigSection meta:', meta);
  // console.log('ConfigSection config:', config);
  
  // Используем KeysList для схем с метаданными типа 'keys'
  if (meta?.type === 'keys') {
    console.log('Using KeysList for type keys');
    return (
      <KeysList 
        schema={schema}
        config={config}
        onConfig={onConfig}
        meta={meta}
        fullConfig={fullConfig || config} // Передаем полный конфиг или локальный
        onBack={() => {
          // Возвращаемся к корню
          if (onBack) {
            onBack();
          }
        }}
      />
    );
  }
  
  // Используем VariantSelector для схем с метаданными типа 'variant-selector'
  if (meta?.type === 'variant-selector') {
    console.log('Using VariantSelector for type variant-selector');
    return (
      <VariantSelector 
        schema={schema}
        config={config}
        onConfig={onConfig}
        meta={meta}
        onBack={onBack}
      />
    );
  }
  
  // Используем VariantEditor для схем с метаданными типа 'variant-editor'
  if (meta?.type === 'variant-editor') {
    console.log('Using VariantEditor for type variant-editor');
    return (
      <VariantEditor 
        schema={schema}
        config={config}
        onConfig={onConfig}
        meta={meta}
        onBack={onBack}
        fullConfig={fullConfig}
      />
    );
  }
  
  // Используем ReferenceSelector для схем с метаданными типа 'reference-selector'
  if (meta?.type === 'reference-selector') {
    console.log('Using ReferenceSelector for type reference-selector');
    return (
      <ReferenceSelector 
        schema={schema}
        config={fullConfig || config}
        onConfig={onConfig}
        meta={meta}
        onBack={onBack}
      />
    );
  }
  
  // Для остальных схем используем Form
  console.log('Using Form for other types');
  return (
    <Form 
      schema={schema}
      initialData={config}
      onSubmit={onConfig}
      parentConfig={config} // Передаем родительский конфиг для reference-selector полей
    />
  );
}


// Компонент для управления вариантами конфигурации
function ConfigVariants({ config, onConfig }: { config: Record<string, any>, onConfig: (variantsConfig: Record<string, any>) => void }) {
  useEffect(() => {
    const handleKeyPress = () => {
      onConfig(config);
    };

    process.stdin.once('data', handleKeyPress);
    return () => {
      process.stdin.removeListener('data', handleKeyPress);
    };
  }, [onConfig, config]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">ConfigVariants</Text>
      <Text color="cyan">Variants management:</Text>
      <Text color="gray">Variants count: {Object.keys(config).length}</Text>
      <Text>Press any key to continue...</Text>
    </Box>
  );
}

// Компонент для управления хостами
function ConfigHosts({ config, onConfig }: { config: Record<string, any>, onConfig: (hostsConfig: Record<string, any>) => void }) {
  useEffect(() => {
    const handleKeyPress = () => {
      onConfig(config);
    };

    process.stdin.once('data', handleKeyPress);
    return () => {
      process.stdin.removeListener('data', handleKeyPress);
    };
  }, [onConfig, config]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">ConfigHosts</Text>
      <Text color="cyan">Hosts management:</Text>
      <Text color="gray">Hosts count: {Object.keys(config).length}</Text>
      <Text>Press any key to continue...</Text>
    </Box>
  );
}

// Компонент для управления глобальными переменными
function ConfigEnv({ config, onConfig }: { config: Record<string, any>, onConfig: (envConfig: Record<string, any>) => void }) {
  useEffect(() => {
    const handleKeyPress = () => {
      onConfig(config);
    };

    process.stdin.once('data', handleKeyPress);
    return () => {
      process.stdin.removeListener('data', handleKeyPress);
    };
  }, [onConfig, config]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">ConfigEnv</Text>
      <Text color="cyan">Environment variables management:</Text>
      <Text color="gray">Env variables count: {Object.keys(config).length}</Text>
      <Text>Press any key to continue...</Text>
    </Box>
  );
}

// Компонент для управления вариантом
function ConfigVariant({ config, onConfig }: { config: string, onConfig: (variantConfig: string) => void }) {
  useEffect(() => {
    const handleKeyPress = () => {
      onConfig(config);
    };

    process.stdin.once('data', handleKeyPress);
    return () => {
      process.stdin.removeListener('data', handleKeyPress);
    };
  }, [onConfig, config]);

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">ConfigVariant</Text>
      <Text color="cyan">Current variant:</Text>
      <Text color="gray">{config}</Text>
      <Text>Press any key to continue...</Text>
    </Box>
  );
}

// Основной компонент конфигурации (UI-генератор по схемам)
function Config({ fileSchema, config: initialConfig, onChange }: { fileSchema: z.ZodSchema, config: any, onChange: (newConfig: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [config, setConfig] = useState(initialConfig);

  // Динамически создаем опции на основе переданной корневой схемы
  const options = Object.keys((fileSchema as any).shape).map(key => {
    const configValue = config[key];
    const fieldSchema = (fileSchema as any).shape[key];
    const meta = (fieldSchema && (fieldSchema as any).meta) ? (fieldSchema as any).meta() : {};
    
    let displayValue = '';
    
    // Специальная обработка для поля variant - показываем название выбранного варианта
    if (key === 'variant' && meta.type === 'reference-selector') {
      const selectedVariant = configValue;
      if (selectedVariant && config.variants && config.variants[selectedVariant]) {
        const variantData = config.variants[selectedVariant];
        // Используем descriptionTemplate из метаданных для отображения
        if (meta.descriptionTemplate && typeof meta.descriptionTemplate === 'function') {
          displayValue = meta.descriptionTemplate(variantData);
        } else {
          // Fallback: показываем host -> hasura
          const host = variantData?.host || 'no host';
          const hasura = variantData?.hasura || 'no hasura';
          displayValue = `${host} -> ${hasura}`;
        }
      } else {
        displayValue = selectedVariant || 'not set';
      }
    } else {
      // Для остальных полей показываем количество
      let count = 0;
      if (Array.isArray(configValue)) {
        count = configValue.length;
      } else if (typeof configValue === 'object' && configValue !== null) {
        count = Object.keys(configValue).length;
      } else if (configValue !== undefined && configValue !== null) {
        count = 1;
      }
      displayValue = count.toString();
    }
    
    return {
      label: `${key} (${displayValue})`,
      value: key
    };
  });

  const handleConfig = (newConfig: any) => {
    const updatedConfig = { ...config };
    
    // Динамически обновляем конфигурацию на основе выбранного поля
    if (selected) {
      // Если меняем variant — избегаем бесконечного цикла
      if (selected === 'variant') {
        if (newConfig === config.variant) {
          // Нет изменения — просто выходим
          setSelected(null);
          return;
        }
        updatedConfig.variant = newConfig;
        // Сразу выходим на корень, чтобы не перерисовывать ReferenceSelector с автосабмитом
        setSelected(null);
        // Отдаем изменение наверх (там уже есть автогенерация .env)
        onChange(updatedConfig);
        setConfig(updatedConfig);
        return;
      }

      updatedConfig[selected] = newConfig;
      
      // Возвращаемся к корню только для простых секций (не keys)
      const fieldSchema = (fileSchema as any).shape[selected];
      const meta = fieldSchema.meta ? fieldSchema.meta() : {};
      if (meta.type !== 'keys') {
        setSelected(null);
      }
    }
    
    onChange(updatedConfig);
    setConfig(updatedConfig);
  };

  const handleBack = () => {
    setSelected(null); // Возвращаемся к корню
  };

  if (selected) {
    // Динамически получаем схему для выбранного поля
      const fieldSchema = (fileSchema as any).shape[selected];
    const configValue = config[selected] || {};

    // Если схемы для выбранного поля нет — безопасно выходим на корень
    if (!fieldSchema) {
      console.warn(`Schema for selected field '${selected}' not found in hasyxConfig.file.shape`);
      setSelected(null);
      return null;
    }
    
    const safeMeta = (fieldSchema as any).meta ? (fieldSchema as any).meta() : undefined;
    
    console.log(`Selected field: ${selected}`);
    // console.log('Field schema meta:', safeMeta);
    // console.log(`Config ${selected}:`, configValue);
    
    return <ConfigSection 
      schema={fieldSchema} 
      config={configValue} 
      onConfig={handleConfig} 
      onBack={handleBack} 
      fullConfig={config} 
    />;
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text color="gray">Config</Text>
      <Text color="green" bold>Hasyx Configuration</Text>
      <Text color="gray">Select configuration section:</Text>
      <Select
        options={options}
        onChange={setSelected}
      />
    </Box>
  );
}

// Функция для рендеринга конфигурации
// Публичный рендерер без знаний о механиках
export async function renderConfigWith({ fileSchema, config, onChange }: { fileSchema: z.ZodSchema, config: any, onChange: (newConfig: any) => void }) {
  await initializeInk();
  render(
    <Config fileSchema={fileSchema} config={config} onChange={onChange} />
  );
}

// Функция для рендеринга с инициализацией
export async function renderForm(component: React.ReactElement) {
  await initializeInk();
  render(component);
}

// Экспорт для использования в других файлах
export { render }; 