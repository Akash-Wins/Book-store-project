import IBook from "../../utils/interface/IBook";
import { IResponse } from "../../utils/interface/common";

export interface IBookServiceAPI {
  createBook(request: IRegisterBookRequest): Promise<IRegisterBookResponse>;
  get(request: IGetBookRequest): Promise<IGetBookResponse>;
  getAllBooks(request: IGetBookRequest): Promise<IGetBookResponse>;
  update(request: IUpdateBookRequest): Promise<IUpdateBookResponse>;
  delete(request: IDeleteBookRequest): Promise<IDeleteBookResponse>;
}

/********************************************************************************
 *  Create Book
 ********************************************************************************/
export interface IRegisterBookRequest {
  _id?: string;
  shopId?: string;
  sellerId?: string;
  bookName: string;
  price: number;
  quantity: number;
}

export interface IRegisterBookResponse extends IResponse {
  book?: IBook;
}

/********************************************************************************
 *  Get Book
 ********************************************************************************/

export interface IGetBookRequest {
  _id?: string;
  shopId?: string;
}
export interface IGetBookResponse extends IResponse {
  book?: IBook;
}

/********************************************************************************
 * Update Book
 ********************************************************************************/
export interface IUpdateBookRequest {
  _id: string;
  quantity?: number;
  updateAttributes?: any;
}
export interface IUpdateBookResponse extends IResponse {
  book?: IBook;
}

/********************************************************************************
 * Delete Book
 ********************************************************************************/
export interface IDeleteBookRequest {
  bookId?: string;
  userId: string;
}

export interface IDeleteBookResponse extends IResponse {
  success?: boolean;
}
