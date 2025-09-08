import { v4 as uuidv4 } from 'uuid';
import { createApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx';
import { Generator } from './generator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from '../public/hasura-schema.json';
import { createTestUser } from './create-test-user';
import { processConfiguredValidationDefine } from './validation';
import { gql } from '@apollo/client/core';


describe('options view + validation', () => {
  it('introspects options mutation functions', async () => {
    const admin = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const q = gql`query { __schema { mutationType { name fields { name } } } }`;
    const res: any = await admin.apolloClient.query({ query: q, fetchPolicy: 'network-only' });
    const fields: string[] = res?.data?.__schema?.mutationType?.fields?.map((f: any) => f.name) || [];
    // eslint-disable-next-line no-console
    console.log('MUTATION FIELDS (options*):', fields.filter((n) => /options|options_insert|options_update|options_delete/i.test(n)));
    expect(fields.some((n) => n === 'options_insert')).toBe(true);
    expect(fields.some((n) => n === 'options_update')).toBe(true);
    expect(fields.some((n) => n === 'options_delete')).toBe(true);
  }, 60000);
  it('should allow known keys and reject unknown keys', async () => {
    const admin = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    await processConfiguredValidationDefine();

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Test valid key using options_insert function with correct args format
    const createOptionMutation = gql`
      mutation CreateOption($args: options_insert_args!) {
        options_insert(args: $args) {
          id
          key
          value
          user_id
          created_at
          updated_at
        }
      }
    `;

    // First, let's introspect the create_option function to see its parameters
    const introspectFunction = gql`
      query IntrospectCreateOption {
        __schema {
          mutationType {
            fields(includeDeprecated: true) {
              name
              args {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    // Check if create_option function exists in schema for admin
    const adminIntrospectResult = await admin.apolloClient.query({
      query: introspectFunction,
      fetchPolicy: 'network-only'
    });
    
    const adminCreateOptionField = adminIntrospectResult.data?.__schema?.mutationType?.fields?.find((f: any) => f.name === 'options_insert');
    console.log('options_insert function schema (admin):', JSON.stringify(adminCreateOptionField, null, 2));

    // Check if options_insert function exists in schema for user
    const userIntrospectResult = await userClient.apolloClient.query({
      query: introspectFunction,
      fetchPolicy: 'network-only'
    });
    
    const userCreateOptionField = userIntrospectResult.data?.__schema?.mutationType?.fields?.find((f: any) => f.name === 'options_insert');
    console.log('options_insert function schema (user):', JSON.stringify(userCreateOptionField, null, 2));

    // Try with admin client first to see if function exists
    let adminResult;
    try {
      adminResult = await admin.apolloClient.mutate({
        mutation: createOptionMutation,
        variables: {
          args: {
            _key: 'theme',
            _value: "dark"
          }
        }
      });
      console.log('Admin GraphQL result:', JSON.stringify(adminResult, null, 2));
    } catch (adminError) {
      console.log('Admin create_option error:', JSON.stringify(adminError, null, 2));
    }

    // Now try with user client
    let okResult;
    try {
      okResult = await userClient.apolloClient.mutate({
        mutation: createOptionMutation,
        variables: {
          args: {
            _key: 'theme',
            _value: "dark" // JSON string value (GraphQL will handle JSON conversion)
          }
        }
      });
      console.log('User GraphQL result:', JSON.stringify(okResult, null, 2));
    } catch (error) {
      console.log('User create_option error:', JSON.stringify(error, null, 2));
      throw error;
    }
    
    console.log('options_insert result:', okResult.data?.options_insert);
    expect(okResult.data?.options_insert).toBeDefined();
    
    // Verify by querying the options view
    const queryOptions = gql`
      query GetOptions {
        options(where: { key: { _eq: "theme" } }) {
          key
          string
          user_id
        }
      }
    `;
    
    const queryResult = await userClient.apolloClient.query({
      query: queryOptions,
      fetchPolicy: 'network-only'
    });
    
    const okRow = queryResult.data?.options?.[0];
    expect(okRow?.key).toBe('theme');
    expect(okRow?.string).toBe('dark');

    // Test invalid key should fail
    let failed = false;
    try {
      await userClient.apolloClient.mutate({
        mutation: createOptionMutation,
        variables: {
          _key: 'unknown_key',
          _value: '"oops"'
        }
      });
    } catch (error) {
      failed = true;
      // eslint-disable-next-line no-console
      console.log('Expected validation error:', error);
    }
    expect(failed).toBe(true);
  }, 120000);

  it('should support number type key (itemsPerPage)', async () => {
    const admin = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    await processConfiguredValidationDefine();

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Test number value using create_option function
    const createOptionMutation = gql`
      mutation CreateOption($_key: String!, $_value: jsonb!) {
        create_option(_key: $_key, _value: $_value) {
          id
          key
          value
          user_id
          created_at
          updated_at
        }
      }
    `;

    const result = await userClient.apolloClient.mutate({
      mutation: createOptionMutation,
      variables: {
        _key: 'itemsPerPage',
        _value: 25 // JSON number value
      }
    });
    
    console.log('create_option number result:', result.data?.create_option);
    // For number values, the function returns from strings table (placeholder)
    // but the actual value is inserted into numbers table
    expect(result.data?.create_option).toBeDefined();
    
    // Verify by querying the options view
    const queryOptions = gql`
      query GetOptions {
        options(where: { key: { _eq: "itemsPerPage" } }) {
          key
          number
          user_id
        }
      }
    `;
    
    const queryResult = await userClient.apolloClient.query({
      query: queryOptions,
      fetchPolicy: 'network-only'
    });
    
    const row = queryResult.data?.options?.[0];
    expect(row?.key).toBe('itemsPerPage');
    expect(Number(row?.number)).toBe(25);
  }, 120000);
});


