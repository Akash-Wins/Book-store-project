import userResolvers from "./resolvers/user.resolvers";
import shopResolvers from "./resolvers/shop.resolvers";
import bookResolvers from "./resolvers/book.resolvers";
import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

const typeDefs = gql`
  ######################################################################
  # User
  ######################################################################

  enum Role {
    seller
    buyer
  }

  type Status {
    status: Boolean
    success: Boolean
    message: String
  }
  
  type User {
    firstName: String
    lastName: String
    email: String
  }

  input UserInput {
    _id: String
    firstName: String
    lastName: String
    email: String
    role: Role
    userId: String
  }
  type Authentication {
    user: User!
    token: String!
  }

  ######################################################################
  # Shop
  ######################################################################

  type Shop {
    _id: String
    shopName: String
    address: String
    sellerId: String
  }

  input ShopInput {
    _id: String
    shopName: String
    address: String
  }

  ######################################################################
  # Book
  ######################################################################

  type Book {
    bookName: String
    shopId: String
  }

  input BookInput {
    bookName: String
    shopId: String
  }

  ######################################################################
  # Query & Mutation
  ######################################################################

  type Query {
    #User
    getUser(_id: String!): User
    login(email: String): Authentication

    #Book
    getBook(_id: String!): Book
    getAllBooks: [Book]

    #Shop
    getShop(_id: String!): Shop
    getAllShops: [Shop]
  }

  type Mutation {
    #User
    registerUser(user: UserInput): Authentication
    updateUser(user: UserInput): User
    deleteUser: Status

    #Shop
    registerShop(shop: ShopInput): Shop
    updateShop(shop: ShopInput): Shop
    deleteShop: Status

    #Book
    registerBook(book: BookInput): Book
  }
`;

export const resolvers = merge(
  userResolvers,
  shopResolvers,
  bookResolvers
  );
export const executableSchema = makeExecutableSchema({
  resolvers: { ...resolvers },
  typeDefs,
});
