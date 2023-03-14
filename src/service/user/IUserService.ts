import IUser from "../../utils/interface/IUser";
import { IResponse } from "../../utils/interface/common";

export interface IUserServiceAPI {
  createUser(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
  verifyEmail(
    request: IVerifyUserEmailRequest
  ): Promise<IVerifyUserEmailResponse>;
  login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
  get(request: IGetUserRequest): Promise<IGetUserResponse>;
  update(request: IUpdateUserRequest): Promise<IUpdateUserResponse>;
  delete(request: IDeleteUserRequest): Promise<IDeleteUserResponse>;
  getAllDetails(request: IGetUserRequest): Promise<IGetUserResponse>;
}

/********************************************************************************
 *  Create User
 ********************************************************************************/
export interface IRegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface IRegisterUserResponse extends IResponse {
  user?: IUser;
}

/********************************************************************************
 *  Verify Email
 ********************************************************************************/
export interface IVerifyUserEmailRequest {
  verifyEmailCode: string;
  email: string;
}
export interface IVerifyUserEmailResponse extends IResponse {
  verified?: boolean;
  token?: string;
  user?: IUser;
}

/********************************************************************************
 * Login
 ********************************************************************************/
export interface ILoginUserRequest {
  email: string;
}
export interface ILoginUserResponse extends IResponse {
  message: string;
  user?: IUser;
}

/********************************************************************************
 *  Get User
 ********************************************************************************/

export interface IGetUserRequest {
  _id: string;
}
export interface IGetUserResponse extends IResponse {
  user?: IUser;
  users?: IUser[];
}

/********************************************************************************
 *  Update User
 ********************************************************************************/

export interface IUpdateUserRequest {
  _id: string;
}
export interface IUpdateUserResponse extends IResponse {
  user?: IUser;
}

/********************************************************************************
 * Delete User
 ********************************************************************************/
export interface IDeleteUserRequest {
  userId: string;
}

export interface IDeleteUserResponse extends IResponse {
  success?: boolean;
}
