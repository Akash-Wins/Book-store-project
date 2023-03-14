import Joi from "joi";
import CartStore from "./cart.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as ICartService from "./ICartService";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import ICart from "../../utils/interface/ICart";
import BookStore from "../book/book.Store";
import UserStore from "../user/user.Store";
import ShopStore from "../shop/shop.Store";
import IUser from "../../utils/interface/IUser";
import IBook from "../../utils/interface/IBook";
import { Role } from "../../utils/enum/roleEnum";
import IShop from "src/utils/interface/IShop";

export default class CartService implements ICartService.ICartServiceAPI {
  private cartStore = new CartStore();
  private bookStore = new BookStore();
  private userStore = new UserStore();
  private shopStore = new ShopStore();
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
      buyerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { quantity, bookId, shopId, buyerId } = params.value;

    let buyerCheck: IUser;
    let bookCheck: IBook;
    let shopCheck: IShop;
    //check exist buyer in database
    try {
      buyerCheck = await this.userStore.getByAttributes({ _id: buyerId });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //check exist shop in database
    try {
      shopCheck = await this.shopStore.getByAttributes({ _id: shopId });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //check exist book in database
    try {
      bookCheck = await this.bookStore.getByAttributes({ _id: bookId, shopId });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //check if record is not found in database
    if (!bookCheck || !shopCheck || buyerCheck.role == Role.SELLER) {
      const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
      response.status = STATUS_CODES.NOT_FOUND;
      response.error = toError(errorMsg);
      return response;
    }
    let validCartCheck: ICart;
    let cart: ICart;
    const productAttribute = {
      shopId,
      shopName: shopCheck.shopName,
      bookId,
      bookName: bookCheck.bookName,
      quantity,
      rate: bookCheck.price,
      amount: bookCheck.price * quantity,
    };
    try {
      validCartCheck = await this.cartStore.getByAttributes({
        buyerId: buyerId,
      });
      if (!validCartCheck) {
        //Save the cart to storage
        const attributes: ICart = {
          buyerId,
          products: [productAttribute],
          total: bookCheck.price * quantity,
          meta: {
            createdAt: Date.now(),
            createdBy: buyerId,
          },
        };

        try {
          cart = await this.cartStore.createCart(attributes);
        } catch (e) {
          console.error(e);
          response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.error = toError(e.message);
          return response;
        }
      }
      if (validCartCheck) {
        //cart exist for buyer
        const itemIndex = validCartCheck?.products?.findIndex(
          (p) => p.bookId == bookId
        );
        const shopIndex = validCartCheck?.products?.findIndex(
          (x) => x.shopId == shopId
        );

        //product exists in the cart, update the quantity
        if (itemIndex >= 0) {
          const productItem = validCartCheck.products[itemIndex];
          productItem.quantity = quantity;
          productItem.amount = productItem.quantity * productItem.rate;
          validCartCheck.products[itemIndex] = productItem;
        }
        //check for same shop
        else if (shopIndex >= 0) {
          //product does not exists in cart, add new item
          validCartCheck.products.push(productAttribute);
        }
        //if user adding book from another shop then remove all books and adding new book from new shop
        else {
          const newArr = [];
          validCartCheck.products = newArr;
          validCartCheck.products.push(productAttribute);
        }

        //grandTotal function of cart
        const grandTotal = validCartCheck.products.reduce((sum, value) => {
          return sum + value.amount;
        }, 0);

        try {
          const updateAttr = {
            ...validCartCheck,
            total: grandTotal,
            meta: { updatedAt: Date.now(), updatedBy: buyerId },
          };
          cart = await this.cartStore.update(validCartCheck._id, updateAttr);
        } catch (e) {
          console.error(e);
          response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.error = toError(e.message);
          return response;
        }
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
   * Updating cart
   */
  public update = async (request: ICartService.IUpdateCartRequest) => {
    const response: ICartService.IUpdateCartResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      cartId: Joi.string().required(),
      quantity: Joi.number().required(),
      bookId: Joi.string().required(),
      shopId: Joi.string().required(),
      buyerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { cartId, shopId, bookId, quantity, buyerId } = params.value;

    let validOrderCheck: IBook;
    let validCartCheck: ICart;
    let buyerCheck: IUser;
    try {
      //check exist buyer in database
      try {
        buyerCheck = await this.userStore.getByAttributes({ _id: buyerId });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }

      //check exist cart in database
      try {
        validCartCheck = await this.cartStore.getByAttributes({
          _id: cartId,
          buyerId,
        });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }

      //check exist book in database
      try {
        validOrderCheck = await this.bookStore.getByAttributes({
          shopId,
          _id: bookId,
        });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }

      //check for valid order & exist cart
      if (
        buyerCheck.role == Role.SELLER ||
        !validOrderCheck ||
        quantity > validOrderCheck.quantity ||
        !validCartCheck
      ) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }

      if (validCartCheck) {
        //cart exist for buyer
        const itemIndex = validCartCheck?.products?.findIndex(
          (p) => p.bookId == bookId
        );
        const shopIndex = validCartCheck?.products?.findIndex(
          (x) => x.shopId == shopId
        );

        //product exists in the cart, update the quantity
        if (itemIndex >= 0) {
          const productItem = validCartCheck.products[itemIndex];
          productItem.quantity = quantity;
          productItem.amount = productItem.quantity * productItem.rate;
          validCartCheck.products[itemIndex] = productItem;
        }
        //check for same shop
        else if (shopIndex >= 0) {
          //product does not exists in cart, add new item
          validCartCheck.products.push({
            bookId,
            quantity,
            shopId,
            rate: validOrderCheck.price,
            amount: validOrderCheck.price * quantity,
          });
        }
        //if user adding book from another shop then remove all books and adding new book from new shop
        else {
          const newArr = [];
          validCartCheck.products = newArr;
          validCartCheck.products.push({
            bookId,
            quantity,
            shopId,
            rate: validOrderCheck.price,
            amount: validOrderCheck.price * quantity,
          });
        }
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //grandTotal function of cart
    const grandTotal = validCartCheck.products.reduce((sum, value) => {
      return sum + value.amount;
    }, 0);

    let cart: ICart;
    try {
      cart = await this.cartStore.update(cartId, {
        ...validCartCheck,
        total: grandTotal,
        meta: { updatedAt: Date.now(), updatedBy: buyerId },
      });
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
    const { cartId, buyerId } = params.value;

    //exists cart
    let cart;
    try {
      cart = await this.cartStore.getByAttributes({
        _id: cartId,
        buyerId: buyerId,
      });

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
      //check exist cart
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

    let cart: ICart;
    let sellerCheck: IBook;
    try {
      //check exist book
      try {
        sellerCheck = await this.bookStore.getByAttributes({
          shopId,
          sellerId: sellerId,
        });
        if (!sellerCheck) {
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

      //check exist cart
      try {
        cart = await this.cartStore.getAll(shopId);
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
    response.cart = cart;
    return response;
  };
}
