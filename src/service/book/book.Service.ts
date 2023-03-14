import Joi from "joi";
import BookStore from "./book.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IBookService from "./IBook.Service";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import IBook from "../../utils/interface/IBook";
import IShop from "src/utils/interface/IShop";
import ShopStore from "../shop/shop.Store";

export default class BookService implements IBookService.IBookServiceAPI {
  private bookStore = new BookStore();
  private shopStore = new ShopStore();
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /**
   * Creating new book
   */
  public createBook = async (
    request: IBookService.IRegisterBookRequest
  ): Promise<IBookService.IRegisterBookResponse> => {
    const response: IBookService.IRegisterBookResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      bookName: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
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

    const { shopId, bookName, price, quantity, sellerId } = params.value;

    let shopCheck: IShop;
    try {
      shopCheck = await this.shopStore.getByAttributes({
        _id: shopId,
        sellerId,
      });
      //shop check of seller
      if (!shopCheck) {
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
    // Check if book is already registered
    let existingBook: IBook;
    try {
      existingBook = await this.bookStore.getByAttributes({ bookName, shopId });
      //Error if book is already exist
      if (existingBook && existingBook?.bookName) {
        const errorMsg = ErrorMessageEnum.BOOK_ALREADY_EXIST;
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

    //Save the book to storage
    const attributes: IBook = {
      bookName,
      price,
      quantity,
      shopId,
      sellerId,
      meta: {
        createdAt: Date.now(),
        createdBy: sellerId,
      },
    };

    let book: IBook;
    try {
      book = await this.bookStore.createBook(attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.book = book;

    return response;
  };

  /**
   * Update Book
   */
  public update = async (
    request: IBookService.IUpdateBookRequest
  ): Promise<IBookService.IUpdateBookResponse> => {
    const response: IBookService.IUpdateBookResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      bookName: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      sellerId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { _id, bookName, price, quantity, sellerId } = params.value;

    let book: IBook;
    // let user: IUser;
    try {
      //check exist book in database
      try {
        book = await this.bookStore.getByAttributes({
          _id: _id,
          sellerId: sellerId,
        });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
      //if book's id is incorrect
      if (!book || book.isDeleted === true) {
        const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
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

    //Save the book to storage
    const attributes: IBook = {
      bookName,
      price,
      quantity,
      meta: {
        updatedAt: Date.now(),
        updatedBy: sellerId,
      },
    };

    try {
      book = await this.bookStore.update(_id, attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.book = book;
    return response;
  };

  /**
   * Get book by Id
   */
  public get = async (
    request: IBookService.IGetBookRequest
  ): Promise<IBookService.IGetBookResponse> => {
    const response: IBookService.IGetBookResponse = {
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
    let book: IBook;
    try {
      book = await this.bookStore.getByAttributes({ _id });

      //if book's id is incorrect
      if (!book) {
        const errorMsg = ErrorMessageEnum.INVALID_BOOK_ID;
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
    response.book = book;
    return response;
  };

  /**
   * Get All Books
   */
  public getAllBooks = async (
    request: IBookService.IGetBookRequest
  ): Promise<IBookService.IGetBookResponse> => {
    const response: IBookService.IGetBookResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      shopId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { shopId } = params.value;

    let book: IBook;
    try {
      book = await this.bookStore.getAll(shopId);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.book = book;
    return response;
  };

  /**
   * Delete Book
   */
  public delete = async (
    request: IBookService.IDeleteBookRequest
  ): Promise<IBookService.IDeleteBookResponse> => {
    const response: IBookService.IDeleteBookResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      bookId: Joi.string().required(),
      userId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { userId, bookId } = params.value;
    //exists book
    let book: IBook;
    // let user;
    try {
      book = await this.bookStore.getByAttributes({
        _id: bookId,
        isDeleted: false,
      });
      // check for book exist
      if (!book) {
        const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }

      if (book.sellerId !== userId) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.UNAUTHORIZED;
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
      await this.bookStore.update(book._id, { isDeleted: true });
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
