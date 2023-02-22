import { Role } from "../utils/enum/roleEnum";
import { StatusEnum } from "../utils/enum/statusEnum";
import shortid from "shortid";

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName:{
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    required:true
  },
  isActive:{
    type: String,
    enum: Object.values(StatusEnum),
    required: false,
    default:StatusEnum.ENABLE
  }
};
