import IMetaData from "./IMeta";
export default interface ICart{
    _id?: string;
    bookId?: string
    sellerId?: string;
    userId?: string;
    shopId?: string;
    quantity: number;
    meta?:IMetaData;
}