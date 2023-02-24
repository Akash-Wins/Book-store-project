import { Role } from "../utils/enum/roleEnum";
import shortid from "shortid";
import MetaData from "../models/meta.model"

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
    type: Boolean,
    required: false,
    default:true
  },
  verifyEmailCode: {
    type: String,
    required: false,
    default: null,
  },
  emailVerifiedAt: {
    type: Number,
    required: false,
    default: null,
  },
  isVerified: {
    type: Boolean,
    required: false,
  },
  meta:MetaData
};
