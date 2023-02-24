import ICart from "../../utils/interface/ICart";
import { Document, Schema, Model, model } from "mongoose";
import CartMongo from "../../models/cart.model";

export interface ICartModel extends ICart, Document {
  _id: string;
}
export const CartSchema = new Schema(CartMongo);
export const Cart: Model<ICartModel> = model<ICartModel>("Cart", CartSchema);

export default class CartStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new book and saving in Database
   */
  async createCart(cartInput: ICart): Promise<ICart> {
    const cart = new Cart(cartInput);
    let savedCart
    try {
        savedCart = await cart.save();
    } catch (error) {
      return error;
    }
    return savedCart;
  }

  /**
   * Get book list
   */
//    public async getAll(sellerId: string): Promise<IBook> {
//     let book;
//     try {
//         book = await Book.find({ sellerId },).lean();
//     } catch (e) {
//       return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
//     }
//     return book;
//   }

//   /**
//    *Get by attributes in object form
//    */
//   public async getByAttributes(attributes: object): Promise<IBook> {
//     try {
//       return await Book.findOne(attributes).lean();
//     } catch (e) {
//       return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
//     }
//   }

//   /**
//    * updating book
//    */
//   public async update(_id: string,attributes: object): Promise<IBook> {
//     try {
//       const updateBook = await Book.findByIdAndUpdate(
//         { _id },
//         { $set: attributes },
//         { upsert: true, new: true }
//       ).lean();
//       return updateBook;
//     } catch (e) {
//       return Promise.reject(new BookStore.OPERATION_UNSUCCESSFUL());
//     }
//   }
}
