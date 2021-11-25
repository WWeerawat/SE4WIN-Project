import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation ($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      email
      password
      firstname
      lastname
      address
      phoneNumber
      role
    }
  }
`;
export const LOGIN_USER = gql`
  mutation ($input: LoginUserInput!) {
    login(loginUserInput: $input) 
  }
`;

export const CREATE_ORDER = gql`
  mutation ($input: CreateOrderInput!) {
    createOrder(createOrderInput: $input){
      id
    }
    
  }
`;

export const UPDATE_USER_INFO = gql`
  mutation ($input: UpdateUserInput!) {
    updateUser(updateUserInput: $input){
      id
      email
      firstname
      lastname
      phoneNumber
      address
    }
    
  }
`;

export const ADD_PRODUCT = gql`
  mutation ($input: CreateProductInput!) {
    updateUser(createProductInput: $input){
      name
    }
    
  }
`;