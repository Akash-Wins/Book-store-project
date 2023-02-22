import StatusCodeEnum from "../enum/StatusCodesEnum";
import ErrorMessageEnum from "../enum/errorMessageEnum";

export interface IResponse {
  status: StatusCodeEnum;
  error?: IError;
}

export interface IError {
  message?: string;
  status?: ErrorMessageEnum;
}

export function joiToError(joiError: any): IError {
  let message =
    "There was an error processing your request. Please contact support.";
  if (joiError && joiError.details && joiError.details[0]) {
    message = joiError.details[0].message;
  } else {
    message = joiError.message;
  }

  const error: IError = {
    message,
  };

  return error;
}

export function toError(message: string): IError {
  const error: IError = {
    message,
  };

  return error;
}
