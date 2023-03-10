import shortid from "shortid";
import MetaData from "../models/meta.model"

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  sellerId: {
    type: String,
    required: false,
  },
  shopId: {
    type: String,
    required: false,
  },
  bookName:{
    type: String,
    required: false,
  },
  price:{
    type: Number,
    required:false
  },
  quantity:{
    type: Number,
    required:false
  },
  isDeleted:{
    type: Boolean,
    required: false,
    default:false
  },
  meta:MetaData
};
