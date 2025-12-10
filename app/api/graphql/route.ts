/**
 * GraphQL API Route - GraphQL Yoga Server
 */

import { createYoga } from 'graphql-yoga';
import { createContext } from './context';
import { schema } from './schema';

const { handleRequest } = createYoga({
  schema,
  context: async () => createContext(),
  graphqlEndpoint: '/api/graphql',
  // CORS configuration
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || '*',
    credentials: true,
  },
  fetchAPI: {
    Response,
  },
});

export { handleRequest as GET, handleRequest as POST };

