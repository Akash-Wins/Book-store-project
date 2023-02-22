import IUser from "../../utils/interface/IUser";
import { IResponse } from "../../utils/interface/common";

export interface IUserServiceAPI {
  createUser(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
  login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
  get(request: IGetUserRequest): Promise<IGetUserResponse>;
  update(request: IUpdateUserRequest): Promise<IUpdateUserResponse>;
  delete(request: IDeleteUserRequest): Promise<IDeleteUserResponse>;
}

/********************************************************************************
 *  Create user
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
 * Login
 ********************************************************************************/
export interface ILoginUserRequest {
  email: string;
}
export interface ILoginUserResponse extends IResponse {
  user?: IUser;
  token?: string;
}

/********************************************************************************
 *  Get user
 ********************************************************************************/

export interface IGetUserRequest {
  _id: string;
}
export interface IGetUserResponse extends IResponse {
  user?: IUser;
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
  userId: string
}

export interface IDeleteUserResponse extends IResponse {
  success?: boolean;
}





