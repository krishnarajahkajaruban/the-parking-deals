const { Schema, model } = require("mongoose");

const bookingFareSchema = new Schema(
    {
        bookingFee : {
            type: Number,
            required: [true, "Booking Fee must be provided"]
        },
        smsConfirmationFee : {
            type: Number,
            required: [true, "SMS Confirmation Fee must be provided"]
        },
        cancellationCoverFee : {
            type: Number,
            required: [true, "Cancellation Cover Fee must be provided"]
        }
    },
    {timestamps: true}
);

module.exports = model("BookingFare", bookingFareSchema);