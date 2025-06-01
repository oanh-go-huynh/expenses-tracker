'use client';

import React from 'react';
import { Box, Flex, Link as ChakraLink, Button, Spacer, Heading, useToast } from '@chakra-ui/react';
import NextLink from 'next/link'; 
import { useAuth } from '@/auth/AuthProvider';
import { useMutation, gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const toast = useToast();

  const [gqlLogout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      logout();
      toast({
        title: "Logged out successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const handleLogout = async () => {
    await gqlLogout();
  };

  return (
    <Box as="header" bg="blue.500" p={4} color="white">
      <Flex align="center" maxW="container.xl" mx="auto">
        <ChakraLink as={NextLink} href="/">
          <Heading size="md" color="white">Expenses App</Heading>
        </ChakraLink>
        <Spacer />
        <Flex>
          {isAuthenticated ? (
            <>
              <ChakraLink as={NextLink} href="/dashboard" px={3} py={1} _hover={{ textDecoration: 'none', bg: 'blue.600' }} borderRadius="md">
                Dashboard
              </ChakraLink>
              <Button onClick={handleLogout} variant="ghost" colorScheme="whiteAlpha" ml={4}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <ChakraLink as={NextLink} href="/auth/login" px={3} py={1} _hover={{ textDecoration: 'none', bg: 'blue.600' }} borderRadius="md">
                Login
              </ChakraLink>
              <ChakraLink as={NextLink} href="/auth/signup" px={3} py={1} _hover={{ textDecoration: 'none', bg: 'blue.600' }} borderRadius="md">
                Sign Up
              </ChakraLink>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;