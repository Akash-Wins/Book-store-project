/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as ICartService from "../../service/cart/ICartService";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    async getCart(parent, args, context) {
      useAuthValidator(context);
      const { _id } = args;
      const request: ICartService.IGetCartRequest = {
        _id,
      };
      let response: ICartService.IGetCartResponse;
      try {
        response = await proxy.cart.get(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.cart;
    },

    async getAllCart(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const { shopId } = args;
      const request: ICartService.IGetCartRequest = {
        shopId,
        sellerId: id,
      };
      let response: ICartService.IGetCartResponse;

      try {
        response = await proxy.cart.getAllCart(request);
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
  },

  Mutation: {
    async createCart(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const {
        cart: { bookId, shopId, quantity },
      } = args;

      const request: ICartService.IRegisterCartRequest = {
        bookId,
        quantity,
        shopId,
        buyerId: id,
      };

      let response: ICartService.IRegisterCartResponse;

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

    // async updateCart(parent, args, context) {
    //   useAuthValidator(context);
    //   const { id } = context.req.user;

    //   const request: ICartService.IUpdateCartRequest = {
    //     buyerId: id,
    //     ...args.cart,
    //   };

    //   let response: ICartService.IUpdateCartResponse;

    //   try {
    //     response = await proxy.cart.update(request);

    //     if (response.status !== STATUS_CODES.OK) {
    //       throw new ApolloError(
    //         response.error.message,
    //         response.status.toString()
    //       );
    //     }
    //   } catch (e) {
    //     throw e;
    //   }

    //   return response.cart;
    // },

    async deleteCart(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const { cartId } = args;
      const request: ICartService.IDeleteCartRequest = {
        cartId,
        buyerId: id,
      };
      let response: ICartService.IDeleteCartResponse;
      try {
        response = await proxy.cart.delete(request);
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
