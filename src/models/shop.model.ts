import shortid from "shortid";
import { StatusEnum } from "../utils/enum/statusEnum";

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
    type: String,
    enum:Object.values(StatusEnum),
    default:StatusEnum.ENABLE,
    required: false,
  }
};
