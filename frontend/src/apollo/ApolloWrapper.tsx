'use client'; 

import { ApolloProvider } from '@apollo/client';
import client from './client'; 
import React from 'react';

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}