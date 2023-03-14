import ICart from "../../utils/interface/ICart";
import { IResponse } from "../../utils/interface/common";

export interface ICartServiceAPI {
  createCart(request: IRegisterCartRequest): Promise<IRegisterCartResponse>;
  delete(request: IDeleteCartRequest);
  get(request: IGetCartRequest): Promise<IGetCartResponse>;
  getAllCart(request: IGetCartRequest): Promise<IGetCartResponse>;
  update(request: IUpdateCartRequest);
}

/********************************************************************************
 *  Create Cart
 ********************************************************************************/
export interface IRegisterCartRequest {
  _id?: string;
  bookId?: string;
  shopId?: string;
  sellerId?: string;
  buyerId: string;
  quantity?: number;
  total?: number;
}

export interface IRegisterCartResponse extends IResponse {
  cart?: ICart;
}

/********************************************************************************
 *  Update Cart
 ********************************************************************************/

export interface IUpdateCartRequest {
  _id: string;
}
export interface IUpdateCartResponse extends IResponse {
  cart?: ICart;
}

/********************************************************************************
 * Delete Cart
 ********************************************************************************/
export interface IDeleteCartRequest {
  cartId?: string;
  buyerId: string;
}

export interface IDeleteCartResponse extends IResponse {
  success?: boolean;
}

/********************************************************************************
 *  Get Cart
 ********************************************************************************/

export interface IGetCartRequest {
  _id?: string;
  shopId?: string;
  sellerId?: string;
  buyerId?: string;
}
export interface IGetCartResponse extends IResponse {
  cart?: ICart;
}
