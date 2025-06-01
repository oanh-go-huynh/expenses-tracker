'use client';

import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import AuthForms from '@/auth/AuthForms';

export default function SignupPage() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl">Sign Up</Heading>
        <Text fontSize="lg" textAlign="center">
          Create a new account to get started.
        </Text>
        <AuthForms isLogin={false} /> 
      </VStack>
    </Box>
  );
}