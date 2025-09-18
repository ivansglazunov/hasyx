# Items System & Option Inheritance

This document explains the Items system and how it works with the Options system to provide hierarchical option inheritance through the `item_options` view.

## Overview

The Items system provides a hierarchical structure where items can have parent-child relationships, and child items automatically inherit options from their parents through a powerful inheritance mechanism. This creates a flexible way to manage configuration and properties that cascade down through item hierarchies.

### Core Concepts

1. **Items Table**: Stores hierarchical items with parent-child relationships
2. **Options Table**: Stores key-value options attached to specific items
3. **Item-Options View**: Provides inherited options for each item (direct + inherited from parents)
4. **Inheritance Chain**: Options flow from parent items to children automatically

## Items Table Structure

```sql
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  parent_id UUID REFERENCES public.items(id),
  parents_ids UUID[] DEFAULT '{}', -- Materialized path for efficient querying
  -- other item fields...
);
```

### Key Fields

- **`id`**: Unique identifier for the item
- **`parent_id`**: Direct parent reference (nullable for root items)
- **`parents_ids`**: Array containing all ancestor IDs for efficient hierarchy traversal
- **`created_at`/`updated_at`**: Standard timestamps

## Options Integration

Items work seamlessly with the [Options System](OPTIONS.md) to provide hierarchical option inheritance. Options are defined in `schema.tsx` and validated at the database level.

### Schema Definition

```typescript
// schema.tsx
export const options = {
  items: z.object({
    user_id: z.string().uuid().meta({ tables: ['users'] }),
    mark_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    route_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    zone_id: z.string().uuid().meta({ tables: ['geo.features'] }),
  }),
}
```

## Item-Options View: The Inheritance Engine

The `item_options` view is the core of the inheritance system. It provides a unified view of all options available to each item, combining:

1. **Direct options**: Options directly attached to the item
2. **Inherited options**: Options from parent items in the hierarchy
3. **Inheritance metadata**: Information about where each option comes from

### View Structure

The `item_options` view is implemented using recursive SQL that combines direct and inherited options. As a programmer using Hasyx API, you don't need to understand the SQL implementation - just use it through GraphQL:

```typescript
// Query item_options through Hasyx API
const itemOptions = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'your-item-id' } },
  returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
});
```

### Key Features

- **`item_id`**: The item for which options are being viewed
- **`_item_id`**: The actual item where the option is stored
- **`inheritance_level`**: Distance from the item (0 = direct, 1+ = inherited)
- **Option override**: Child options take precedence over parent options (lower inheritance_level wins)

## How Inheritance Works

### 1. Direct Options

When an option is directly attached to an item:

```typescript
// Create option directly on item
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: 'item-123',
    to_id: 'user-456'
  }],
  returning: ['id', 'key', 'to_id']
});

// Query item_options view
const options = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'item-123' } },
  returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
});
// Result: { item_id: 'item-123', _item_id: 'item-123', inheritance_level: 0, ... }
```

### 2. Inherited Options

When a child item inherits options from its parent:

```typescript
// Parent item has option
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: 'parent-item',
    to_id: 'user-456'
  }],
  returning: ['id', 'key', 'to_id']
});

// Child item (with parent_id = 'parent-item')
const childOptions = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'child-item' } },
  returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
});
// Result: { item_id: 'child-item', _item_id: 'parent-item', inheritance_level: 1, ... }
```

### 3. Option Override

When both parent and child have the same option key, child wins:

```typescript
// Parent option
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: 'parent-item',
    to_id: 'user-parent'
  }],
  returning: ['id']
});

// Child option (same key)
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: 'child-item',
    to_id: 'user-child'
  }],
  returning: ['id']
});

// Query child options
const options = await hasyx.select({
  table: 'item_options',
  where: { 
    item_id: { _eq: 'child-item' },
    key: { _eq: 'user_id' }
  },
  order_by: [{ inheritance_level: 'asc' }],
  returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
});
// Results:
// 1. { item_id: 'child-item', _item_id: 'child-item', inheritance_level: 0, to_id: 'user-child' }
// 2. { item_id: 'child-item', _item_id: 'parent-item', inheritance_level: 1, to_id: 'user-parent' }
```

## Relationships & GraphQL

The system provides rich GraphQL relationships:

### Item-Options Relationships

```typescript
// Query item_options with relationships through Hasyx API
const itemOptionsWithRelations = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'your-item-id' } },
  returning: [
    'item_id',
    '_item_id', 
    'key',
    'to_id',
    'inheritance_level',
    { item: ['id'] },     // The item viewing options
    { _item: ['id'] },    // The item storing the option
    { user: ['id', 'name'] }, // Option owner
    { to: ['id_uuid'] }   // Generic UUID reference
  ]
});
```

### Items to Item-Options

```typescript
// Query items with their effective options through Hasyx API
const itemsWithOptions = await hasyx.select({
  table: 'items',
  where: { id: { _eq: 'your-item-id' } },
  returning: [
    'id',
    { 
      item_options: [     // All effective options (direct + inherited)
        'key',
        'to_id',
        'inheritance_level',
        { _item: ['id'] } // Where option actually comes from
      ]
    }
  ]
});
```

## Usage Patterns

### 1. Configuration Inheritance

Perfect for cascading configuration settings:

```typescript
// Root configuration
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'zone_id',
    item_id: 'root-item',
    to_id: 'default-zone'
  }],
  returning: ['id']
});

// All child items automatically inherit zone_id
// unless they override it with their own value
```

### 2. Permission Inheritance

User access rights can flow down hierarchies:

```typescript
// Grant user access to parent item
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: 'parent-item',
    to_id: 'user-123'
  }],
  returning: ['id']
});

// All child items inherit user access
// Check access by querying item_options
const hasAccess = await hasyx.select({
  table: 'item_options',
  where: {
    item_id: { _eq: 'child-item' },
    key: { _eq: 'user_id' },
    to_id: { _eq: 'user-123' }
  },
  returning: ['id', 'key', 'to_id']
});
```

### 3. Geographic Hierarchy

Location-based features with inheritance:

```typescript
// Country-level marker
await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'mark_id',
    item_id: 'country-item',
    to_id: 'country-marker-id'
  }],
  returning: ['id']
});

// City items inherit country marker
// unless they specify their own
```

## Differences from Direct Options Usage

### Direct Options Approach

```typescript
// Traditional approach - manual option management
const userOptions = await hasyx.select({
  table: 'options',
  where: { item_id: { _eq: 'item-123' } },
  returning: ['key', 'to_id']
});

// Need to manually check parent options
const parentOptions = await hasyx.select({
  table: 'options',
  where: { item_id: { _eq: parent_id } },
  returning: ['key', 'to_id']
});

// Manual merge logic required
const effectiveOptions = mergeOptions(userOptions, parentOptions);
```

### Item-Options Inheritance Approach

```typescript
// Inheritance approach - automatic option resolution
const effectiveOptions = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'item-123' } },
  returning: ['key', 'to_id', '_item_id', 'inheritance_level']
});

// All inheritance handled automatically by the view
// Options are pre-resolved with override logic
// Inheritance metadata included
```

### Key Advantages

1. **Automatic Resolution**: No manual inheritance logic needed
2. **Performance**: Single query gets all effective options
3. **Override Handling**: Built-in precedence rules
4. **Audit Trail**: Know where each option comes from (`_item_id`, `inheritance_level`)
5. **Consistency**: Same inheritance logic across entire application
6. **GraphQL Integration**: Rich relationships and joins available

### When to Use Each Approach

**Use Direct Options** (`options` table) when:
- Options are specific to individual items
- No inheritance needed
- Simple key-value storage

**Use Item-Options Inheritance** (`item_options` view) when:
- Configuration should cascade through hierarchies
- Items have parent-child relationships
- Override behavior is needed
- Audit trail of option sources is important
- Complex item structures with shared properties

## Migration & Setup

The item-options system is set up through migrations:

```bash
# Create the view and relationships
DEBUG="hasyx*" npm run migrate hasyx-item-options

# Validate the setup
DEBUG="hasyx*" npm run validate
DEBUG="hasyx*" npm run schema

# Test the functionality
DEBUG="hasyx*" npm test item-options
```

## Best Practices

1. **Schema First**: Always define options in `schema.tsx` before using them
2. **Inheritance Levels**: Keep hierarchies reasonable (avoid very deep nesting)
3. **Override Sparingly**: Use child overrides only when necessary
4. **Query Efficiently**: Use `item_options` view for inheritance, `options` table for direct access
5. **Test Inheritance**: Verify option resolution in complex hierarchies
6. **Document Hierarchies**: Clearly document your item structure and inheritance patterns

## Troubleshooting

### Common Issues

1. **"Unknown option key" errors**: Ensure option keys are defined in `schema.tsx`
2. **Missing inheritance**: Check `parents_ids` array is correctly populated
3. **Wrong override behavior**: Verify `inheritance_level` ordering in queries
4. **Performance issues**: Index `parents_ids` array if dealing with large hierarchies

### Debugging Queries

```typescript
// Check item hierarchy through Hasyx API
const itemHierarchy = await hasyx.select({
  table: 'items',
  where: { id: { _eq: 'your-item-id' } },
  returning: ['id', 'parent_id', 'parents_ids']
});

// Check effective options
const effectiveOptions = await hasyx.select({
  table: 'item_options',
  where: { item_id: { _eq: 'your-item-id' } },
  returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level'],
  order_by: [{ key: 'asc' }, { inheritance_level: 'asc' }]
});

// Debug inheritance chain by checking parent options
const parentOptions = await hasyx.select({
  table: 'options',
  where: { item_id: { _in: parentIds } }, // from parents_ids array
  returning: ['item_id', 'key', 'to_id']
});
```

The Items system with option inheritance provides a powerful foundation for building hierarchical applications with cascading configuration and properties.
