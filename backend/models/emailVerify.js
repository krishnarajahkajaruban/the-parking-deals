const { Schema, model } = require("mongoose");

const emailVerifySchema = new Schema(
  {
    email: {
        type: String,
        unique: true,
        required: [true, "Email must be provided"]
      },
    verificationCode: {
        type: String,
        required: [true, "Verfication code must be provided"]
      },
    verifyStatus: {
        type: Boolean,
        required: [true, "Verify status must be provided"]
      }
  },
  { timestamps: true }
);

module.exports = model("EmailVerify", emailVerifySchema);
