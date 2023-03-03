import Joi from "joi";
import UserStore from "./user.Store";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import IUser from "../../utils/interface/IUser";
import IShop from "../../utils/interface/IShop";
import IBook from "../../utils/interface/IBook";
import ShopStore from "../shop/shop.Store";
import BookStore from "../book/book.Store";
import * as RandomUtil from "../../utils/random";
import * as IEmailService from "../email/IEmailService";
import { Role } from "../../utils/enum/roleEnum";

export default class UserService implements IUserService.IUserServiceAPI {
  private userStore = new UserStore();
  private shopStore = new ShopStore();
  private bookStore = new BookStore();
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

    //Save the user to storage
    const attributes: IUser = {
      firstName,
      lastName,
      email,
      role,
      meta: {
        createdAt: Date.now(),
      },
    };

    let user: IUser;
    try {
      user = await this.userStore.createUser(attributes);
      if (user) {
        if (role == Role.BUYER) {
          try {
            await this.proxy.cart.createCart({ buyerId: user?._id });
          } catch (e) {
            console.error(e);
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message);
            return response;
          }
        }
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

  /**
   * Verify email
   */
  public verifyEmail = async (
    request: IUserService.IVerifyUserEmailRequest
  ): Promise<IUserService.IVerifyUserEmailResponse> => {
    const response: IUserService.IVerifyUserEmailResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      email: Joi.string().required(),
      verifyEmailCode: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      response.verified = false;
      return response;
    }
    const { email, verifyEmailCode } = params.value;

    let user: IUser;
    //check exist user
    try {
      const emailCheck = await this.userStore.getByAttributes({
        verifyEmailCode,
        email: email,
      });
      if (!emailCheck) {
        response.status = STATUS_CODES.BAD_REQUEST;
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.error = toError(errorMsg);
        response.verified = false;
        return response;
      }
    } catch (e) {
      console.error(e);
      response.error = toError(e.message);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.verified = false;
      return response;
    }
    try {
      user = await this.userStore.verifyEmail(verifyEmailCode);
      if (!user) {
        response.status = STATUS_CODES.BAD_REQUEST;
        const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.error = toError(errorMsg);
        response.verified = false;
        return response;
      }
    } catch (e) {
      console.error(e);
      response.error = toError(e.message);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.verified = false;
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    response.token = this.generateJWT(user);
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
      message: "",
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
      //get user by email id to check it exist or not
      user = await this.userStore.getByAttributes({ email });

      //if credentials are incorrect
      if (!user || user.isActive == false) {
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

    const isValid = await this.userStore.getByAttributes({ email });
    //if isValid or user.email is null
    if (!isValid || !user?.email) {
      const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
      response.status = STATUS_CODES.UNAUTHORIZED;
      response.error = toError(errorMsg);
      return response;
    }
    // generate a 6 digit code, could hash it, probably not that important right now.
    const verifyEmailCode = RandomUtil.generateRandomNumber(6).toString();

    if (user) {
      try {
        //update code in user
        await this.userStore.setVerifyEmailCode(user._id, verifyEmailCode);

        //veriify code send in mail
        const request: IEmailService.ISendUserEmailVerificationEmailRequest = {
          toAddress: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          verifyEmailUrl: verifyEmailCode,
        };

        await this.proxy.email.sendUserEmailVerificationEmail(request);
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
    }
    response.status = STATUS_CODES.OK;
    response.message = "otp sent to email please verify to login";
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

  /**
   * User update
   */
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

    //Save the user to storage
    const attributes: IUser = {
      firstName,
      lastName,
      email,
      meta: {
        updatedAt: Date.now(),
        updatedBy: _id,
      },
    };
    try {
      user = await this.userStore.update(_id, { ...attributes });
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

    //exists user and shop
    let user;
    let shop: IShop;
    let book: IBook;

    try {
      user = await this.userStore.getByAttributes({ _id: userId });
      //check user not exist in database
      if (!user || user?.isActive == false) {
        const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
        response.status = STATUS_CODES.NOT_FOUND;
        response.error = toError(errorMsg);
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    try {
      //check valid seller exist in shop database
      shop = await this.shopStore.getByAttributes({ sellerId: userId });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    try {
      //check valid seller exist in book database
      book = await this.bookStore.getByAttributes({ sellerId: userId });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    try {
      await this.userStore.update(user._id, { isActive: false });
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    if (user?.isActive == false || shop?.sellerId == userId) {
      try {
        await this.shopStore.update(shop._id, { isActive: false });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
    }

    if (shop?.isActive == false || book?.sellerId == userId) {
      try {
        await this.bookStore.updateAllBooks(book.sellerId, {
          isDeleted: true,
        });
      } catch (e) {
        console.error(e);
        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
    }
    response.status = STATUS_CODES.OK;
    response.success = true;
    return response;
  };
}
