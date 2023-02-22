import IBook from "../../utils/interface/IBook";
import { IResponse } from "../../utils/interface/common";

export interface IBookServiceAPI {
  createBook(request: IRegisterBookRequest): Promise<IRegisterBookResponse>;
  get(request: IGetBookRequest): Promise<IGetBookResponse>;
  getAllBooks(request: IGetBookRequest): Promise<IGetBookResponse>;
 
}

/********************************************************************************
 *  Create user
 ********************************************************************************/
export interface IRegisterBookRequest {
  _id?: string;
  shopId?: string; 
  sellerId?: string;
  bookName: string; 
}

export interface IRegisterBookResponse extends IResponse {
  book?: IBook;
}

/********************************************************************************
 *  Get Book
 ********************************************************************************/

export interface IGetBookRequest {
  _id?: string;
  sellerId?: string;
}
export interface IGetBookResponse extends IResponse {
  book?: IBook;
}

