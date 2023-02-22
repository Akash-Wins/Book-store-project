import Joi from "joi";
import UserStore from "./user.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import IUser from "../../utils/interface/IUser";
import {StatusEnum} from "../../utils/enum/statusEnum"
import ShopStore from "../shop/shop.Store";
// import * as RandomUtil from "../../utils/random";
//import * as IEmailService from "../email/IEmailService";

export default class UserService implements IUserService.IUserServiceAPI {
  private userStore = new UserStore();
  private shopStore = new ShopStore();
  private proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /*****Generate a Token*****/
  private generateJWT = (user: IUser): string => {
    const payLoad = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payLoad, JWT_SECRET);
  };

  /**
   * Creating new user
   */
  public createUser = async (
    request: IUserService.IRegisterUserRequest
  ): Promise<IUserService.IRegisterUserResponse> => {
    const response: IUserService.IRegisterUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { firstName, lastName, email, role } = params.value;

    // Check if email is already registered
    let existingUser: IUser;
    try {
      existingUser = await this.userStore.getByAttributes({ email });

      //Error if email id is already exist
      if (existingUser && existingUser?.email) {
        const errorMsg = ErrorMessageEnum.EMAIL_ALREADY_EXIST;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //Hashing password
    // const hashPassword = await bcrypt.hash(password, 10);

    //Save the user to storage
    const attributes: IUser = {
      firstName,
      lastName,
      email,
      role,
    };

    let user: IUser;
    try {
      user = await this.userStore.createUser(attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    return response;
  };

  /**
   * User login
   */
  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<IUserService.ILoginUserResponse> => {
    const response: IUserService.ILoginUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { email } = params.value;

    let user: IUser;
    try {
      //get user bu email id to check it exist or not
      user = await this.userStore.getByAttributes({ email });
  
      //if credentials are incorrect
      if (!user || user.isActive == StatusEnum.DISABLE) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.UNAUTHORIZED;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    //comparing password to insure that password is correct
    const isValid = await this.userStore.getByAttributes({ email });

    //if isValid or user.password is null
    if (!isValid || !user?.email) {
      const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
      response.status = STATUS_CODES.UNAUTHORIZED;
      response.error = toError(errorMsg);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.token = this.generateJWT(user);
    response.user = user;
    return response;
  };

  /**
   * Get user by Id
   */
  public get = async (
    request: IUserService.IGetUserRequest
  ): Promise<IUserService.IGetUserResponse> => {
    const response: IUserService.IGetUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { _id } = params.value;
    let user: IUser;
    try {
      user = await this.userStore.getByAttributes({ _id });

      //if user's id is incorrect
      if (!user) {
        const errorMsg = ErrorMessageEnum.INVALID_USER_ID;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    return response;
  };

  public update = async (
    request: IUserService.IUpdateUserRequest
  ): Promise<IUserService.IUpdateUserResponse> => {
    const response: IUserService.IUpdateUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { firstName, lastName, email, _id } = params.value;

    //Save the user to storage
    const attributes: IUser = {
      firstName,
      lastName,
      email,
    };

    let user: IUser;
    try {
      user = await this.userStore.update(_id, attributes);
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    return response;
  };

  /**
   * Delete User
   */
  public delete = async (
    request: IUserService.IDeleteUserRequest
  ): Promise<IUserService.IDeleteUserResponse> => {
    const response: IUserService.IDeleteUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      userId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { userId } = params.value;

    //exists user
    let user;
    let shop;
    try {
      user = await this.userStore.getByAttributes({ _id: userId });
      shop = await this.shopStore.getByAttributes({sellerId:userId})
      if (!user) {
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    if (user?.isActive == StatusEnum.DISABLE) {
      const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
      response.status = STATUS_CODES.NOT_FOUND;
      response.error = toError(errorMsg);
      return response;
    }
    try {
      await this.userStore.update( user._id,{ isActive: StatusEnum.DISABLE });
      if(user.isActive == StatusEnum.DISABLE || shop.sellerId == userId ){
        await this.shopStore.update(shop._id,{isActive: StatusEnum.DISABLE});
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
  
    response.status = STATUS_CODES.OK;
    response.success = true;
    return response;
  };
}
