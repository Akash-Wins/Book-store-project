import Joi from "joi";
import ShopStore from "./shop.Store";
import IShop from "../../utils/interface/IShop";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IShopService from "./IShop.Service";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import IUser from "src/utils/interface/IUser";
import UserStore from "../user/user.Store";
import { StatusEnum } from "../../utils/enum/statusEnum";

export default class ShopService implements IShopService.IShopServiceAPI {
  private shopStore = new ShopStore();
  private userStore = new UserStore();
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /**
   * Creating new user
   */
  public createShop = async (
    request: IShopService.IRegisterShopRequest
  ): Promise<IShopService.IRegisterShopResponse> => {
    const response: IShopService.IRegisterShopResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      shopName: Joi.string().required(),
      address: Joi.string().optional(),
      sellerId: Joi.string().required()
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { shopName, address, sellerId } = params.value;

    let userCheck: IUser;
    try {
      userCheck = await this.userStore.getByAttributes({ _id:sellerId });

      //role check only seller can create shop
      if (userCheck.role!=="seller" || userCheck.isActive == StatusEnum.DISABLE) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    // Check if shop is already registered
    let existingShop: IShop;
    try {
      existingShop = await this.shopStore.getByAttributes({ shopName });

      //Error if shop id is already exist
      if (existingShop && existingShop?.shopName) {
        const errorMsg = ErrorMessageEnum.SHOP_ALREADY_EXIST;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //Save the user to storage
    const attributes: IShop = {
      shopName,
      address,
      sellerId
    };

    let shop: IShop;
    try {
      shop = await this.shopStore.createShop(attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.shop = shop;

    return response;
  };

  /**
   * Get shop by Id
   */
  public get = async (
    request: IShopService.IGetShopRequest
  ): Promise<IShopService.IGetShopResponse> => {
    const response: IShopService.IGetShopResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { _id } = params.value;
    let shop: IShop;
    try {
      shop = await this.shopStore.getByAttributes({ _id });

      //if shop's id is incorrect
      if (!shop) {
        const errorMsg = ErrorMessageEnum.INVALID_SHOP_ID;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.shop = shop;
    return response;
  };

   /**
   * Get All Shops
   */
    public getAllShops = async (
      request: IShopService.IGetShopRequest
    ): Promise<IShopService.IGetShopResponse> => {
      const response: IShopService.IGetShopResponse = {
        status: STATUS_CODES.UNKNOWN_CODE,
      };
    
      let shop:IShop;
      try {
        shop = await this.shopStore.getAll();
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = e;
        return response;
      }
      response.status = STATUS_CODES.OK;
      response.shop = shop;
      return response;
    };
  
  
  public update = async (
    request: IShopService.IUpdateShopRequest
  ): Promise<IShopService.IUpdateShopResponse> => {
    const response: IShopService.IUpdateShopResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      shopName: Joi.string().optional(),
      address: Joi.string().optional(),
      sellerId: Joi.string().optional(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { shopName, address, _id , sellerId} = params.value;

    let shop: IShop;
    let user: IUser;
    try {
      shop = await this.shopStore.getByAttributes({ _id,sellerId:sellerId });
      user = await this.userStore.getByAttributes({_id:sellerId});

      //if shop's id is incorrect
      if (!shop || user.isActive == StatusEnum.DISABLE) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //Save the shop to storage
    const attributes: IShop = {
      shopName,
      address,
    };

    try {
      shop = await this.shopStore.update(_id, attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.shop = shop;
    return response;
  };

  /**
   * Delete Shop
   */
  public delete = async (
    request: IShopService.IDeleteShopRequest
  ): Promise<IShopService.IDeleteShopResponse> => {
    const response: IShopService.IDeleteShopResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      userId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { userId } = params.value;

    //exists shop
    let shop;
    try {
      shop = await this.shopStore.getByAttributes({ sellerId: userId });
      if (!shop) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    if (shop?.isActive == StatusEnum.DISABLE) {
      const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
      response.status = STATUS_CODES.NOT_FOUND;
      response.error = toError(errorMsg);
      return response;
    }
    try {
      await this.shopStore.update(shop._id, { isActive: StatusEnum.DISABLE });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    response.status = STATUS_CODES.OK;
    response.success = true;
    return response;
  };

}
