const { Schema, model } = require("mongoose");

const airportSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Airport name must be provided"],
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = model("Airport", airportSchema);
