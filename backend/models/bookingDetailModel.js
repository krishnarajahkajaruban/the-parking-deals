const { Schema, model } = require("mongoose");
const User = require("./userModel");

// Define the travel detail sub-schema
const travelDetailSchema = new Schema({
  departureTerminal: {
    type: String,
    required: [true, "Departure terminal must be provided"],
    enum: ["Terminal1", "Terminal2", "Terminal3", "Terminal4", "Terminal5"]
  },
  arrivalTerminal: {
    type: String,
    required: [true, "Arrival terminal must be provided"],
    enum: ["Terminal1", "Terminal2", "Terminal3", "Terminal4", "Terminal5"]
  },
  outBoundFlight: {
    type: String,
    default: "",
  },
  inBoundFlight: {
    type: String,
    default: "",
  },
}, { _id: false } // Prevents creation of an _id field in this subdocument
);

// Define the Vehicle detail sub-schema
const vehicleDetailSchema = new Schema({
  regNo: {
    type: String,
    required: [true, "Vehicle Reg No must be provided"]
  },
  color: {
    type: String,
    required: [true, "Vehicle color must be provided"]
  },
  make: {
    type: String,
    default: "",
  },
  model: {
    type: String,
    default: "",
  }
}, { _id: false } // Prevents creation of an _id field in this subdocument
);
  
// Define the main schema
const bookingDetailSchema = new Schema(
  {
    airportName : {
        type: String,
        required: [true, "Airport Name must be provided"]
    },
    dropOffDate : {
        type: Date,
        required: [true, "Drop Off Date must be provided"]
    },
    dropOffTime : {
        type: String,
        required: [true, "Drop Off Time must be provided"]
    },
    pickUpDate : {
        type: Date,
        required: [true, "Pick Up Date must be provided"]
    },
    pickUpTime : {
        type: String,
        required: [true, "Pick Up Time must be provided"]
    },
    companyId : {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "Company Id must be provided"]
    },
    userId : {
      type: Schema.Types.ObjectId,
      ref: User,
      required: [true, "User Id must be provided"]
    },
    travelDetail: travelDetailSchema,
    vehicleDetail: [vehicleDetailSchema],
    bookingQuote : {
      type: Number,
      required: [true, "Booking Quote must be provided"]
    },
    bookingFee : {
      type: Number,
      required: [true, "Booking Fee must be provided"]
    },
    smsConfirmationFee : {
      type: Number
    },
    cancellationCoverFee : {
      type: Number
    },
    totalBeforeDiscount : {
      type: Number,
      required: [true, "Total before discount must be provided"]
    },
    couponDiscount : {
      type: Number,
      required: [true, "Coupon discount must be provided"]
    },
    totalpayable : {
      type: Number,
      required: [true, "Total payable must be provided"]
    },
    status: {
      type: String,
      required: [true, "Booking Status must be provided"],
      enum: [ "Confirmed", "Cancelled"]
    }
  },
  { timestamps: true }
);

module.exports = model("BookingDetail", bookingDetailSchema);
