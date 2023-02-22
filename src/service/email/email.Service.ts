// import StatusCodeEnum from "../../utils/enum/statusCodesEnum";
// import { toError } from "../../utils/interface/common";
// import * as IEmailService from "./IEmailService";
// import * as nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";
// import { DEBUG_ENABLED, SENDGRID_API_KEY, SENDGRID_FROM_KEY } from "../../env";
// import * as Time from "../../utils/enum/Time";
// import { IAppServiceProxy } from "../appServiceProxy";
// import getTemplate from "./emailTemplate";

// enum EMAILTEMPLATESENUM {
//   ContactUs = "Contact Us",
//   VerifyEmail = "Verify Email",
//   PasswordReset = "Password Reset",
//   PaymentNotification = "Payment Notification",
//   SubscriptionEnd = "Subscription End",
//   NextPaymentDueDate = "Next Payment Due Date",
//   SubscriptionPaymentFailed = "Subscription Payment Failed",
//   PaymentFailed = "Payment Failed",
//   sendInvoiceDetail = "Charged On Payment Due Date",
//   TrialPeriod = "Start Trial Period",
//   SubscribeNewsLetter = "Subscribe Newsletter",
//   SendMailToAdminAboutContactUs = "A new user wants to contact us",
//   NotifyToSubscribersForPost = "Notification for Post",
// }

// const html: Record<EMAILTEMPLATESENUM, (context: any) => Promise<string>> = {
//   [EMAILTEMPLATESENUM.sendInvoiceDetail]: (context) => {
//     return Promise.resolve(
//       ` <p>Thank you for choosing TAM. Your subscription will be ended soon.</p>
//       <p> Your invoice has been created and your payment method on record will be charged on ${context.nextPaymentDueDate}. Your invoice details are as follows:</p><p><b>Total Amount Due: $</b> ${context.invoiceDetail.amount}<br/><b>Period Start Date:</b> ${context.invoiceDetail.planStartAt}<br/><b>Period End Date:</b> ${context.invoiceDetail.planEndAt}<br/><b>Invoice Status:</b> ${context.invoiceDetail.status}</p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.SendMailToAdminAboutContactUs]: (context) => {
//     return Promise.resolve(
//       `<p style="font-size: 20px; color: #2b2d42">Hi TAM,</p>
//       <table style="margin-bottom: 10px">
//         <tr>
//           <td style="color: #2b2d42; width: 80px">Name :</td>
//           <td>${context.name}</td>
//         </tr>
//       </table>
//       <table style="margin-bottom: 10px">
//         <tr>
//           <td style="color: #2b2d42; width: 80px">Email :</td>
//           <td>${context.email}</td>
//         </tr>
//       </table>
//       <table style="margin-bottom: 10px">
//         <tr>
//           <td style="color: #2b2d42; width: 80px; vertical-align: top">
//             Message :
//           </td>
//           <td>${context.message}</td>
//         </tr>`
//     );
//   },
//   [EMAILTEMPLATESENUM.SubscribeNewsLetter]: (context) => {
//     return Promise.resolve(`<p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
//     <h3>Thank you so much for signing up Newsletter.</h3>
//     <p>It is a delight to have you on board.</p>
//     You will receive our newsletter twice a month about updates, latest deals, and offers.

//     <p>Regards,</p>
//     <p>TAM</p>`);
//   },
//   [EMAILTEMPLATESENUM.NotifyToSubscribersForPost]: (context) => {
//     return Promise.resolve(
//       ` <p>Hi User,</br></br> New post is published by TAM. <a href=${context.postUrl}>Click here</a> to checkout the new post.</p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.TrialPeriod]: (context) => {
//     return Promise.resolve(
//       `<h3 style="font-size: 16px;">Hi ${context.userName},</h3>
//                     <p> Welcome to TAM. Your 7-day free Trial starts today.</p>
//                     <p>What happens next? Keep an eye on your inbox as we’ll be sending you the best tips for to make sure you get the most out of it.</p>
//                     <p>If you’re interested in learning more about us or need help deciding on the best plan for your business, feel free to contact our support team at any time. We’re always here to help you in any way we can.</p>
//                     <p>Have an awesome day,</p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.PasswordReset]: (context) => {
//     return Promise.resolve(
//       `  <p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
//       <p>There was a request to change your password!</p>
//       <p>
//         If you did not make this request then please ignore this email.
//       </p>
//       <p>
//         Otherwise, please click this link to change your password:
//         <a href="${context.resetPasswordUrl}" style="color: #e07a5f">link</a>
//       </p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.ContactUs]: (context) => {
//     return Promise.resolve(
//       ` <h1 style="color: #2b2d42; margin: 10px 0 15px 0">
//       Thank you for contacting us.
//     </h1>
//     <p style="margin: 0px; color: #2b2d42">
//       We appreciate that you've taken the time to write us .
//     </p>
//     <p style="margin-top: 10px; color: #2b2d42">
//       We'll get back to you very soon
//     </p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.SubscriptionEnd]: (context) => {
//     return Promise.resolve(
//       `Thank you for choosing TAM. Your subscription will be ended soon.`
//     );
//   },
//   [EMAILTEMPLATESENUM.PaymentNotification]: (context) => {
//     return Promise.resolve(
//       `<p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
//       <p>
//         Your trail period will be deactivated in 48 hours, and all of your
//         premium content will be disabled. Payment will be deduct automatically after 48 hours.
//       </p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.VerifyEmail]: (context) => {
//     return Promise.resolve(
//       ` <p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
//         <p>
//           You registered an account on TAM, before being able
//           to use your account you need to verify . Your verification code is
//           : ${context.verifyEmailUrl}
//         </p>
//         <p>Kind Regards,</p>
//         <p>TAM</p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.NextPaymentDueDate]: (context) => {
//     return Promise.resolve(
//       `<p style="font-size: 20px; color: #2b2d42">Hi ${context.userName},</p>
//       <p> Welcome to TAM </p>
//       <p>Thankyou you for subscribing </p>
//       <p>Your 1 year plan starts today </p>
//       <p>What happens next? Keep an eye on your inbox as we’ll be sending you the best tips for to make sure you get the most out of it.</p>
//       <p>If you’re interested in learning more about  or need help deciding on the best plan for your business, feel free to contact our support team at any time. We’re always here to help you in any way we can.</p>
//       <p>Have an awesome day,</p>`
//     );
//   },
//   [EMAILTEMPLATESENUM.SubscriptionPaymentFailed]: (context) => {
//     return Promise.resolve(
//       `We have had a problem processing your TAM payment. Please update your payment method in TAM. We will try to process your payment again in 3 days.`
//     );
//   },
//   [EMAILTEMPLATESENUM.PaymentFailed]: (context) => {
//     return Promise.resolve(
//       `Your payment has been declined. Please contact TAM. `
//     );
//   },
// };

// export default class EmailService implements IEmailService.IEmailServiceAPI {
//   private mailer;
//   private proxy: IAppServiceProxy;
//   constructor(proxy: IAppServiceProxy) {
//     this.proxy = proxy;
//     this.mailer = this.createTransport(
//       nodemailerSendgrid({
//         apiKey: SENDGRID_API_KEY,
//       })
//     );
//   }
//   private createTransport(config) {
//     const transport = nodemailer.createTransport(config);
//     transport.verify((error, success) => {
//       if (error) {
//         console.error(error);
//         process.exit(1);
//       }
//     });
//     return transport;
//   }

//   private sendEmail = async (
//     template: EMAILTEMPLATESENUM,
//     subject: string,
//     toAddress: any = [],
//     context: any,
//     attachments: any = [],
//     ccAddress: any = []
//   ): Promise<any> => {
//     if (DEBUG_ENABLED) {
//       console.info(
//         `Sending ${template} email to ${toAddress} with context ${JSON.stringify(
//           context
//         )}`
//       );
//     }
//     let data = await html[template](context);
//     // let HtmlBody = await getTemplate({ data })

//     const email = {
//       subject,
//       html: await getTemplate({ data }),
//       to: toAddress,
//       cc: ccAddress,
//       from: SENDGRID_FROM_KEY,
//       headers: { "X-SES-CONFIGURATION-SET": "testing-default" },
//       attachments,
//     };

//     try {
//       return await this.mailer.sendMail(email);
//     } catch (e) {
//       console.error(e);
//       throw e;
//     }
//   };

//   //send contact us mail
//   public contactUsMail = async (
//     request: IEmailService.ISendEmailRequest
//   ): Promise<IEmailService.ISendEmailResponse> => {
//     let response: IEmailService.ISendEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.ContactUs,
//         "Contact us",
//         request?.toAddress,
//         {
//           toAddress: request?.toAddress,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //send mail to user about user who wants to contact us
//   public SendMailToAdminAboutContactUs = async (
//     request: IEmailService.ISendEmailRequest
//   ): Promise<IEmailService.ISendEmailResponse> => {
//     let response: IEmailService.ISendEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.SendMailToAdminAboutContactUs,
//         "Contact us",
//         request?.toAddress,
//         {
//           toAddress: request?.toAddress,
//           name: request?.contactUs?.name,
//           email: request?.contactUs?.email,
//           message: request?.contactUs?.message,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //send user email verification mail
//   public sendUserEmailVerificationEmail = async (
//     request: IEmailService.ISendUserEmailVerificationEmailRequest
//   ): Promise<IEmailService.ISendUserEmailVerificationEmailResponse> => {
//     let response: IEmailService.ISendUserEmailVerificationEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.VerifyEmail,
//         "Verify your email",
//         request.toAddress,
//         {
//           userName: request.firstName + " " + request.lastName,
//           verifyEmailUrl: request.verifyEmailUrl,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //send notification mail
//   public sendNotificationEmail = async (
//     request: IEmailService.ISendNotificationEmailRequest
//   ): Promise<IEmailService.ISendNotificationEmailResponse> => {
//     let response: IEmailService.ISendNotificationEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.PaymentNotification,
//         "Notification for payment",
//         request.toAddress,

//         {
//           userName: request.firstName + " " + request.lastName,
//           paymentDate: Time.changeUnixToHumanDate(request.paymentDate),
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //send subscription end mail
//   public sendSubscriptionEndEmail = async (
//     request: IEmailService.ISendNotificationEmailRequest
//   ): Promise<IEmailService.ISendNotificationEmailResponse> => {
//     let response: IEmailService.ISendNotificationEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.SubscriptionEnd,
//         "Subsciption ended soon",
//         request.toAddress,
//         {
//           userName: request.firstName + " " + request.lastName,
//           paymentDate: request.paymentDate,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //send user email for reset password
//   public sendUserPasswordResetEmail = async (
//     request: IEmailService.ISendUserPasswordResetEmailRequest
//   ): Promise<IEmailService.ISendUserPasswordResetEmailResponse> => {
//     let response: IEmailService.ISendUserPasswordResetEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.PasswordReset,
//         "Reset Your Password",
//         request.toAddress,
//         {
//           userName: request.firstName + " " + request.lastName,
//           resetPasswordUrl: request.resetPasswordUrl,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   // Send Next Payment Due Date Email
//   public sendNextPaymentDueDateEmail = async (
//     request: IEmailService.ISendNextPaymentDueDateEmailRequest
//   ): Promise<IEmailService.ISendNextPaymentDueDateEmailResponse> => {
//     const response: IEmailService.ISendNextPaymentDueDateEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.NextPaymentDueDate,
//         "TAM payment confirmation",
//         request.toAddress,
//         {
//           userName: request.firstName + " " + request.lastName,
//           nextPaymentDueDate: Time.changeUnixToHumanDate(
//             request.nextPaymentDueDate
//           ),
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   // Send trial period mail
//   public sendTrialPeriodEmail = async (
//     request: IEmailService.ISendTrialPeriodEmailRequest
//   ): Promise<IEmailService.ISendTrialPeriodEmailResponse> => {
//     const response: IEmailService.ISendTrialPeriodEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.TrialPeriod,
//         "Start Trial Period",
//         request.toAddress,
//         {
//           userName: request?.firstName + " " + request?.lastName,
//           paymentDate: Time.changeUnixToHumanDate(request.paymentDate),
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };
//   // Send Subscription Payment Failed
//   public sendSubscriptionPaymentFailedEmail = async (
//     request: IEmailService.ISendInvoicePaymentEmailRequest
//   ): Promise<IEmailService.ISendInvoicePaymentEmailResponse> => {
//     const response: IEmailService.ISendInvoicePaymentEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.SubscriptionPaymentFailed,
//         "TAM payment failed",
//         request.toAddress,
//         {
//           userName: request?.firstName + " " + request?.lastName,
//           toAddress: request?.toAddress,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //Send payment failed
//   public sendPaymentFailedEmail = async (
//     request: IEmailService.ISendInvoicePaymentEmailRequest
//   ): Promise<IEmailService.ISendInvoicePaymentEmailResponse> => {
//     const response: IEmailService.ISendInvoicePaymentEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.PaymentFailed,
//         "TAM payment failed",
//         request.toAddress,
//         {
//           userName: request?.firstName + " " + request?.lastName,
//           toAddress: request?.toAddress,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   // Send Confirmation of payment in 7 days
//   public sendInvoiceDetail = async (
//     request: IEmailService.ISendInvoicePaymentEmailRequest
//   ): Promise<IEmailService.ISendInvoicePaymentEmailResponse> => {
//     const response: IEmailService.ISendInvoicePaymentEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.sendInvoiceDetail,
//         "Your TAM payment will be processed soon",
//         request?.toAddress,
//         {
//           nextPaymentDueDate: Time.changeUnixToHumanDate(
//             request.nextPaymentDueDate
//           ),
//           invoiceDetail: request?.invoiceDetail,
//           userName: request?.firstName + " " + request?.lastName,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };

//   //Send post published notification to all subscribe users
//   public notifyToSubscribers = async (
//     request: IEmailService.INotifyToSubscribersEmailRequest
//   ): Promise<IEmailService.INotifyToSubscribersEmailResponse> => {
//     let response: IEmailService.INotifyToSubscribersEmailResponse = {
//       status: StatusCodeEnum.UNKNOWN_CODE,
//     };
//     try {
//       await this.sendEmail(
//         EMAILTEMPLATESENUM.NotifyToSubscribersForPost,
//         "New post published",
//         request?.toAddress,
//         {
//           toAddress: request?.toAddress,
//           postUrl: request?.postUrl,
//         }
//       );
//     } catch (e) {
//       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
//       response.error = toError(e.message);
//       return response;
//     }
//     response.status = StatusCodeEnum.OK;
//     return response;
//   };
// }
