import Joi from "joi";
import CartStore from "./cart.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as ICartService from "./ICartService"
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import IBook from "../../utils/interface/IBook";
import ICart from "../../utils/interface/ICart"
import BookStore from "../book/book.Store";

export default class CartService implements ICartService.ICartServiceAPI {
//   private bookStore = new BookStore();
  private cartStore = new CartStore();
  private bookStore = new BookStore()
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /**
   * Creating new cart
   */
  public createCart = async (
    request: ICartService.IRegisterCartRequest
  ): Promise<ICartService.IRegisterCartResponse> => {
    const response: ICartService.IRegisterCartResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      quantity: Joi.number().required(),
      bookId: Joi.string().required(),
      shopId: Joi.string().required(),
      buyerId: Joi.string().required()
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { shopId, bookId, quantity, buyerId } = params.value;

    let validOrderCheck: IBook;
    try {
      validOrderCheck = await this.bookStore.getByAttributes({_id:bookId,shopId});
      //cart check of buyer
      if (!validOrderCheck || quantity > validOrderCheck.quantity ) {
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

    //Save the cart to storage
    const attributes: ICart = {
      quantity,
      bookId,
      shopId,
      buyerId:buyerId,
      meta:{
        createdAt:Date.now(),
        createdBy:buyerId
      }
    };

    let cart: ICart;
    try {
      cart = await this.cartStore.createCart(attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.cart = cart;

    return response;
  };


  /**
   * Delete Cart
   */
   public delete = async (
    request: ICartService.IDeleteCartRequest
  ): Promise<ICartService.IDeleteCartResponse> => {
    const response: ICartService.IDeleteCartResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      cartId: Joi.string().required(),
      buyerId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { cartId ,buyerId} = params.value;

    //exists cart
    let cart;
    try {
      cart = await this.cartStore.getByAttributes({_id: cartId, buyerId:buyerId});  

      // check for cart exist
      if (!cart) {
        const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
        response.status = STATUS_CODES.NOT_FOUND;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    try {
      await this.cartStore.delete(cartId);
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

  /**
   * Get cart by Id
   */
  public get = async (
    request: ICartService.IGetCartRequest
  ): Promise<ICartService.IGetCartResponse> => {
    const response: ICartService.IGetCartResponse = {
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
    let cart: ICart;
    try {
      cart = await this.cartStore.getByAttributes({ _id });

      //if cart's id is incorrect
      if (!cart) {
        const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
        response.status = STATUS_CODES.NOT_FOUND;
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
    response.cart = cart;
    return response;
  };

    /**
   * Get All Cart
   */
  public getAllCart = async (
    request: ICartService.IGetCartRequest
  ): Promise<ICartService.IGetCartResponse> => {
    const response: ICartService.IGetCartResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      shopId: Joi.string().required(),
      sellerId: Joi.string().required()
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { shopId, sellerId } = params.value;
  
    let cart:ICart;

    try {
      const sellerCheck = await this.bookStore.getByAttributes({shopId,sellerId:sellerId})
      cart = await this.cartStore.getAll(shopId);
      
      if(!sellerCheck){
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }

    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = e;
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.cart = cart;
    return response;
  };

}
