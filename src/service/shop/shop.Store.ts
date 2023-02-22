import IShop from "../../utils/interface/IShop";
import { Document, Schema, Model, model } from "mongoose";
import ShopMongo from "../../models/shop.model";

export interface IShopModel extends IShop, Document {
  _id: string;
}
export const ShopSchema = new Schema(ShopMongo);
export const Shop: Model<IShopModel> = model<IShopModel>("Shop", ShopSchema);

export default class ShopStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new user and saving in Database
   */
  async createShop(shopInput: IShop): Promise<IShop> {
    const shop = new Shop(shopInput);
    let savedShop
    try {
      savedShop = await shop.save();
    } catch (error) {
      return error;
    }
    return savedShop;
  }

  /**
   * Get Shop list
   */
   public async getAll(): Promise<IShop> {
    let shop;
    try {
        shop = await Shop.find().lean();
    } catch (e) {
      return Promise.reject(new ShopStore.OPERATION_UNSUCCESSFUL());
    }
    return shop;
  }

  /**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object): Promise<IShop> {
    try {
      return await Shop.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new ShopStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * updating shop
   */
  public async update(_id: string,attributes: object): Promise<IShop> {
    try {
      const updateShop = await Shop.findByIdAndUpdate(
        { _id },
        { $set: attributes },
        { upsert: true, new: true }
      ).lean();
      return updateShop;
    } catch (e) {
      return Promise.reject(new ShopStore.OPERATION_UNSUCCESSFUL());
    }
  }
}
