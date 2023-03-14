import IMetaData from "./IMeta";
export interface carts {
  price?: number;
  shopId?: string;
  bookId?: string;
  quantity: number;
  rate?: number;
  amount?: number;
  total?: number;
}

export default interface IOrder {
  _id?: string;
  buyerId?: string;
  total?: number;
  meta?: IMetaData;
  cartId?: string;
  orderStatus?: string;
  products?: Array<carts>;
}
