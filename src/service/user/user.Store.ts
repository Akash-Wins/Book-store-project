import IUser from "../../utils/interface/IUser";
import { Document, Schema, Model, model } from "mongoose";
import UserMongo from "../../models/user.model";

export interface IUserModel extends IUser, Document {
  _id: string;
}
export const UserSchema = new Schema(UserMongo);
export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default class UserStore {
  aggregate() {
    throw new Error("Method not implemented.");
  }
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new user and saving in Database
   */
  async createUser(userInput: IUser): Promise<IUser> {
    const user = new User(userInput);
    let savedUser: IUser;
    try {
      savedUser = await user.save();
    } catch (error) {
      return error;
    }
    return savedUser;
  }

  /**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object): Promise<IUser> {
    try {
      return await User.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * updating user
   */
  public async update(_id: string, attributes: object): Promise<IUser> {
    try {
      const updateUser = await User.findByIdAndUpdate(
        { _id },
        { $set: attributes },
        { upsert: true, new: true }
      ).lean();
      return updateUser;
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
  }

  /**
   * set veify email code in user
   */
  public async setVerifyEmailCode(
    _id: string,
    verifyEmailCode: string
  ): Promise<IUser> {
    let user: IUser;
    try {
      user = await User.findOneAndUpdate(
        { _id },
        {
          $set: {
            verifyEmailCode,
          },
        },
        { new: true }
      );
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }
  /**
   *verify email and set verifyEmailCode null
   */
  public async verifyEmail(verifyEmailCode: string): Promise<IUser> {
    let user: IUser;
    try {
      user = await User.findOneAndUpdate(
        { verifyEmailCode },
        {
          $set: {
            isActive: true,
            verifyEmailCode: null,
            emailVerifiedAt: Date.now(),
            isVerified: true,
          },
        },
        { new: true }
      );
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }

  /**
   *Get all shop details with book
   */
  public async getAllDetails(_id: string): Promise<IUser[]> {
    try {
      const aggregation = [
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: "shops",
            localField: "_id",
            foreignField: "sellerId",
            as: "shops",
          },
        },
        {
          $unwind: {
            path: "$shops",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "shops._id",
            foreignField: "shopId",
            as: "shops.books",
          },
        },
      ];
      const seller = await User.aggregate(aggregation);
      return seller;
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
  }
}
