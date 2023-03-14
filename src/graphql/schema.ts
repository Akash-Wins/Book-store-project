import userResolvers from "./resolvers/user.resolvers";
import shopResolvers from "./resolvers/shop.resolvers";
import bookResolvers from "./resolvers/book.resolvers";
import cartResolvers from "./resolvers/cart.resolvers";
import orderResolvers from "./resolvers/order.resolvers";
import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";

const typeDefs = gql`
  ######################################################################
  # Role
  ######################################################################

  type Meta {
    createdAt: Float
    createdBy: String
    updatedAt: Float
    updatedBy: String
  }

  enum Role {
    seller
    buyer
  }

  enum OrderStaus {
    confirmed
    canceled
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
    shops: Shop
    meta: Meta
  }

  input UserInput {
    _id: String
    firstName: String
    lastName: String
    email: String
    role: Role
  }

  input VerifyEmailInput {
    email: String
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
    books: [Book]
    meta: Meta
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
    meta: Meta
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
    orderStatus: OrderStaus
    products: [Products]
    meta: Meta
  }
  type Products {
    shopName: String
    bookName: String
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
    getAllDetails: [User]

    #Book
    getBook(_id: String!): Book
    getAllBooks(shopId: String!): [Book]

    #Shop
    getShop(_id: String!): Shop
    getSellerAllShops: [Shop]
    getAllShops: [Shop]

    #Cart
    getCart(_id: String!): Cart
    getAllCart(shopId: String!): [Cart]

    #Order
    getAllOrder(shopId: String!): [Cart]
    getBuyerOrder: [Cart]
  }

  type Mutation {
    #User
    registerUser(user: UserInput): Authentication
    login(email: String): Status
    verifyEmail(user: VerifyEmailInput): Authentication
    updateUser(user: UserInput): User
    deleteUser: Status

    #Shop
    registerShop(shop: ShopInput): Shop
    updateShop(shop: ShopInput): Shop
    deleteShop(shopId: String): Status

    #Book
    registerBook(book: BookInput): Book
    updateBook(book: BookInput): Book
    deleteBook(bookId: String): Status

    #Cart
    createCart(cart: CartInput): Cart
    updateCart(cart: CartInput): Cart
    deleteCart(cartId: String): Status

    #Order
    createOrder(order: CartInput): Cart
    cancelOrder(orderId: String): Status
  }
`;

export const resolvers = merge(
  userResolvers,
  shopResolvers,
  bookResolvers,
  cartResolvers,
  orderResolvers
);
export const executableSchema = makeExecutableSchema({
  resolvers: { ...resolvers },
  typeDefs,
});
