/**
 * GraphQL type constants used across the codebase
 * These should match the standard GraphQL scalar types and common Hasura extensions
 */

export const GRAPHQL_SCALAR_TYPES = new Set([
  'Int', 
  'Float', 
  'String', 
  'Boolean', 
  'ID',
  // Hasura-specific scalar types
  'uuid', 
  'jsonb', 
  'timestamptz', 
  'bigint', 
  'numeric'
]);

export const GRAPHQL_ENUM_LIKE_SUFFIXES = new Set([
  'order_by',
  'select_column',
  'constraint',
  'update_column'
]);

export const GRAPHQL_AGGREGATE_SUFFIXES = new Set([
  '_aggregate',
  '_aggregate_fields',
  '_avg_fields',
  '_max_fields',
  '_min_fields',
  '_stddev_fields',
  '_stddev_pop_fields',
  '_stddev_samp_fields',
  '_sum_fields',
  '_var_pop_fields',
  '_var_samp_fields',
  '_variance_fields',
  '_mutation_response'
]);

export const GRAPHQL_ROOT_TYPES = new Set([
  'query_root',
  'mutation_root', 
  'subscription_root'
]);
