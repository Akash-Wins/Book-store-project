export default interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  isActive?: string
  otp?: number
}
