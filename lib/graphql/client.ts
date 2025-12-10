/**
 * GraphQL Client Configuration
 */

import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';

const endpoint = '/api/graphql';

/**
 * Create a GraphQL client for use in components
 * - Works in both server and client components
 * - Automatically uses cookies for authentication
 */
function createGraphQLClient() {
  // For server-side, we need the full URL
  const url =
    typeof window === 'undefined'
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`
      : endpoint;

  return new GraphQLClient(url, {
    credentials: 'include',
  });
}

const client = createGraphQLClient();

/**
 * Execute a GraphQL request with proper typing
 */
export async function graphqlRequest<T, V extends Variables = Variables>(
  document: RequestDocument,
  variables?: V
): Promise<T> {
  return client.request<T>(document, variables);
}

/**
 * Export the raw client if needed
 */
export { createGraphQLClient, client as graphqlClient };

