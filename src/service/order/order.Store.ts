/* eslint-disable prefer-const */
import IOrder from "../../utils/interface/IOrder";
import { Document, Schema, Model, model } from "mongoose";
import OrderMongo from "../../models/order.model";
import { DeleteResult } from "mongodb";

export interface IOrderModel extends IOrder, Document {
  _id: string;
}
export const OrderSchema = new Schema(OrderMongo);
export const Order: Model<IOrderModel> = model<IOrderModel>(
  "Order",
  OrderSchema
);

export default class OrderStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new Order and saving in Database
   */
  async createOrder(orderInput: IOrder) {
    const order = new Order(orderInput);
    let savedOrder;
    try {
      savedOrder = await order.save();
    } catch (error) {
      return error;
    }
    return savedOrder;
  }

  /**
   *Delete Order
   */
  public async delete(_id: string): Promise<DeleteResult> {
    try {
      return await Order.deleteOne({ _id }).lean();
    } catch (e) {
      return Promise.reject(new OrderStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * Get Order list
   */
  public async getAll(buyerId: string) {
    let order;
    try {
      order = await Order.find({ buyerId }).lean();
    } catch (e) {
      return Promise.reject(new OrderStore.OPERATION_UNSUCCESSFUL());
    }
    return order;
  }

  /**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object) {
    try {
      return await Order.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new OrderStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * update
   */
  public async update(_id: string, attributes: object) {
    try {
      const updateOrder = await Order.findByIdAndUpdate({ _id }, attributes, {
        upsert: true,
        new: true,
      }).lean();
      return updateOrder;
    } catch (e) {
      return Promise.reject(new OrderStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * Get all Order list by shopId
   */
  public async getOrderByShopId(id: string) {
    let shopId = id;
    const found = await Order.aggregate([
      {
        $match: {
          "products.shopId": shopId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$buyer",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return found;
  }
}

// [
//   {
//     $unwind: {
//       path: "$products",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $match: {
//       "products.shopId": shopId,
//     },
//   },
//   {
//     $group: {
//       _id: "$products.shopId",
//       products: {
//         $push: "$$ROOT",
//       },
//     },
//   },
// ]
