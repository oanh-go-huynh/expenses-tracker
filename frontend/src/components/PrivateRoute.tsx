'use client';

import { useAuth } from '@/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {

    if (isMounted && !loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router, isMounted]);
  if (!isMounted || loading) {
    return (
      <Center minH="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateRoute;