'use client'; 

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client'; 
import { useRouter } from 'next/navigation'; 
import { User } from '../types/graphql.types'; 

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; 
  login: (token: string, user: User) => void;
  logout: () => Promise<void>; 
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout # Assuming your backend mutation is named 'logout' and returns a boolean or similar
  }
`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const apolloClient = useApolloClient();
  const router = useRouter(); 

  const { data: meData, loading: meLoading, error: meError, refetch } = useQuery(ME_QUERY, {
    skip: typeof window === 'undefined' || !localStorage.getItem('accessToken'),
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error("Error fetching user data (ME_QUERY):", err.message);
      if (err.graphQLErrors && err.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
        clientSideLogoutOnly(); 
      }
    }
  });

  const [callBackendLogout, { loading: logoutMutationLoading }] = useMutation(LOGOUT_MUTATION, {
    onError: (err) => {
      console.error("Backend logout mutation failed:", err.message);
    }
  });

  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me as User);
      setIsAuthenticated(true);
    } else if (!meLoading && !meData?.me && typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      clientSideLogoutOnly(); 
    }
  }, [meData, meLoading]);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
    setIsAuthenticated(true);
    apolloClient.cache.reset().catch(err => console.error("Error resetting Apollo cache on login:", err));
  }, [apolloClient]);

  const clientSideLogoutOnly = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
    apolloClient.cache.reset().catch(err => console.error("Error resetting Apollo cache on logout:", err));
    router.push('/auth/login');
  }, [apolloClient, router, setUser, setIsAuthenticated]);


  const logout = useCallback(async () => {
    try {
      await callBackendLogout();
    } catch (error) {
    }
    clientSideLogoutOnly();
  }, [callBackendLogout, clientSideLogoutOnly]);

  const refetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  const contextValue = {
    user,
    isAuthenticated,
    loading: meLoading || logoutMutationLoading, 
    login,
    logout,
    refetchUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};