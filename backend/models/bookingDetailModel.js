const { Schema, model } = require("mongoose");
const User = require("./userModel");

// Define the travel detail sub-schema
const travelDetailSchema = new Schema({
  departureTerminal: {
    type: String,
    required: [true, "Departure terminal must be provided"],
    enum: ["Terminal 1", "Terminal 2", "Terminal 3", "Terminal 4", "Terminal 5"]
  },
  arrivalTerminal: {
    type: String,
    required: [true, "Arrival terminal must be provided"],
    enum: ["Terminal 1", "Terminal 2", "Terminal 3", "Terminal 4", "Terminal 5"]
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

// Define the Card detail sub-schema
const cardDetailSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name on the card must be provided"]
  },
  postCode: {
    type: String,
    required: [true, "Post Code must be provided"]
  },
  cardNo: {
    type: String,
    required: [true, "Card No must be provided"]
  },
  expDate: {
    type: String,
    required: [true, "Expiry Date must be provided"]
  },
  cvv: {
    type: String,
    required: [true, "CVV must be provided"]
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
    // cardDetail:cardDetailSchema,
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
    totalPayable : {
      type: Number,
      required: [true, "Total payable must be provided"]
    },
    status: {
      type: String,
      required: [true, "Booking Status must be provided"],
      enum: [ "Paid", "Pending", "Failed", "Cancelled"]
    }
  },
  { timestamps: true }
);

module.exports = model("BookingDetail", bookingDetailSchema);
