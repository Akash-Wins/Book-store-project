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
      sellerId:Joi.string().required(),
      userId: Joi.string().required()
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { shopId, bookId, quantity, sellerId, userId } = params.value;

    let validOrderCheck: IBook;
    try {
      validOrderCheck = await this.bookStore.getByAttributes({shopId: shopId,sellerId:sellerId,});
      //shop check of seller
      if (!validOrderCheck) {
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
    // // Check if book is already registered
    // let existingBook: IBook;
    // try {
    //   existingBook = await this.bookStore.getByAttributes({ bookName });

    //   //Error if book is already exist
    //   if (existingBook && existingBook?.bookName) {
    //     const errorMsg = ErrorMessageEnum.BOOK_ALREADY_EXIST;
    //     response.status = STATUS_CODES.BAD_REQUEST;
    //     response.error = toError(errorMsg);
    //     return response;
    //   }
    // } catch (e) {
    //   console.error(e);
    //   response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    //   response.error = toError(e.message);
    //   return response;
    // }

    //Save the book to storage
    const attributes: ICart = {
      quantity,
      bookId,
      shopId,
      sellerId,
      userId,
      meta:{
        createdAt:Date.now(),
        createdBy:userId
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

//   /**
//    * Get book by Id
//    */
//   public get = async (
//     request: IBookService.IGetBookRequest
//   ): Promise<IBookService.IGetBookResponse> => {
//     const response: IBookService.IGetBookResponse = {
//       status: STATUS_CODES.UNKNOWN_CODE,
//     };

//     const schema = Joi.object().keys({
//       _id: Joi.string().required(),
//     });

//     const params = schema.validate(request);

//     if (params.error) {
//       console.error(params.error);
//       response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
//       response.error = toError(params.error.details[0].message);
//       return response;
//     }

//     const { _id } = params.value;
//     let book: IBook;
//     try {
//       book = await this.bookStore.getByAttributes({ _id });

//       //if book's id is incorrect
//       if (!book) {
//         const errorMsg = ErrorMessageEnum.INVALID_BOOK_ID;
//         response.status = STATUS_CODES.BAD_REQUEST;
//         response.error = toError(errorMsg);
//         return response;
//       }
//     } catch (e) {
//       console.error(e);
//       response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = STATUS_CODES.OK;
//     response.book = book;
//     return response;
//   };

//   /**
//    * Get All Books
//    */
//   public getAllBooks = async (
//     request: IBookService.IGetBookRequest
//   ): Promise<IBookService.IGetBookResponse> => {
//     const response: IBookService.IGetBookResponse = {
//       status: STATUS_CODES.UNKNOWN_CODE,
//     };
//     const schema = Joi.object().keys({
//       sellerId: Joi.string().required(),
//     });

//     const params = schema.validate(request);

//     if (params.error) {
//       console.error(params.error);
//       response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
//       response.error = toError(params.error.details[0].message);
//       return response;
//     }

//     const { sellerId } = params.value;
  
//     let book:IBook;
//     try {
//       book = await this.bookStore.getAll(sellerId);
//     } catch (e) {
//       console.error(e);
//       response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
//       response.error = e;
//       return response;
//     }
//     response.status = STATUS_CODES.OK;
//     response.book = book;
//     return response;
//   };

//    /**
//    * Delete Book
//    */
//     public delete = async (
//       request: IBookService.IDeleteBookRequest
//     ): Promise<IBookService.IDeleteBookResponse> => {
//       const response: IBookService.IDeleteBookResponse = {
//         status: STATUS_CODES.UNKNOWN_CODE,
//       };
//       const schema = Joi.object().keys({
//         _id: Joi.string().required(),
//         userId: Joi.string().required(),
//       });
//       const params = schema.validate(request);
  
//       if (params.error) {
//         console.error(params.error);
//         response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
//         response.error = toError(params.error.details[0].message);
//         return response;
//       }
//       const { userId , _id} = params.value;
//       //exists book
//       let book: IBook;
//       // let user;
//       try {
//         book = await this.bookStore.getByAttributes({ _id:_id, isDeleted:false });

//         // check for book exist
//         if (!book ) {
//           const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
//           response.status = STATUS_CODES.BAD_REQUEST;
//           response.error = toError(errorMsg);
//           return response;
//         }

//         if(book.sellerId !== userId){
//           const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
//           response.status = STATUS_CODES.UNAUTHORIZED;
//           response.error = toError(errorMsg);
//           return response;
//         }

//       } catch (e) {
//         console.error(e);
//         response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
//         response.error = toError(e.message);
//         return response;
//       }

//       try {
//         await this.bookStore.update(book._id, { isDeleted:true});
//       } catch (e) {
//         console.error(e);
//         response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
//         response.error = toError(e.message);
//         return response;
//       }
  
//       response.status = STATUS_CODES.OK;
//       response.success = true;
//       return response;
//     };

}
