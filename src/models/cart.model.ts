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
  shopId: {
    type: String,
    required: false,
  },
  bookId:{
    type: String,
    required: false,
  },
  quantity:{
    type: Number,
    required:false
  },
  meta:MetaData
};
