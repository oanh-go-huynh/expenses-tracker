import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  user: User;
};

/** The categories for an expense */
export enum Category {
  Education = 'EDUCATION',
  Entertainment = 'ENTERTAINMENT',
  Food = 'FOOD',
  Gifts = 'GIFTS',
  Healthcare = 'HEALTHCARE',
  Housing = 'HOUSING',
  Other = 'OTHER',
  PersonalCare = 'PERSONAL_CARE',
  Transportation = 'TRANSPORTATION',
  Utilities = 'UTILITIES'
}

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  category?: InputMaybe<Category>;
  currency?: InputMaybe<Currency>;
  date: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** The supported currencies for an expense */
export enum Currency {
  Aud = 'AUD',
  Cad = 'CAD',
  Eur = 'EUR',
  Gbp = 'GBP',
  Jpy = 'JPY',
  Usd = 'USD'
}

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  currency?: Maybe<Currency>;
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ExpenseFilterInput = {
  category?: InputMaybe<Category>;
  currency?: InputMaybe<Currency>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

/** Fields by which expenses can be sorted. */
export enum ExpenseSortField {
  Amount = 'AMOUNT',
  CreatedAt = 'CREATED_AT',
  Date = 'DATE',
  Name = 'NAME'
}

export type ExpenseSortInput = {
  /** Sorting direction. */
  direction?: SortDirection;
  /** Field to sort by. */
  field?: ExpenseSortField;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new expense */
  createExpense: Expense;
  /** Delete an expense by ID */
  deleteExpense: Scalars['Boolean']['output'];
  /** Logout the current user by blacklisting their access token */
  logout: Scalars['Boolean']['output'];
  /** Sign in an existing user */
  signin: AuthResponse;
  /** Register a new user */
  signup: AuthResponse;
  /** Update an existing expense */
  updateExpense: Expense;
};


export type MutationCreateExpenseArgs = {
  createExpenseInput: CreateExpenseInput;
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['String']['input'];
};


export type MutationSigninArgs = {
  signInInput: SignInInput;
};


export type MutationSignupArgs = {
  signUpInput: SignUpInput;
};


export type MutationUpdateExpenseArgs = {
  updateExpenseInput: UpdateExpenseInput;
};

export type PaginatedExpenses = {
  __typename?: 'PaginatedExpenses';
  items: Array<Maybe<Expense>>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get a single expense by ID */
  expense: Expense;
  /** Get a list of expenses with pagination, filtering, and sorting */
  expenses: PaginatedExpenses;
  /** Get the currently authenticated user profile */
  me: User;
};


export type QueryExpenseArgs = {
  id: Scalars['String']['input'];
};


export type QueryExpensesArgs = {
  filter?: InputMaybe<ExpenseFilterInput>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  sort?: InputMaybe<ExpenseSortInput>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

/** Defines the sorting direction (ascending or descending). */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<Category>;
  currency?: InputMaybe<Currency>;
  date?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type SignupMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResponse', accessToken: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type SigninMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SigninMutation = { __typename?: 'Mutation', signin: { __typename?: 'AuthResponse', accessToken: string, user: { __typename?: 'User', id: string, email: string, name?: string | null } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, name?: string | null, createdAt: any, updatedAt: any } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetExpensesQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  filter?: InputMaybe<ExpenseFilterInput>;
  sort?: InputMaybe<ExpenseSortInput>;
}>;


export type GetExpensesQuery = { __typename?: 'Query', expenses: { __typename?: 'PaginatedExpenses', totalCount: number, limit: number, offset: number, items: Array<{ __typename?: 'Expense', id: string, name: string, amount: number, description: string, date: any, userId: string, category?: Category | null, currency?: Currency | null, createdAt: any, updatedAt: any } | null> } };

export type CreateExpenseMutationVariables = Exact<{
  createExpenseInput: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, name: string, amount: number, description: string, date: any, userId: string, category?: Category | null, currency?: Currency | null, createdAt: any, updatedAt: any } };

export type UpdateExpenseMutationVariables = Exact<{
  updateExpenseInput: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, name: string, amount: number, description: string, date: any, userId: string, category?: Category | null, currency?: Currency | null, createdAt: any, updatedAt: any } };

export type DeleteExpenseMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteExpenseMutation = { __typename?: 'Mutation', deleteExpense: boolean };

export type GetExpenseByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetExpenseByIdQuery = { __typename?: 'Query', expense: { __typename?: 'Expense', id: string, name: string, amount: number, description: string, date: any, userId: string, category?: Category | null, currency?: Currency | null, createdAt: any, updatedAt: any } };


export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!, $name: String) {
  signup(signUpInput: {email: $email, password: $password, name: $name}) {
    accessToken
    user {
      id
      email
      name
    }
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const SigninDocument = gql`
    mutation Signin($email: String!, $password: String!) {
  signin(signInInput: {email: $email, password: $password}) {
    accessToken
    user {
      id
      email
      name
    }
  }
}
    `;
export type SigninMutationFn = Apollo.MutationFunction<SigninMutation, SigninMutationVariables>;

/**
 * __useSigninMutation__
 *
 * To run a mutation, you first call `useSigninMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSigninMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signinMutation, { data, loading, error }] = useSigninMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSigninMutation(baseOptions?: Apollo.MutationHookOptions<SigninMutation, SigninMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SigninMutation, SigninMutationVariables>(SigninDocument, options);
      }
export type SigninMutationHookResult = ReturnType<typeof useSigninMutation>;
export type SigninMutationResult = Apollo.MutationResult<SigninMutation>;
export type SigninMutationOptions = Apollo.BaseMutationOptions<SigninMutation, SigninMutationVariables>;
export const MeDocument = gql`
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

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetExpensesDocument = gql`
    query GetExpenses($limit: Int!, $offset: Int!, $filter: ExpenseFilterInput, $sort: ExpenseSortInput) {
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

/**
 * __useGetExpensesQuery__
 *
 * To run a query within a React component, call `useGetExpensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExpensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExpensesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetExpensesQuery(baseOptions: Apollo.QueryHookOptions<GetExpensesQuery, GetExpensesQueryVariables> & ({ variables: GetExpensesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, options);
      }
export function useGetExpensesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExpensesQuery, GetExpensesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, options);
        }
export function useGetExpensesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExpensesQuery, GetExpensesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExpensesQuery, GetExpensesQueryVariables>(GetExpensesDocument, options);
        }
export type GetExpensesQueryHookResult = ReturnType<typeof useGetExpensesQuery>;
export type GetExpensesLazyQueryHookResult = ReturnType<typeof useGetExpensesLazyQuery>;
export type GetExpensesSuspenseQueryHookResult = ReturnType<typeof useGetExpensesSuspenseQuery>;
export type GetExpensesQueryResult = Apollo.QueryResult<GetExpensesQuery, GetExpensesQueryVariables>;
export const CreateExpenseDocument = gql`
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
export type CreateExpenseMutationFn = Apollo.MutationFunction<CreateExpenseMutation, CreateExpenseMutationVariables>;

/**
 * __useCreateExpenseMutation__
 *
 * To run a mutation, you first call `useCreateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExpenseMutation, { data, loading, error }] = useCreateExpenseMutation({
 *   variables: {
 *      createExpenseInput: // value for 'createExpenseInput'
 *   },
 * });
 */
export function useCreateExpenseMutation(baseOptions?: Apollo.MutationHookOptions<CreateExpenseMutation, CreateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExpenseMutation, CreateExpenseMutationVariables>(CreateExpenseDocument, options);
      }
export type CreateExpenseMutationHookResult = ReturnType<typeof useCreateExpenseMutation>;
export type CreateExpenseMutationResult = Apollo.MutationResult<CreateExpenseMutation>;
export type CreateExpenseMutationOptions = Apollo.BaseMutationOptions<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = gql`
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
export type UpdateExpenseMutationFn = Apollo.MutationFunction<UpdateExpenseMutation, UpdateExpenseMutationVariables>;

/**
 * __useUpdateExpenseMutation__
 *
 * To run a mutation, you first call `useUpdateExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExpenseMutation, { data, loading, error }] = useUpdateExpenseMutation({
 *   variables: {
 *      updateExpenseInput: // value for 'updateExpenseInput'
 *   },
 * });
 */
export function useUpdateExpenseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExpenseMutation, UpdateExpenseMutationVariables>(UpdateExpenseDocument, options);
      }
export type UpdateExpenseMutationHookResult = ReturnType<typeof useUpdateExpenseMutation>;
export type UpdateExpenseMutationResult = Apollo.MutationResult<UpdateExpenseMutation>;
export type UpdateExpenseMutationOptions = Apollo.BaseMutationOptions<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const DeleteExpenseDocument = gql`
    mutation DeleteExpense($id: String!) {
  deleteExpense(id: $id)
}
    `;
export type DeleteExpenseMutationFn = Apollo.MutationFunction<DeleteExpenseMutation, DeleteExpenseMutationVariables>;

/**
 * __useDeleteExpenseMutation__
 *
 * To run a mutation, you first call `useDeleteExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExpenseMutation, { data, loading, error }] = useDeleteExpenseMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExpenseMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExpenseMutation, DeleteExpenseMutationVariables>(DeleteExpenseDocument, options);
      }
export type DeleteExpenseMutationHookResult = ReturnType<typeof useDeleteExpenseMutation>;
export type DeleteExpenseMutationResult = Apollo.MutationResult<DeleteExpenseMutation>;
export type DeleteExpenseMutationOptions = Apollo.BaseMutationOptions<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const GetExpenseByIdDocument = gql`
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

/**
 * __useGetExpenseByIdQuery__
 *
 * To run a query within a React component, call `useGetExpenseByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExpenseByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExpenseByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetExpenseByIdQuery(baseOptions: Apollo.QueryHookOptions<GetExpenseByIdQuery, GetExpenseByIdQueryVariables> & ({ variables: GetExpenseByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>(GetExpenseByIdDocument, options);
      }
export function useGetExpenseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>(GetExpenseByIdDocument, options);
        }
export function useGetExpenseByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>(GetExpenseByIdDocument, options);
        }
export type GetExpenseByIdQueryHookResult = ReturnType<typeof useGetExpenseByIdQuery>;
export type GetExpenseByIdLazyQueryHookResult = ReturnType<typeof useGetExpenseByIdLazyQuery>;
export type GetExpenseByIdSuspenseQueryHookResult = ReturnType<typeof useGetExpenseByIdSuspenseQuery>;
export type GetExpenseByIdQueryResult = Apollo.QueryResult<GetExpenseByIdQuery, GetExpenseByIdQueryVariables>;