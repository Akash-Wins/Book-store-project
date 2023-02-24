import { IResponse } from "../../utils/interface/common";
export interface IEmailServiceAPI {
  sendUserEmailVerificationEmail(
    request: ISendUserEmailVerificationEmailRequest
  ): Promise<ISendUserEmailVerificationEmailResponse>;
}

/********************************************************************************
 *  Send Email
 ********************************************************************************/

export interface ISendEmailRequest{
  toAddress: string;
  firstName?: string;
  lastName?: string;
}
export interface ISendEmailResponse extends IResponse {
  message?: string;
}
/********************************************************************************
 *  Send Email Verification
 ********************************************************************************/
export interface ISendUserEmailVerificationEmailRequest
  extends ISendEmailRequest {
  verifyEmailUrl: string;
  firstName?: string;
  lastName?: string;
}
export type ISendUserEmailVerificationEmailResponse = IResponse


