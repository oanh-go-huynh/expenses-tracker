'use client'; 

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  useDisclosure,
  Container,
  Flex,
  Spacer,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  HStack, 
} from '@chakra-ui/react';
import { AddIcon, InfoIcon, WarningIcon, LockIcon } from '@chakra-ui/icons'; 
import PrivateRoute from '@/components/PrivateRoute';
import { useAuth } from '@/auth/AuthProvider';
import ExpenseTable from '@/components/ExpenseTable'; 
import ExpenseForm from '@/components/ExpenseForm';
import { Expense } from '@/types/graphql.types'; 

const StatCard = ({ title, stat, icon, helpText, arrowType }: { title: string, stat: string, icon: React.ReactElement, helpText?: string, arrowType?: 'increase' | 'decrease' }) => (
    <Stat
        px={{ base: 4, md: 8 }}
        py={'5'}
        shadow={'md'}
        border={'1px solid'}
        borderColor={'gray.200'}
        rounded={'lg'}
    >
        <Flex justifyContent={'space-between'}>
            <Box pl={{ base: 2, md: 4 }}>
                <StatLabel fontWeight={'medium'} isTruncated>
                    {title}
                </StatLabel>
                <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                    {stat}
                </StatNumber>
                {helpText && (
                    <StatHelpText>
                        {arrowType && <StatArrow type={arrowType} />}
                        {helpText}
                    </StatHelpText>
                )}
            </Box>
            <Box my={'auto'} color={'brand.500'} alignContent={'center'}>
                {icon}
            </Box>
        </Flex>
    </Stat>
);

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth(); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    onOpen();
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    onClose();
  };

  const handleLogout = async () => {
    await logout(); 
  };

  // TODO: Fetch this data from API to make the stat cards dynamic.
  const illustrativeTotalExpenses = 128; 
  const illustrativeMonthlyTotal = 4567.89;

  return (
    <PrivateRoute>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box>
              <Heading as="h1" size="xl">Dashboard</Heading>
              {user && <Text fontSize="lg" color="gray.500">Welcome back, {user.name || user.email}!</Text>}
            </Box>
            <Spacer />
            <HStack spacing={4} mt={{ base: 4, md: 0 }}>
                <Button 
                  colorScheme="brand" 
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setEditingExpense(null);
                    onOpen();
                  }}
                >
                  Add New Expense
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<LockIcon />}
                  onClick={handleLogout}
                  isLoading={authLoading} 
                >
                  Logout
                </Button>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard 
              title={'Total Expenses'} 
              stat={illustrativeTotalExpenses.toString()} 
              icon={<Icon as={InfoIcon} w={8} h={8} />}
            />
            <StatCard 
              title={'Spent This Month'} 
              stat={`$${illustrativeMonthlyTotal.toLocaleString()}`} 
              icon={<Icon as={InfoIcon} w={8} h={8} />}
              helpText="2.5% vs. last month"
              arrowType="increase"
            />
            <StatCard 
              title={'Upcoming Bills'} 
              stat={'3'} 
              icon={<Icon as={WarningIcon} w={8} h={8} />}
            />
             <StatCard 
              title={'Savings Goal'} 
              stat={'75%'} 
              icon={<Icon as={InfoIcon} w={8} h={8} />}
            />
          </SimpleGrid>

          <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <Heading as="h2" size="lg" mb={4}>Your Expenses</Heading>
            <ExpenseTable onEdit={handleEditExpense} />
          </Box>
        </VStack>
      </Container>
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingExpense ? 'Edit Expense' : 'Create New Expense'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ExpenseForm
            initialExpense={editingExpense || undefined} 
            onSuccess={handleFormSuccess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

    </PrivateRoute>
  );
}