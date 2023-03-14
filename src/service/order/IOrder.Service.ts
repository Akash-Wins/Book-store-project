import IOrder from "../../utils/interface/IOrder";
import { IResponse } from "../../utils/interface/common";

export interface IOrderServiceAPI {
  createOrder(request: IRegisterOrderRequest);
  getAllOrder(request: IGetOrderRequest): Promise<IGetOrderResponse>;
  getBuyerOrder(request: IGetOrderRequest): Promise<IGetOrderResponse>;
  cancelOrder(request: ICancelOrderRequest): Promise<ICancelOrderResponse>;
}

/********************************************************************************
 *  Create Order
 ********************************************************************************/
export interface IRegisterOrderRequest {
  _id?: string;
  bookId?: string;
  shopId?: string;
  sellerId?: string;
  buyerId?: string;
  quantity?: number;
  total?: number;
  cartId?: string;
}

export interface IRegisterOrderResponse extends IResponse {
  order?: IOrder;
}

/********************************************************************************
 *  Cancel Order
 ********************************************************************************/
export interface ICancelOrderRequest {
  orderId?: string;
  buyerId?: string;
}

export interface ICancelOrderResponse extends IResponse {
  order?: IOrder;
  success?: boolean;
}

/********************************************************************************
 *  Get Order
 ********************************************************************************/

export interface IGetOrderRequest {
  _id?: string;
  shopId?: string;
  sellerId?: string;
  buyerId?: string;
}
export interface IGetOrderResponse extends IResponse {
  order?: IOrder;
}
