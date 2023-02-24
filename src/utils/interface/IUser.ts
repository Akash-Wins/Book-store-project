import IMetaData from "../interface/IMeta";
export default interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  isActive?: boolean
  isVerified?: boolean;
  otp?: number
  meta?:IMetaData
}
