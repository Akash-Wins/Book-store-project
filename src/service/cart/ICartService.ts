import ICart from "../../utils/interface/ICart";
import { IResponse } from "../../utils/interface/common";

export interface ICartServiceAPI {
  createCart(request: IRegisterCartRequest): Promise<IRegisterCartResponse>;
//   get(request: IGetBookRequest): Promise<IGetBookResponse>;
//   getAllBooks(request: IGetBookRequest): Promise<IGetBookResponse>;
//   delete(request: IDeleteBookRequest): Promise<IDeleteBookResponse>;
}

/********************************************************************************
 *  Create Cart
 ********************************************************************************/
export interface IRegisterCartRequest {
  _id?: string;
  bookId: string;
  shopId?: string; 
  sellerId?: string;
  userId?: string;
  quantity: number;
}

export interface IRegisterCartResponse extends IResponse {
  cart?: ICart;
}

// /********************************************************************************
//  *  Get Book
//  ********************************************************************************/

// export interface IGetBookRequest {
//   _id?: string;
//   sellerId?: string;
// }
// export interface IGetBookResponse extends IResponse {
//   book?: IBook;
// }

// /********************************************************************************
//  * Delete Shop
//  ********************************************************************************/
//  export interface IDeleteBookRequest {
//   _id?: string;
//   userId: string
// }

// export interface IDeleteBookResponse extends IResponse {
//   success?: boolean;
// }

