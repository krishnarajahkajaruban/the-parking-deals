const { Schema, model } = require("mongoose");

const couponCodeDiscount = new Schema(
  {
    couponCode: {
      type: String,
      default: ''
      // required: [true, "Coupon code must be provided"]
    },
    discount: {
      type: Number,
      default: 0
      // required: [true, "Discount must be provided"]
    },
    bannerStatus: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = model("CouponCodeDiscount", couponCodeDiscount);
