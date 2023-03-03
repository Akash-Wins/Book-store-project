import IMetaData from "./IMeta";
export interface carts{
    price?: number; 
    shopId?: string; 
    bookId?: string;
    quantity: number;
    rate?: number;
    amount: number;
    total?: number;
}
// export default interface ICart{
//     _id?: string;
//     // bookId?: string
//     buyerId?: string;
//     shopId?: string;
//     // quantity: number;
//     totalPrice: number;
//     meta?:IMetaData;
//     products: Array<carts>;
// }

export default interface ICart{
    _id?: string;
    buyerId?: string;
    total?: number;
    meta?:IMetaData;
    products?: Array<carts>;
}