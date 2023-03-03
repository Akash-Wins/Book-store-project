import shortid from "shortid";
import MetaData from "../models/meta.model"

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  buyerId:{
    type: String,
    required: false,
  },
  total:{
    type: Number,
    required: false,
  },
  products: [
    {
      _id:{
        type: String,
        required: false,
      },
      bookId: String,
      shopId: String,
      quantity: Number,
      rate: Number,
      amount: Number,
    }
  ],
  meta:MetaData
  // shopId: {
  //   type: String,
  //   required: false,
  // },
  // bookId:{
  //   type: String,
  //   required: false,
  // },
  // quantity:{
  //   type: Number,
  //   required:false
  // },
  // totalPrice:{
  //   type: Number,
  //   required:false
  //
 
};

