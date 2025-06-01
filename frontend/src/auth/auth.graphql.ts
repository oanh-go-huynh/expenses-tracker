import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
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

export const SIGNIN_MUTATION = gql`
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

export const ME_QUERY = gql`
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

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;