'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
  Spacer,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Select,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Box,
  Center,
  Spinner,
  Text,
  Collapse,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EXPENSES_QUERY, DELETE_EXPENSE_MUTATION } from '@/graphql/expenses.graphql';
import { Expense, ExpenseFilterInput, ExpenseSortField, SortDirection, Category, Currency } from '@/types/graphql.types';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

interface ExpenseTableProps {
  onEdit: (expense: Expense) => void;
}

const formatEnum = (value: string) => {
    if (!value) return '';
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const ExpenseTable: React.FC<ExpenseTableProps> = ({ onEdit }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<ExpenseFilterInput>({});
  
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [currencyFilter, setCurrencyFilter] = useState<Currency | ''>('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [minAmountFilter, setMinAmountFilter] = useState<number | ''>('');
  const [maxAmountFilter, setMaxAmountFilter] = useState<number | ''>('');

  const [sort, setSort] = useState<{ field: ExpenseSortField; direction: SortDirection }>({
    field: ExpenseSortField.Date,
    direction: SortDirection.Desc,
  });

  const variables = useMemo(() => {
    const queryVars: {
      limit: number;
      offset: number;
      filter?: ExpenseFilterInput;
      sort?: { field: ExpenseSortField; direction: SortDirection };
    } = {
      limit: ITEMS_PER_PAGE,
      offset,
    };

    const activeFilterEntries = Object.entries(filter).filter(([_, value]) => value != null && value !== '');
    if (activeFilterEntries.length > 0) {
      queryVars.filter = Object.fromEntries(activeFilterEntries);
    }
    
    queryVars.sort = sort;

    return queryVars;
  }, [offset, filter, sort]);

  const { data, loading, error, refetch } = useQuery(GET_EXPENSES_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
  });
  
  const [deleteExpense, { loading: deleteLoading }] = useMutation(DELETE_EXPENSE_MUTATION, {
    onCompleted: () => {
      toast({ title: 'Expense deleted.', status: 'success', duration: 3000, isClosable: true });
      refetch();
      setExpenseToDelete(null);
      onClose();
    },
    onError: (err) => {
      console.error('Delete expense error:', err);
      toast({ title: 'Error deleting expense', description: err.message, status: 'error', duration: 5000, isClosable: true });
    },
  });

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense({ variables: { id: expenseToDelete } });
    }
  };

  const handleNextPage = () => {
    if (data && (offset + ITEMS_PER_PAGE) < data.expenses.totalCount) {
      setOffset(offset + ITEMS_PER_PAGE);
    }
  };

  const handlePrevPage = () => {
    setOffset(Math.max(0, offset - ITEMS_PER_PAGE));
  };

  const applyFilters = () => {
    setFilter({
      name: nameFilter || undefined,
      category: categoryFilter || undefined,
      currency: currencyFilter || undefined,
      minAmount: minAmountFilter !== '' ? minAmountFilter : undefined,
      maxAmount: maxAmountFilter !== '' ? maxAmountFilter : undefined,
      startDate: startDateFilter || undefined,
      endDate: endDateFilter || undefined,
    });
    setOffset(0);
  };

  const handleSortChange = (field: ExpenseSortField) => {
    setSort(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === SortDirection.Desc
        ? SortDirection.Asc
        : SortDirection.Desc,
    }));
    setOffset(0);
  };

  if (loading && !data) {
    return (
        <Center minH="200px">
            <Spinner size="xl" />
        </Center>
    );
  }
  if (error) return <Text color="red.500">Error fetching expenses: {error.message}</Text>;

  const expenses = data?.expenses.items || [];
  const totalCount = data?.expenses.totalCount || 0;

  return (
    <Box>
      <Flex mb={4}>
          <Button onClick={onFilterToggle} rightIcon={<ChevronDownIcon />} variant="outline">
              Filters
          </Button>
      </Flex>
      <Collapse in={isFilterOpen} animateOpacity>
        <VStack spacing={4} mb={6} p={4} borderWidth={1} borderRadius="lg" bg="gray.50" shadow="sm">
          <Flex gap={4} wrap="wrap" w="full">
            <FormControl flex="1 1 200px">
              <FormLabel htmlFor="filterName">Name</FormLabel>
              <Input
                id="filterName"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                bg="white"
              />
            </FormControl>
            <FormControl flex="1 1 200px">
              <FormLabel htmlFor="filterCategory">Category</FormLabel>
              <Select 
                id="filterCategory"
                placeholder="All Categories" 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value as Category)}
                bg="white"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {formatEnum(cat)}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl flex="1 1 200px">
              <FormLabel htmlFor="filterCurrency">Currency</FormLabel>
              <Select 
                id="filterCurrency"
                placeholder="All Currencies" 
                value={currencyFilter} 
                onChange={(e) => setCurrencyFilter(e.target.value as Currency)}
                bg="white"
              >
                {Object.values(Currency).map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <Flex gap={4} wrap="wrap" w="full" alignItems="flex-start">
            <FormControl flex="1 1 150px">
              <FormLabel htmlFor="minAmount">Min Amount</FormLabel>
              <NumberInput value={minAmountFilter} onChange={(_, valueAsNumber) => setMinAmountFilter(isNaN(valueAsNumber) ? '' : valueAsNumber)}>
                <NumberInputField
                  id="minAmount"
                  placeholder="Min amount"
                  bg="white"
                />
              </NumberInput>
            </FormControl>
            <FormControl flex="1 1 150px">
              <FormLabel htmlFor="maxAmount">Max Amount</FormLabel>
              <NumberInput value={maxAmountFilter} onChange={(_, valueAsNumber) => setMaxAmountFilter(isNaN(valueAsNumber) ? '' : valueAsNumber)}>
                <NumberInputField
                  id="maxAmount"
                  placeholder="Max amount"
                  bg="white"
                />
              </NumberInput>
            </FormControl>
            <FormControl flex="1 1 180px">
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input
                id="startDate"
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                bg="white"
              />
            </FormControl>
            <FormControl flex="1 1 180px">
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input
                id="endDate"
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                bg="white"
              />
            </FormControl>
            <Button
              leftIcon={<SearchIcon />}
              colorScheme="brand"
              alignSelf="flex-end" 
              onClick={applyFilters}
              minW="120px"
            >
              Apply Filters
            </Button>
          </Flex>
        </VStack>
      </Collapse>
      
      <TableContainer borderWidth={1} borderRadius="lg" shadow="md">
        <Table variant="simple" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th py={3} onClick={() => handleSortChange(ExpenseSortField.Name)} cursor="pointer">
                <Flex align="center">
                  Name {sort.field === ExpenseSortField.Name && (sort.direction === SortDirection.Asc ? <ArrowUpIcon ml={1} /> : <ArrowDownIcon ml={1} />)}
                </Flex>
              </Th>
              <Th py={3} onClick={() => handleSortChange(ExpenseSortField.Amount)} cursor="pointer">
                <Flex align="center">
                  Amount {sort.field === ExpenseSortField.Amount && (sort.direction === SortDirection.Asc ? <ArrowUpIcon ml={1} /> : <ArrowDownIcon ml={1} />)}
                </Flex>
              </Th>
              <Th py={3}>Category</Th>
              <Th py={3}>Currency</Th>
              <Th py={3}>Description</Th>
              <Th py={3} onClick={() => handleSortChange(ExpenseSortField.Date)} cursor="pointer">
                <Flex align="center">
                  Date {sort.field === ExpenseSortField.Date && (sort.direction === SortDirection.Asc ? <ArrowUpIcon ml={1} /> : <ArrowDownIcon ml={1} />)}
                </Flex>
              </Th>
              <Th py={3}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" py={5}>No expenses found with current filters.</Td>
              </Tr>
            ) : (
              expenses.map((expense: any) => (
                <Tr key={expense.id}>
                  <Td>{expense.name}</Td>
                  <Td>{expense.amount.toFixed(2)}</Td>
                  <Td>{expense.category ? formatEnum(expense.category) : 'N/A'}</Td>
                  <Td>{expense.currency || 'N/A'}</Td>
                  <Td>{expense.description}</Td>
                  <Td>{format(new Date(expense.date), 'yyyy-MM-dd')}</Td>
                  <Td>
                    <IconButton
                      aria-label="Edit expense"
                      icon={<EditIcon />}
                      size="sm"
                      mr={2}
                      onClick={() => onEdit(expense)}
                    />
                    <IconButton
                      aria-label="Delete expense"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      isLoading={deleteLoading && expenseToDelete === expense.id}
                      onClick={() => handleDeleteClick(expense.id)}
                    />
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex mt={4} justify="space-between" align="center">
        <Button onClick={handlePrevPage} isDisabled={offset === 0}>
          Previous
        </Button>
        <Text>
          Showing {totalCount > 0 ? offset + 1 : 0} - {Math.min(offset + ITEMS_PER_PAGE, totalCount)} of {totalCount} expenses
        </Text>
        <Button onClick={handleNextPage} isDisabled={(offset + ITEMS_PER_PAGE) >= totalCount}>
          Next
        </Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Expense
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={deleteLoading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ExpenseTable;