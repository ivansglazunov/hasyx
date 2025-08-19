"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'hasyx';
import { MultiSelect } from 'hasyx/components/ui/multi-select';
import { User, Users } from 'lucide-react';

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
}

export function MultiSelectHasyx({
  value,
  onValueChange,
  placeholder = "Select users...",
  queryGenerator
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

  // Create options for MultiSelect
  const options = useMemo(() => {
    const customOptions = [
      {
        label: 'All users',
        value: 'user',
        icon: Users,
        color: '0366d6', // GitHub blue
      },
      {
        label: 'Anonymous users',
        value: 'anonymous',
        icon: User,
        color: '6b7280', // Gray
      },
    ];

    // Add users from database
    const dbOptions = users.map((user: any) => ({
      label: user.name || `User ${user.id}`,
      value: user.id,
      icon: User,
      color: '059669', // Green
    }));

    return [...customOptions, ...dbOptions];
  }, [users]);

  // Обработчик поиска из MultiSelect
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  return (
    <MultiSelect
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