import shortid from "shortid";

export default {
  _id: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  shopId: {
    type: String,
    required: false,
  },
  bookName:{
    type: String,
    required: false,
  },
};
