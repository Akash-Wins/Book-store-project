/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as IOrderService from "../../service/order/IOrder.Service";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    async getAllOrder(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const { shopId } = args;
      const request: IOrderService.IGetOrderRequest = {
        shopId,
        sellerId: id,
      };
      let response: IOrderService.IGetOrderResponse;

      try {
        response = await proxy.order.getAllOrder(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.order;
    },

    async getBuyerOrder(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const request: IOrderService.IGetOrderRequest = {
        buyerId: id,
      };
      let response: IOrderService.IGetOrderResponse;

      try {
        response = await proxy.order.getBuyerOrder(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.order;
    },
  },

  Mutation: {
    async createOrder(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const {
        order: { cartId },
      } = args;

      const request: IOrderService.IRegisterOrderRequest = {
        cartId,
        buyerId: id,
      };

      let response: IOrderService.IRegisterOrderResponse;

      try {
        response = await proxy.order.createOrder(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.order;
    },

    async cancelOrder(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const { orderId } = args;

      const request: IOrderService.ICancelOrderRequest = {
        orderId,
        buyerId: id,
      };

      let response: IOrderService.ICancelOrderResponse;

      try {
        response = await proxy.order.cancelOrder(request);
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

    // async deleteCart(parent, args, context) {
    //   useAuthValidator(context);
    //   const { id } = context.req.user;
    //   const { cartId } = args;
    //   const request: ICartService.IDeleteCartRequest = {
    //     cartId,
    //     buyerId: id,
    //   };
    //   let response: ICartService.IDeleteCartResponse;
    //   try {
    //     response = await proxy.cart.delete(request);
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
