// expenses-app/frontend/src/apollo/client.ts
// 'use client'; // If you only use this client for client-side operations

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';

// IMPORTANT: process.env.NEXT_PUBLIC_... variables are available both on server and client in Next.js
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

if (!GRAPHQL_ENDPOINT) {
  console.error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined. Ensure .env.local or Docker ENV is set.");
  // Consider throwing an error here if critical for app to function
}

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  let token: string | null = null;
  // Access localStorage only in the browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          expenses: relayStylePagination(),
        },
      },
    },
  }),
  // For App Router, you typically fetch data in Server Components or use client-side hooks.
  // ssrMode is usually not needed here if data fetching is done in client components or server components.
  // If you use initial cache hydration with server components, this might be relevant.
  // ssrMode: typeof window === 'undefined',
});

export default client;