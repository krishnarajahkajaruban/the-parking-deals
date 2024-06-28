const { Schema, model } = require("mongoose");

const couponCodeDiscount = new Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Coupon code must be provided"]
    },
    discount: {
      type: Number,
      required: [true, "Discount must be provided"]
    }
  },
  { timestamps: true }
);

module.exports = model("CouponCodeDiscount", couponCodeDiscount);
