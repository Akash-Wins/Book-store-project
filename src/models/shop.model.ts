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
  shopName:{
    type: String,
    required: false,
  },
  address:{
    type: String,
    required: false,
  },
  isActive:{
    type: Boolean,
    required: false,
    default: true
  },
  meta:MetaData
};
