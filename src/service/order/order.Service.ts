import Joi from "joi";
import OrderStore from "./order.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IOrderService from "./IOrder.Service";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import CartStore from "../cart/cart.Store";
import ShopStore from "../shop/shop.Store";
import IOrder from "../../utils/interface/IOrder";
import IShop from "../../utils/interface/IShop";
import { OrderStatus } from "../../utils/enum/statusEnum";
import BookStore from "../book/book.Store";

export default class OrderService implements IOrderService.IOrderServiceAPI {
  private cartStore = new CartStore();
  private orderStore = new OrderStore();
  private shopStore = new ShopStore();
  private bookStore = new BookStore();
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /**
   * Creating new order
   */
  public createOrder = async (
    request: IOrderService.IRegisterOrderRequest
  ): Promise<IOrderService.IRegisterOrderResponse> => {
    const response: IOrderService.IRegisterOrderResponse = {
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

    const { cartId, buyerId } = params.value;

    let cart: any;
    //check exist cart in database
    try {
      cart = await this.cartStore.getByAttributes({
        buyerId: buyerId,
        _id: cartId,
      });
      if (!cart) {
        response.status = STATUS_CODES.NOT_FOUND;
        response.error = toError(ErrorMessageEnum.RECORD_NOT_FOUND);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    const attributes = {
      buyerId: cart.buyerId,
      total: cart.total,
      products: cart.products,
      meta: {
        createdAt: Date.now(),
        createdBy: cart.buyerId,
      },
    };

    let order;

    try {
      //check after complete order the cart will be automatically deleted from database
      await this.proxy.cart.delete({ cartId, buyerId: cart.buyerId });
      order = await this.orderStore.createOrder(attributes);

      //check if order confirmed then the quantity of book will be subtract
      if (order.orderStatus == OrderStatus.CONFIRMED) {
        order.products.map(async (x) => {
          const findBook = await this.bookStore.getByAttributes({
            _id: x.bookId,
          });

          const updateAttributes = {
            quantity: findBook.quantity - x.quantity,
          };
          await this.bookStore.update(x.bookId, updateAttributes);
          return;
        });
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.order = order;
    return response;
  };

  /**
   * Cancel Order
   */
  public cancelOrder = async (
    request: IOrderService.ICancelOrderRequest
  ): Promise<IOrderService.ICancelOrderResponse> => {
    const response: IOrderService.ICancelOrderResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      orderId: Joi.string().required(),
      buyerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { orderId, buyerId } = params.value;

    let order: IOrder;
    try {
      //check exist order in database
      order = await this.orderStore.getByAttributes({
        buyerId: buyerId,
        _id: orderId,
      });

      //check if order does not exist or canceled
      if (!order || order.orderStatus == OrderStatus.CANCELED) {
        response.status = STATUS_CODES.NOT_FOUND;
        response.error = toError(ErrorMessageEnum.RECORD_NOT_FOUND);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    try {
      order = await this.orderStore.update(order._id, {
        orderStatus: OrderStatus.CANCELED,
        meta: { updatedAt: Date.now(), updatedBy: buyerId },
      });

      //check if order canceled then the quantity of book will be add again in database
      if (order.orderStatus == OrderStatus.CANCELED) {
        order.products.map(async (x) => {
          const findBook = await this.bookStore.getByAttributes({
            _id: x.bookId,
          });

          const updateAttributes = {
            quantity: findBook.quantity + x.quantity,
          };
          await this.bookStore.update(x.bookId, updateAttributes);
          return;
        });
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.success = true;
    response.order = order;
    return response;
  };

  /**
   * Get all order by shopId
   */
  public getAllOrder = async (
    request: IOrderService.IGetOrderRequest
  ): Promise<IOrderService.IGetOrderResponse> => {
    const response: IOrderService.IGetOrderResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      shopId: Joi.string().required(),
      sellerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { shopId, sellerId } = params.value;

    let order: any;
    let shopCheck: IShop;
    try {
      //check exist shop
      try {
        shopCheck = await this.shopStore.getByAttributes({
          _id: shopId,
          sellerId: sellerId,
        });
        if (!shopCheck) {
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
        order = await this.orderStore.getOrderByShopId(shopId);
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.order = order;
    return response;
  };

  /**
   * Get all order by buyer
   */
  public getBuyerOrder = async (
    request: IOrderService.IGetOrderRequest
  ): Promise<IOrderService.IGetOrderResponse> => {
    const response: IOrderService.IGetOrderResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      buyerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { buyerId } = params.value;

    let order: IOrder;
    try {
      order = await this.orderStore.getAll(buyerId);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.order = order;
    return response;
  };
}
