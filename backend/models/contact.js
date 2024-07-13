const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name must be provided"]
        },
        email: {
            type: String,
            required: [true, "Email Id must be provided"]
        },
        mobileNumber: {
            type: Number,
            required: [true, "Mobile Number must be provided"]
        },
        subject: {
            type: String,
            required: [true, "Subject must be provided"]
        },
        message: {
            type: String,
            required: [true, "Message must be provided"]
        }
    },
    { timestamps: true }
);

module .exports = model("Contact", contactSchema);