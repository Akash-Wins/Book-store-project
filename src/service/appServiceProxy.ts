import * as IUserService from "./user/IUserService";
import * as IShopService from "./shop/IShop.Service";
import * as IBookService from "./book/IBook.Service";
import * as IEmailService from "./email/IEmailService";
import * as ICartService from "./cart/ICartService";
import * as IOrderService from "./order/IOrder.Service";

import UserService from "./user/user.Service";
import ShopService from "./shop/shop.Service";
import BookService from "./book/book.Service";
import EmailService from "./email/email.Service";
import CartService from "./cart/cart.Service";
import OrderService from "./order/order.Service";

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  shop: IShopService.IShopServiceAPI;
  book: IBookService.IBookServiceAPI;
  email: IEmailService.IEmailServiceAPI;
  cart: ICartService.ICartServiceAPI;
  order: IOrderService.IOrderServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public shop: IShopService.IShopServiceAPI;
  public book: IBookService.IBookServiceAPI;
  public email: IEmailService.IEmailServiceAPI;
  public cart: ICartService.ICartServiceAPI;
  public order: IOrderService.IOrderServiceAPI;

  constructor() {
    this.user = new UserService(this);
    this.shop = new ShopService(this);
    this.book = new BookService(this);
    this.email = new EmailService(this);
    this.cart = new CartService(this);
    this.order = new OrderService(this);
  }
}

export default new AppServiceProxy();
