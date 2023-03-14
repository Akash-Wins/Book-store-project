import shortid from "shortid";
import MetaData from "../models/meta.model";
import { OrderStatus } from "../utils/enum/statusEnum";

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  cartId: {
    type: String,
    required: false,
  },
  buyerId: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: false,
  },
  products: [
    {
      _id: {
        type: String,
        required: false,
      },
      shopId: String,
      shopName: String,
      bookId: String,
      bookName: String,
      quantity: Number,
      rate: Number,
      amount: Number,
    },
  ],
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.CONFIRMED,
  },
  meta: MetaData,
};
