const { Schema, model } = require("mongoose");

const subcribedEmailSchema = new Schema(
  {
    email: {
        type: String,
        unique: true,
        required: [true, "Email must be provided"]
      }
  },
  { timestamps: true }
);

module.exports = model("SubcribedEmail", subcribedEmailSchema);
