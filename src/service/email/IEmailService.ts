// import { IRequest, IResponse } from "../../utils/interface/common";
// export interface IEmailServiceAPI {
// //   contactUsMail(request: ISendEmailRequest): Promise<ISendEmailResponse>;
// //   SendMailToAdminAboutContactUs(
// //     request: ISendEmailRequest
// //   ): Promise<ISendEmailResponse>;
// //   sendUserEmailVerificationEmail(
// //     request: ISendUserEmailVerificationEmailRequest
// //   ): Promise<ISendUserEmailVerificationEmailResponse>;
// //   sendUserPasswordResetEmail(
// //     request: ISendUserPasswordResetEmailRequest
// //   ): Promise<ISendUserPasswordResetEmailResponse>;
// //   sendNotificationEmail(
// //     request: ISendNotificationEmailRequest
// //   ): Promise<ISendNotificationEmailResponse>;
// //   sendSubscriptionEndEmail(
// //     request: ISendNotificationEmailRequest
// //   ): Promise<ISendNotificationEmailResponse>;
// //   sendNextPaymentDueDateEmail(
// //     request: ISendNextPaymentDueDateEmailRequest
// //   ): Promise<ISendNextPaymentDueDateEmailResponse>;
// //   sendSubscriptionPaymentFailedEmail(
// //     request: ISendInvoicePaymentEmailRequest
// //   ): Promise<ISendInvoicePaymentEmailResponse>;
// //   sendPaymentFailedEmail(
// //     request: ISendInvoicePaymentEmailRequest
// //   ): Promise<ISendInvoicePaymentEmailResponse>;
// //   sendInvoiceDetail(
// //     request: ISendInvoicePaymentEmailRequest
// //   ): Promise<ISendInvoicePaymentEmailResponse>;
// //   sendTrialPeriodEmail(
// //     request: ISendTrialPeriodEmailRequest
// //   ): Promise<ISendTrialPeriodEmailResponse>;
// //   notifyToSubscribers(
// //     request: INotifyToSubscribersEmailRequest
// //   ): Promise<INotifyToSubscribersEmailResponse>;
// }

// /********************************************************************************
//  *  Send Password Reset
//  ********************************************************************************/
// // export interface ISendUserPasswordResetEmailRequest extends ISendEmailRequest {
// //   resetPasswordUrl: string;
// //   firstName?: string;
// //   lastName?: string;
// // }
// // export interface ISendUserPasswordResetEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Notification Email
//  ********************************************************************************/
// // export interface ISendNotificationEmailRequest extends ISendEmailRequest {
// //   paymentDate: number;
// //   firstName?: string;
// //   lastName?: string;
// // }
// // export interface ISendNotificationEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Email
//  ********************************************************************************/

// // export interface ISendEmailRequest extends IRequest {
// //   contactUs?: IContactUs;
// //   toAddress: string;
// //   firstName?: string;
// //   lastName?: string;
// // }
// // export interface ISendEmailResponse extends IResponse {
// //   message?: string;
// // }
// /********************************************************************************
//  *  Send Email Verification
//  ********************************************************************************/
// export interface ISendUserEmailVerificationEmailRequest
//   extends ISendEmailRequest {
//   verifyEmailUrl: string;
//   firstName?: string;
//   lastName?: string;
// }
// export interface ISendUserEmailVerificationEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Next Payment Due Date
//  ********************************************************************************/

// // export interface ISendNextPaymentDueDateEmailRequest extends ISendEmailRequest {
// //   nextPaymentDueDate: number;
// //   firstName?: string;
// //   lastName?: string;
// // }

// // export interface ISendNextPaymentDueDateEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Trial Period
//  ********************************************************************************/

// // export interface ISendTrialPeriodEmailRequest extends ISendEmailRequest {
// //   firstName?: string;
// //   lastName?: string;
// //   paymentDate?: number;
// // }

// // export interface ISendTrialPeriodEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Invoice Subscription payment failed/sucess Email
//  ********************************************************************************/

// // export interface ISendInvoicePaymentEmailRequest extends ISendEmailRequest {
// //   toAddress: string;
// //   ccAddress?: any;
// //   amount?: number;
// //   attachment?: any;
// //   setInvoiceUrl?: string;
// //   nextPaymentDueDate?: number;
// //   supportEmail?: string;
// //   firstName?: string;
// //   lastName?: string;
// //   invoiceDetail?: Partial<IInvoiceEmail>;
// // }

// // export interface ISendInvoicePaymentEmailResponse extends IResponse {}

// /********************************************************************************
//  *  Send Notifiy to Subscribers Mail
//  ********************************************************************************/
// // export interface INotifyToSubscribersEmailRequest extends IRequest {
// //   toAddress: string[];
// //   postUrl: string;
// // }
// // export interface INotifyToSubscribersEmailResponse extends IResponse {}
