'use client';

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Box, Button, Input, FormControl, FormLabel, VStack, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/auth/AuthProvider';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(signUpInput: { email: $email, password: $password, name: $name }) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(signInInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

interface AuthFormsProps {
  isLogin?: boolean; 
}

const AuthForms: React.FC<AuthFormsProps> = ({ isLogin = true }) => {
  const [tabIndex, setTabIndex] = useState(isLogin ? 0 : 1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const toast = useToast();
  const router = useRouter();
  const { login } = useAuth(); 

  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: ({ signup }) => {
      login(signup.accessToken, signup.user); 
      toast({
        title: 'Account created and logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard'); 
    },
    onError: (error) => {
      toast({
        title: 'Signup failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const [signin] = useMutation(SIGNIN_MUTATION, {
    onCompleted: ({ signin }) => {
      login(signin.accessToken, signin.user); 
      toast({
        title: 'Logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard'); 
    },
    onError: (error) => {
      toast({
        title: 'Login failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signin({ variables: { email, password } });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSend = name === '' ? null : name;

    await signup({ variables: { email, password, name: nameToSend } });
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" shadow="md" w="full" maxW="md">
      <Tabs index={tabIndex} onChange={setTabIndex} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack as="form" onSubmit={handleLoginSubmit} spacing={4}>
              <FormControl id="loginEmail" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="loginPassword" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack as="form" onSubmit={handleSignupSubmit} spacing={4}>
              <FormControl id="signupEmail" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="signupName">
                <FormLabel>Name (Optional)</FormLabel>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl id="signupPassword" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="green" width="full">
                Sign Up
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AuthForms;