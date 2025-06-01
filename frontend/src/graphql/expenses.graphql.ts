import { gql } from '@apollo/client';

// Query to get all expenses
export const GET_EXPENSES_QUERY = gql`
  query GetExpenses(
    $limit: Int!
    $offset: Int!
    $filter: ExpenseFilterInput
    $sort: ExpenseSortInput
  ) {
    expenses(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      items {
        id
        name
        amount
        description
        date
        userId
        category
        currency
        createdAt
        updatedAt
      }
      totalCount
      limit
      offset
    }
  }
`;

// Mutation to create an expense
export const CREATE_EXPENSE_MUTATION = gql`
  mutation CreateExpense($createExpenseInput: CreateExpenseInput!) {
    createExpense(createExpenseInput: $createExpenseInput) {
      id
      name
      amount
      description
      date
      userId
      category
      currency
      createdAt
      updatedAt
    }
  }
`;

// Mutation to update an expense
export const UPDATE_EXPENSE_MUTATION = gql`
  mutation UpdateExpense($updateExpenseInput: UpdateExpenseInput!) {
    updateExpense(updateExpenseInput: $updateExpenseInput) {
      id
      name
      amount
      description
      date
      userId
      category
      currency
      createdAt
      updatedAt
    }
  }
`;

// Mutation to delete an expense
export const DELETE_EXPENSE_MUTATION = gql`
  mutation DeleteExpense($id: String!) {
    deleteExpense(id: $id)
  }
`;

// Query for a single expense (e.g., for edit page)
export const GET_EXPENSE_BY_ID_QUERY = gql`
  query GetExpenseById($id: String!) {
    expense(id: $id) {
      id
      name
      amount
      description
      date
      userId
      category
      currency
      createdAt
      updatedAt
    }
  }
`;