/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as IUserService from "../../service/user/IUserService";
import { useAuthValidator } from "../../utils/middlewares/useauthvalidator";

export default {
  Query: {
    async login(parents, args) {
      const { email } = args;
      const request: IUserService.ILoginUserRequest = {
        email,
      };

      let response: IUserService.ILoginUserResponse = {
        status: STATUS_CODES.UNKNOWN_CODE,
        message:""
      };

      try {
        response = await proxy.user.login(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },

    async getUser(parent, args) {
      const { _id } = args;

      const request: IUserService.IGetUserRequest = {
        _id,
      };
      let response: IUserService.IGetUserResponse;
      try {
        response = await proxy.user.get(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.user;
    },
  },

  Mutation: {
    async registerUser(parent, args) {
      const {
        user: { firstName, lastName, email, role },
      } = args;

      const request: IUserService.IRegisterUserRequest = {
        firstName,
        lastName,
        email,
        role,
      };

      let response: IUserService.IRegisterUserResponse;

      try {
        response = await proxy.user.createUser(request);

        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },

    async verifyEmail(parent, args) {
      const { email , verifyEmailCode } = args.user;

      const request: IUserService.IVerifyUserEmailRequest = {
        email,
        verifyEmailCode
      };

      let response: IUserService.IVerifyUserEmailResponse;

      try {
        response = await proxy.user.verifyEmail(request);

        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }

      return response;
    },

    async updateUser(parent, args, context) {
      useAuthValidator(context);
      const { id } = context.req.user;

      const request: IUserService.IUpdateUserRequest = {
        _id: id,
        ...args.user,
      };

      let response: IUserService.IUpdateUserResponse;

      try {
        response = await proxy.user.update(request);

        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }

      return response.user;
    },

    async deleteUser(parent, args, context) {
      useAuthValidator(context);
      const {id} = context.req.user
      const request: IUserService.IDeleteUserRequest = {
        userId:id
      };
      let response: IUserService.IDeleteUserResponse;
      try {
        response = await proxy.user.delete(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },
  },
};
