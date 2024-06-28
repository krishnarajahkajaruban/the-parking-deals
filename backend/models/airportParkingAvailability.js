const { Schema, model } = require("mongoose");
const User = require("./userModel");

const companyParkingSlotSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId, 
        required: [true, "CompanyId must be provided"],
        ref: User
    },
    fromDate: {
      type: Date,
      required: [true, "From date must be provided"],
    },
    toDate: {
      type: Date,
      required: [true, "To date must be provided"],
    },
    fromTime: {
      type: String,
      required: [true, "From time must be provided"],
    },
    toTime: {
        type: String,
        required: [true, "To time must be provided"],
    },
    price: {
        type: Number,
        required: [true, "Parking price must be provided"],
    },
  }, { _id: false } // Prevents creation of an _id field in this subdocument
  );

const airportParkingAvailabilitySchema = new Schema(
  {
    airport: {
      type: String,
      required: [true, "Airport must be provided"],
      unique: true
    },
    companyParkingSlot: [companyParkingSlotSchema]
  },
  { timestamps: true }
);

module.exports = model("AirportParkingAvailability", airportParkingAvailabilitySchema);
