import IMetaData from "./IMeta";
export default interface ICart{
    _id?: string;
    bookId?: string
    buyerId?: string;
    shopId?: string;
    quantity: number;
    meta?:IMetaData;
}