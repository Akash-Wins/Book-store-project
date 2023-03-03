import userResolvers from "./resolvers/user.resolvers";
import shopResolvers from "./resolvers/shop.resolvers";
import bookResolvers from "./resolvers/book.resolvers";
import cartResolvers from "./resolvers/cart.resolvers";
import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

const typeDefs = gql`
  ######################################################################
  # Role
  ######################################################################

  enum Role {
    seller
    buyer
  }

  ######################################################################
  # Status
  ######################################################################

  type Status {
    status: Boolean
    success: Boolean
    message: String
  }

  ######################################################################
  # User
  ######################################################################

  type User {
    _id: String
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
    verifyEmailCode: String
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
    _id: String
    bookName: String
    price: Int
    quantity: Int
    shopId: String
  }

  input BookInput {
    _id: String
    bookName: String
    price: Int
    quantity: Int
    shopId: String
  }

  ######################################################################
  # Cart
  ######################################################################

  type Cart {
    _id: String
    buyerId: String
    total: Int
    products: [Products]
  }
  type Products {
    bookId: String
    shopId: String
    quantity: Int
    rate: Int
    amount: Int
  }

  input CartInput {
    cartId: String
    quantity: Int
    shopId: String
    bookId: String
  }

  ######################################################################
  # Query & Mutation
  ######################################################################

  type Query {
    #User
    getUser(_id: String!): User

    #Book
    getBook(_id: String!): Book
    getAllBooks(shopId: String!): [Book]

    #Shop
    getShop(_id: String!): Shop
    getAllShops: [Shop]

    #Cart
    getCart(_id: String!): Cart
    getAllCart(shopId: String!): [Cart]
  }

  type Mutation {
    #User
    registerUser(user: UserInput): Authentication
    login(email: String): Status
    verifyEmail(user: UserInput): Authentication
    updateUser(user: UserInput): User
    deleteUser: Status

    #Shop
    registerShop(shop: ShopInput): Shop
    updateShop(shop: ShopInput): Shop
    deleteShop(shopId: String): Status

    #Book
    registerBook(book: BookInput): Book
    deleteBook(bookId: String): Status

    #Cart
    registerCart(cart: CartInput): Cart
    updateCart(cart: CartInput): Cart
    deleteCart(cartId: String): Status
  }
`;

export const resolvers = merge(
  userResolvers,
  shopResolvers,
  bookResolvers,
  cartResolvers
);
export const executableSchema = makeExecutableSchema({
  resolvers: { ...resolvers },
  typeDefs,
});
