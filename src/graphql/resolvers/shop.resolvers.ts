/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as IShopService from "../../service/shop/IShop.Service";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    async getShop(parent, args) {
      const { _id } = args;
      const request: IShopService.IGetShopRequest = {
        _id,
      };
      let response: IShopService.IGetShopResponse;
      try {
        response = await proxy.shop.get(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.shop;
    },

    async getAllShops() {
      const request: IShopService.IGetShopRequest = {};
      let response: IShopService.IGetShopResponse;

      try {
        response = await proxy.shop.getAllShops(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.shop;
    },

    async getSellerAllShops(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const request: IShopService.IGetShopRequest = {
        sellerId: id,
      };
      let response: IShopService.IGetShopResponse;

      try {
        response = await proxy.shop.getSellerAllShops(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.shop;
    },
  },

  Mutation: {
    async registerShop(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const {
        shop: { shopName, address },
      } = args;

      const request: IShopService.IRegisterShopRequest = {
        shopName,
        address,
        sellerId: id,
      };

      let response: IShopService.IRegisterShopResponse;

      try {
        response = await proxy.shop.createShop(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }

      return response.shop;
    },

    async updateShop(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;

      const request: IShopService.IUpdateShopRequest = {
        sellerId: id,
        ...args.shop,
      };

      let response: IShopService.IUpdateShopResponse;

      try {
        response = await proxy.shop.update(request);

        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response.shop;
    },

    async deleteShop(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;
      const { shopId } = args;
      const request: IShopService.IDeleteShopRequest = {
        shopId,
        sellerId: id,
      };
      let response: IShopService.IDeleteShopResponse;

      try {
        response = await proxy.shop.delete(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
      return response;
    },
  },
};
