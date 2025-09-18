"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'hasyx';
import { MultiSelect } from 'hasyx/components/ui/multi-select';
import { User } from 'lucide-react';

interface MultiSelectHasyxProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  queryGenerator: (search: string) => {
    table: string;
    where: any;
    returning: string[];
    limit?: number;
  };
  selectedQueryGenerator?: (ids: string[]) => {
    table: string;
    where: any;
    returning: string[];
    limit?: number;
  };
  extraOptions?: Array<{ label: string; value: string; icon?: any; color?: string }>;
  mergeSelected?: boolean;
}

export function MultiSelectHasyx({
  value,
  onValueChange,
  placeholder = "Select...",
  queryGenerator,
  selectedQueryGenerator,
  extraOptions = [],
  mergeSelected = true,
}: MultiSelectHasyxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate query based on search term
  const queryOptions = useMemo(() => {
    return queryGenerator(debouncedSearchTerm);
  }, [debouncedSearchTerm, queryGenerator]);

  // Fetch users from database
  const { data: users = [], loading } = useQuery({
    ...queryOptions,
  }, {
    skip: false, // Always fetch, let queryGenerator handle the filtering
  });

  // Ensure currently selected values are always present in options, even if not in current search page
  const selectedQueryOptions = useMemo(() => {
    const ids = Array.isArray(value) ? value.filter(Boolean) : [];
    if (ids.length && selectedQueryGenerator) {
      return selectedQueryGenerator(ids);
    }
    // Fallback to a safe, valid query to satisfy the hook (limit 0)
    return { ...queryOptions, where: queryOptions.where || {}, limit: 0 } as const;
  }, [value, selectedQueryGenerator, queryOptions]);

  const { data: selectedUsers = [] } = useQuery(selectedQueryOptions as any, { skip: false });

  // Create options for MultiSelect
  const options = useMemo(() => {
    console.log('[MultiSelectHasyx] options calculation:', {
      searchResults: users?.length || 0,
      selectedItems: selectedUsers?.length || 0,
      value,
      mergeSelected,
      users: users?.map(u => ({ id: u.id, name: u.name })),
      selectedUsers: selectedUsers?.map(u => ({ id: u.id, name: u.name }))
    });

    // Merge selected items (if required) and current page, de-duplicate by id
    const merged: any[] = [];
    const pushIfMissing = (u: any) => {
      if (!u) return;
      if (!merged.find((x) => x.id === u.id)) merged.push(u);
    };
    if (mergeSelected) (selectedUsers || []).forEach(pushIfMissing);
    (users || []).forEach(pushIfMissing);

    console.log('[MultiSelectHasyx] after merge:', merged?.map(u => ({ id: u.id, name: u.name })));

    const dbOptions = merged.map((row: any) => ({
      label: row.name || row.label || String(row.id ?? row.value),
      value: row.id ?? row.value,
      icon: User,
      color: '059669',
    }));

    // Ensure every selected value has a corresponding option
    const optionIds = new Set(dbOptions.map(o => o.value));
    const missing = (Array.isArray(value) ? value : []).filter(v => v && !optionIds.has(v));
    const missingOptions = missing.map(v => ({ label: String(v), value: v, icon: User, color: '6b7280' }));

    const finalOptions = [...(extraOptions || []), ...missingOptions, ...dbOptions];
    
    console.log('[MultiSelectHasyx] final options:', {
      total: finalOptions.length,
      dbOptions: dbOptions.length,
      missingOptions: missingOptions.length,
      extraOptions: extraOptions.length,
      selectedValueInOptions: value.some(v => finalOptions.some(o => o.value === v)),
      finalOptionsPreview: finalOptions.slice(0, 3).map(o => ({ label: o.label, value: o.value }))
    });

    return finalOptions;
  }, [users, selectedUsers, extraOptions, mergeSelected, value]);

  // Обработчик поиска из MultiSelect
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  console.log('[MultiSelectHasyx] MultiSelect props:', {
    optionsLength: options.length,
    value,
    selectedInOptions: value.filter(v => options.some(o => o.value === v)),
    firstFewOptions: options.slice(0, 3).map(o => ({ label: o.label, value: o.value }))
  });

  return (
    <MultiSelect
      key={`multi-select-${value.join(',')}`} // Force re-render when value changes
      options={options}
      onValueChange={onValueChange}
      defaultValue={value}
      placeholder={placeholder}
      animation={0.3}
      maxCount={5}
      className="w-full"
      onSearch={handleSearch}
    />
  );
} 