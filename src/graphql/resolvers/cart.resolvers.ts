/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as ICartService from "../../service/cart/ICartService";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    // async getBook(parent, args) {
    //   const { _id } = args;
    //   const request: IBookService.IGetBookRequest = {
    //     _id,
    //   };
    //   let response: IBookService.IGetBookResponse;
    //   try {
    //     response = await proxy.book.get(request);
    //     if (response.status !== STATUS_CODES.OK) {
    //       throw new ApolloError(
    //         response.error.message,
    //         response.status.toString()
    //       );
    //     }
    //   } catch (e) {
    //     throw e;
    //   }
    //   return response?.book;
    // },

    // async getAllBooks(parent, args, context) {
    //     const { sellerId } = args;
    //     const request: IBookService.IGetBookRequest = {
    //       sellerId
    //     };
    //     let response: IBookService.IGetBookResponse;
      
    //     try {
    //       response = await proxy.book.getAllBooks(request);
    //       if (response.status !== STATUS_CODES.OK) {
    //         throw new ApolloError(
    //           response.error.message,
    //           response.status.toString()
    //         );
    //       }
    //     } catch (e) {
    //       throw e;
    //     }
    //     return response.book;
    //   },  
  },

  Mutation: {
    async registerCart(parent, args,context) {
      useAuthValidator(context);  
      const { id } = context.req.user;
      console.log(args,"*******args***************")
      const {
        cart: { bookId, shopId, quantity , sellerId },
      } = args;

      const request: ICartService.IRegisterCartRequest = {
        bookId,
        quantity, 
        shopId,
        sellerId,
        userId:id
      };

      let response: ICartService.IRegisterCartResponse

      try {
        response = await proxy.cart.createCart(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.cart;
    },

    // async deleteBook(parent, args, context) {
    //   useAuthValidator(context);
    //   const {id} = context.req.user
    //   const {
    //     book: { _id},
    //   } = args;
    //   const request: IBookService.IDeleteBookRequest = {
    //     _id,
    //     userId:id
    //   };
    //   let response: IBookService.IDeleteBookResponse;
    //   try {
    //     response = await proxy.book.delete(request);
    //     if (response.status !== STATUS_CODES.OK) {
    //       throw new ApolloError(
    //         response.error.message,
    //         response.status.toString()
    //       );
    //     }
    //   } catch (e) {
    //     throw e;
    //   }
    //   return response;
    // },
  },
};
