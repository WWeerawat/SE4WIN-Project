import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      picURL
    }
  }
`;
export const GET_USER_ORDERS = gql`
  query($input:Int!) {
    orderByUser(id:$input){
      id
      product{
        name
        picURL
      }
      quantity
      netPrice
      order_address
      status
    }
  }
`;

export const GET_PRODUCT_INFO = gql`
  query($input:Int!) {
    product(id:$input){
      category{
        name
      }
      name
      desc
      price
      picURL
      stock
    }
  }
`;