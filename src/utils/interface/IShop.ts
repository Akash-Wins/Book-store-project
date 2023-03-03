import IMetaData from "./IMeta";

export default interface IShop{
  _id?: string;
  sellerId?: string;
  shopName: string;
  address: string;
  isActive?: boolean;
  meta?:IMetaData;
}