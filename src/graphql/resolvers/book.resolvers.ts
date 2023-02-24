/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as IBookService from "../../service/book/IBook.Service";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    async getBook(parent, args) {
      const { _id } = args;
      const request: IBookService.IGetBookRequest = {
        _id,
      };
      let response: IBookService.IGetBookResponse;
      try {
        response = await proxy.book.get(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.book;
    },

    async getAllBooks(parent, args, context) {
        const { sellerId } = args;
        const request: IBookService.IGetBookRequest = {
          sellerId
        };
        let response: IBookService.IGetBookResponse;
      
        try {
          response = await proxy.book.getAllBooks(request);
          if (response.status !== STATUS_CODES.OK) {
            throw new ApolloError(
              response.error.message,
              response.status.toString()
            );
          }
        } catch (e) {
          throw e;
        }
        return response.book;
      },  
  },

  Mutation: {
    async registerBook(parent, args,context) {
      useAuthValidator(context);  
      const { id } = context.req.user;
      
      const {
        book: { bookName, shopId, price, quantity},
      } = args;

      const request: IBookService.IRegisterBookRequest = {
        bookName,
        price,
        quantity, 
        shopId:shopId,
        sellerId:id
      };

      let response: IBookService.IRegisterBookResponse

      try {
        response = await proxy.book.createBook(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.book;
    },

    async deleteBook(parent, args, context) {
      useAuthValidator(context);
      const {id} = context.req.user
      const {
        book: { _id},
      } = args;
      const request: IBookService.IDeleteBookRequest = {
        _id,
        userId:id
      };
      let response: IBookService.IDeleteBookResponse;
      try {
        response = await proxy.book.delete(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },
  },
};
