'use client'; 

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import AuthForms from '@/auth/AuthForms'; 

export default function LoginPage() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl">Login</Heading>
        <Text fontSize="lg" textAlign="center">
          Please log in to your account.
        </Text>
        <AuthForms isLogin={true} /> 
      </VStack>
    </Box>
  );
}