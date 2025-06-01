'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  useToast,
  Select, 
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { CREATE_EXPENSE_MUTATION, UPDATE_EXPENSE_MUTATION, GET_EXPENSES_QUERY } from '@/graphql/expenses.graphql';
import { CreateExpenseInput, UpdateExpenseInput, Expense, Category, Currency } from '@/types/graphql.types'; 
import { format } from 'date-fns';

interface ExpenseFormProps {
  initialExpense?: Expense | null;
  onSuccess?: () => void;  
}

const formatEnum = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialExpense, onSuccess }) => {
  const toast = useToast();
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>(''); 
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [currency, setCurrency] = useState<Currency | ''>('');

  const [createExpense, { loading: createLoading }] = useMutation(CREATE_EXPENSE_MUTATION, {
    refetchQueries: [{ query: GET_EXPENSES_QUERY, variables: { limit: 10, offset: 0 } }],
    awaitRefetchQueries: true,
  });

  const [updateExpense, { loading: updateLoading }] = useMutation(UPDATE_EXPENSE_MUTATION, {
    refetchQueries: [{ query: GET_EXPENSES_QUERY, variables: { limit: 10, offset: 0 } }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (initialExpense) {
      setName(initialExpense.name);
      setAmount(initialExpense.amount);
      setDescription(initialExpense.description);
      setDate(format(new Date(initialExpense.date), 'yyyy-MM-dd'));
      setCategory(initialExpense.category || '');
      setCurrency(initialExpense.currency || '');
    } else {
      setName('');
      setAmount('');
      setDescription('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setCategory('');
      setCurrency(Currency.Usd);
    }
  }, [initialExpense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount === '' || !name.trim() || !description.trim() || !date.trim()) {
      toast({ title: 'Missing required fields', description: 'Please fill out Name, Amount, Description, and Date.', status: 'error' });
      return;
    }

    const inputData = {
      name,
      amount: parseFloat(amount as unknown as string),
      description,
      date,
      category: category || null,
      currency: currency || null,
    };

    try {
      if (initialExpense) {
        await updateExpense({
          variables: {
            updateExpenseInput: {
              id: initialExpense.id,
              ...inputData
            } as UpdateExpenseInput,
          },
        });
        toast({ title: 'Expense updated successfully!', status: 'success' });
      } else {
        await createExpense({
          variables: {
            createExpenseInput: inputData as CreateExpenseInput,
          },
        });
        toast({ title: 'Expense created successfully!', status: 'success' });
      }
      onSuccess?.();
    } catch (error: any) {
      console.error('Expense form submission error:', error);
      toast({ title: 'Error submitting expense', description: error.message, status: 'error' });
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="lg" shadow="md" bg="white">
      <VStack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Groceries, Rent" />
        </FormControl>

        <FormControl id="amount" isRequired>
          <FormLabel>Amount</FormLabel>
          <NumberInput min={0.01} precision={2} value={amount} onChange={(_, valueAsNumber) => setAmount(isNaN(valueAsNumber) ? '' : valueAsNumber)}>
            <NumberInputField placeholder="e.g., 50.00" />
          </NumberInput>
        </FormControl>
        
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of the expense" />
        </FormControl>

        <FormControl id="date" isRequired>
          <FormLabel>Date</FormLabel>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormControl>

        <FormControl id="category">
          <FormLabel>Category</FormLabel>
          <Select 
            placeholder="Select a category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>
                {formatEnum(cat)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="currency">
          <FormLabel>Currency</FormLabel>
          <Select 
            placeholder="Select a currency" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {Object.values(Currency).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="brand" width="full" isLoading={isLoading} loadingText={initialExpense ? 'Updating...' : 'Creating...'}>
          {initialExpense ? 'Update Expense' : 'Create Expense'}
        </Button>
      </VStack>
    </Box>
  );
};

export default ExpenseForm;