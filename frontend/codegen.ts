import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Point to your GraphQL schema (running backend)
  schema: 'http://localhost:3000/graphql',
  // Define where your GraphQL documents (queries, mutations, fragments) are located
  documents: [
    './src/**/*.graphql.ts', // Look for .graphql.ts files in src
    './src/**/*.tsx',        // Also look in your TSX components for inline gql tags
  ],
  // Define the output for the generated types
  generates: {
    './src/types/graphql.types.ts': { // Output file for generated types
      plugins: [
        'typescript',           // Generates basic TypeScript types for schema
        'typescript-operations', // Generates TypeScript types for your operations (queries, mutations)
        'typescript-react-apollo' // Generates React Hooks for Apollo Client
      ],
      config: {
        // Options for typescript-react-apollo plugin
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: false, // Include __typename field in types
        // This maps the generated types to your actual backend types if needed,
        // often used for Date types, etc.
        // scalars: {
        //   DateTime: 'Date', // If your backend uses DateTime, map it to JS Date
        //   UUID: 'string', // Map UUID to string
        // },
      },
    },
  },
  // Optional: Add `overwrite: true` if you want to regenerate without prompt
  overwrite: true,
};

export default config;