import IShop from "../../utils/interface/IShop";
import { IResponse } from "../../utils/interface/common";

export interface IShopServiceAPI {
  createShop(request: IRegisterShopRequest): Promise<IRegisterShopResponse>;
  get(request: IGetShopRequest): Promise<IGetShopResponse>;
  getAllShops(request: IGetShopRequest): Promise<IGetShopResponse>;
  update(request: IUpdateShopRequest): Promise<IUpdateShopResponse>;
  delete(request: IDeleteShopRequest): Promise<IDeleteShopResponse>;
}

/********************************************************************************
 *  Create user
 ********************************************************************************/
export interface IRegisterShopRequest {
  sellerId?: string; 
  shopName: string; 
  address: string;
}

export interface IRegisterShopResponse extends IResponse {
  shop?: IShop;
}

/********************************************************************************
 *  Get Shop
 ********************************************************************************/

export interface IGetShopRequest {
  _id?: string;
}
export interface IGetShopResponse extends IResponse {
  shop?: IShop;
}

/********************************************************************************
 *  Update Shop
 ********************************************************************************/

 export interface IUpdateShopRequest {
  _id: string;
}
export interface IUpdateShopResponse extends IResponse {
  shop?: IShop;
}

/********************************************************************************
 * Delete Shop
 ********************************************************************************/
 export interface IDeleteShopRequest {
  userId: string
}

export interface IDeleteShopResponse extends IResponse {
  success?: boolean;
}
