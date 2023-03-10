import IMetaData from "./IMeta";
export default interface IBook{
    _id?: string;
    sellerId?: string;
    shopId?: string;
    bookName: string;
    price: number;
    quantity: number;
    isDeleted?: boolean;
    meta?:IMetaData;
}