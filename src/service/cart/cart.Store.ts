import ICart from "../../utils/interface/ICart";
import { Document, Schema, Model, model } from "mongoose";
import CartMongo from "../../models/cart.model";
import { DeleteResult } from "mongodb";

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
   * creating new cart and saving in Database
   */
  async createCart(cartInput: ICart) {
    const cart = new Cart(cartInput);
    let savedCart;
    try {
      savedCart = await cart.save();
    } catch (error) {
      return error;
    }
    return savedCart;
  }

  /**
   *Delete Cart
   */
  public async delete(_id: string): Promise<DeleteResult> {
    try {
      return await Cart.deleteOne({ _id }).lean();
    } catch (e) {
      return Promise.reject(new CartStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * Get Cart list
   */
  public async getAll(shopId: any) {
    let cart;
    try {
      cart = await Cart.find({ shopId }).lean();
    } catch (e) {
      return Promise.reject(new CartStore.OPERATION_UNSUCCESSFUL());
    }
    return cart;
  }

  /**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object) {
    try {
      return await Cart.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new CartStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * updating Cart
   */
  public async update(_id: string, attributes: object) {
    try {
      const updateCart = await Cart.findByIdAndUpdate({ _id }, attributes, {
        upsert: true,
        new: true,
      }).lean();
      return updateCart;
    } catch (e) {
      return Promise.reject(new CartStore.OPERATION_UNSUCCESSFUL());
    }
  }
}
