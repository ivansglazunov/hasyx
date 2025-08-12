# plv8 Extension Support

## Overview

The hasyx platform now supports plv8 (PostgreSQL JavaScript) extension for creating JavaScript functions and triggers in PostgreSQL. This allows you to write complex business logic using JavaScript directly in the database.

## Migration

The plv8 support is implemented through migration `1753833218127-hasyx-plv8` which:

1. Installs the plv8 extension (if available)
2. Creates a test schema for plv8 functions
3. Creates a sample plv8 function

### Running the Migration

```bash
npm run migrate plv8
```

## Environment Support

### Local Development (Docker Compose)

In local development environments, plv8 extension is fully supported and will be installed automatically.

### Hasura Cloud

In Hasura Cloud environments, plv8 extension may not be available due to platform restrictions. The migration will:

- Attempt to install plv8 extension
- Log warnings if installation fails
- Continue with other operations
- Tests will be skipped if plv8 is not available

## Usage

### Creating plv8 Functions

```typescript
import { Hasura } from 'hasyx/lib/hasura';

const hasura = new Hasura({
  url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  secret: process.env.HASURA_ADMIN_SECRET!,
});

// Configuration note:
// These environment variables are generated from hasyx.config.json by the configurator.
// Do not edit .env manually; run `npx hasyx config` to update values.

// Create a simple plv8 function
await hasura.defineFunction({
  schema: 'public',
  name: 'hello_plv8',
  definition: `() RETURNS TEXT AS $$
    var message = "Hello from plv8!";
    return message;
  $$`,
  language: 'plv8'
});
```

### Creating plv8 Triggers

```typescript
// Create a plv8 trigger function
await hasura.defineFunction({
  schema: 'public',
  name: 'validate_user_age',
  definition: `() RETURNS TRIGGER AS $$
    if (NEW.age < 13) {
      plv8.elog(ERROR, 'Users must be at least 13 years old. Age: ' + NEW.age);
    }
    return NEW;
  $$`,
  language: 'plv8'
});

// Create trigger
await hasura.defineTrigger({
  schema: 'public',
  table: 'users',
  name: 'check_user_age',
  timing: 'BEFORE',
  event: 'INSERT',
  function_name: 'public.validate_user_age'
});
```

### JSON Processing with plv8

```typescript
// Create a function that processes JSON data
await hasura.defineFunction({
  schema: 'public',
  name: 'process_json_data',
  definition: `(data JSONB) RETURNS JSONB AS $$
    var input = JSON.parse(data);
    var result = {
      processed: true,
      original: input,
      processed_at: new Date().toISOString(),
      count: input.items ? input.items.length : 0,
      total: 0
    };
    
    if (input.items && Array.isArray(input.items)) {
      for (var i = 0; i < input.items.length; i++) {
        if (input.items[i].value) {
          result.total += input.items[i].value;
        }
      }
    }
    
    return JSON.stringify(result);
  $$`,
  language: 'plv8'
});
```

### Array Operations with plv8

```typescript
// Create a function that works with arrays
await hasura.defineFunction({
  schema: 'public',
  name: 'array_operations',
  definition: `(numbers INTEGER[]) RETURNS JSONB AS $$
    var input = numbers;
    var result = {
      sum: 0,
      average: 0,
      min: null,
      max: null,
      even_count: 0,
      odd_count: 0
    };
    
    if (input && input.length > 0) {
      result.min = input[0];
      result.max = input[0];
      
      for (var i = 0; i < input.length; i++) {
        var num = input[i];
        result.sum += num;
        
        if (num < result.min) result.min = num;
        if (num > result.max) result.max = num;
        
        if (num % 2 === 0) {
          result.even_count++;
        } else {
          result.odd_count++;
        }
      }
      
      result.average = result.sum / input.length;
    }
    
    return JSON.stringify(result);
  $$`,
  language: 'plv8'
});
```

## Testing

The plv8 functionality is tested in `lib/plv8.test.ts`. The tests:

1. Check if plv8 extension is available
2. Test creating plv8 functions
3. Test creating plv8 triggers with validation
4. Test JSON processing with plv8
5. Test array operations with plv8

### Running Tests

```bash
# Run all plv8 tests
npm test plv8

# Run specific test
npm test plv8 -- -t "should check plv8 extension availability"
```

## Limitations

### Hasura Cloud

- plv8 extension may not be available
- Tests will be skipped if plv8 is not available
- Functions and triggers using plv8 will not work

### Local Development

- Full plv8 support
- All features available
- Tests will run normally

## Best Practices

1. **Environment Detection**: Always check if plv8 is available before using it
2. **Error Handling**: Wrap plv8 operations in try-catch blocks
3. **Fallback Logic**: Provide alternative implementations for cloud environments
4. **Testing**: Test both with and without plv8 availability

## Migration Commands

```bash
# Apply plv8 migration
npm run migrate plv8

# Rollback plv8 migration
npm run unmigrate plv8
```

## Troubleshooting

### plv8 Not Available

If plv8 is not available in your environment:

1. Check if you're in a cloud environment
2. Verify PostgreSQL configuration
3. Check logs for installation errors
4. Consider using alternative approaches (PL/pgSQL functions)

### Function Creation Fails

If plv8 function creation fails:

1. Verify plv8 extension is installed
2. Check function syntax
3. Ensure proper error handling
4. Test in local environment first

### Trigger Issues

If plv8 triggers don't work:

1. Verify trigger function syntax
2. Check trigger timing and events
3. Test trigger logic separately
4. Review PostgreSQL logs for errors 