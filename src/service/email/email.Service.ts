import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import { toError } from "../../utils/interface/common";
import * as IEmailService from "./IEmailService";
import * as nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import {SENDGRID_API_KEY, SENDGRID_FROM_KEY } from "../../env";
import { IAppServiceProxy } from "../appServiceProxy";

enum EMAILTEMPLATESENUM {
  VerifyEmail = "Verify Email"
}

const html: Record<EMAILTEMPLATESENUM, (context: any) => Promise<string>> = {
  [EMAILTEMPLATESENUM.VerifyEmail]: (context) => {
    return Promise.resolve(
      ` <p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
        <p>
          You registered an account on BookFair Application, before being able
          to use your account you need to verify . Your verification code is
          : ${context.verifyEmailUrl}
        </p>
        <p>Kind Regards,</p>
        <p>BookFair Application</p>`
    );
  },
};

export default class EmailService implements IEmailService.IEmailServiceAPI {
  private mailer;
  private proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
    this.mailer = this.createTransport(
      nodemailerSendgrid({
        apiKey: SENDGRID_API_KEY,
      })
    );
  }
  private createTransport(config) {
    const transport = nodemailer.createTransport(config);
    transport.verify((error, success) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
    });
    return transport;
  }

  private sendEmail = async (
    template: EMAILTEMPLATESENUM,
    subject: string,
    toAddress: any = [],
    context: any,
    attachments: any = [],
    ccAddress: any = []
  ): Promise<any> => {
    // if (DEBUG_ENABLED) {
    //   console.info(
    //     `Sending ${template} email to ${toAddress} with context ${JSON.stringify(
    //       context
    //     )}`
    //   );
    // }

    const email = {
      subject,
      html: await html[template](context),
      to: toAddress,
      cc: ccAddress,
      from: SENDGRID_FROM_KEY,
      headers: { "X-SES-CONFIGURATION-SET": "testing-default" },
      attachments,
    };

    try {
      return await this.mailer.sendMail(email);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };


  //send user email verification mail
  public sendUserEmailVerificationEmail = async (
    request: IEmailService.ISendUserEmailVerificationEmailRequest
  ): Promise<IEmailService.ISendUserEmailVerificationEmailResponse> => {
    const response: IEmailService.ISendUserEmailVerificationEmailResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    try {
      await this.sendEmail(
        EMAILTEMPLATESENUM.VerifyEmail,
        "Verify your email",
        request.toAddress,
        {
          userName: request.firstName + " " + request.lastName,
          verifyEmailUrl: request.verifyEmailUrl,
        }
      );
    } catch (e) {
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    return response;
  };
}
