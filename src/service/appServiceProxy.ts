import * as IUserService from "./user/IUserService";
import * as IShopService from "./shop/IShop.Service";
import * as IBookService from "./book/IBook.Service"

import UserService from "./user/user.Service";
import ShopService from "./shop/shop.Service"
import BookService from "./book/book.Service"

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  shop: IShopService.IShopServiceAPI;
  book: IBookService.IBookServiceAPI
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public shop: IShopService.IShopServiceAPI;
  public book: IBookService.IBookServiceAPI;

  constructor() {
    this.user = new UserService(this);
    this.shop = new ShopService(this);
    this.book = new BookService(this);
  }
}

export default new AppServiceProxy();
