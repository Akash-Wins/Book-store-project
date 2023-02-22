import IUser from "../../utils/interface/IUser";
import { Document, Schema, Model, model } from "mongoose";
import UserMongo from "../../models/user.model";

export interface IUserModel extends IUser, Document {
  _id: string;
}
export const UserSchema = new Schema(UserMongo);
export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default class UserStore {
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
   public async update(_id: string,attributes): Promise<IUser> {
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

}
