const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email must be provided"]
    },
    title: {
      type: String,
      required: function() {
        return this.role === "User";
      },
      enum: ["Mr.", "Mrs.", "Ms.", "Miss."]
    },
    firstName: {
      type: String,
      required: function() {
        return ["Admin", "User"].includes(this.role);
      },
    },
    lastName: {
      type: String,
      set: function(value) {
        // If the role is not 'User', return undefined to prevent setting a default value
        if (!["Admin", "User"].includes(this.role)) {
          return undefined;
        }
        // If the role is 'User', return the provided value or an empty string if not provided
        return value || "";
      }
    },
    companyName : {
      type: String,
      required: function() {
        return this.role === 'Vendor';
      }
    },
    password: {
      type: String,
      min: 8,
      required: [true, "Password must be provided"],
      select: false // Exclude this field when querying
    },
    mobileNumber: {
      type: Number,
      required: function() {
        return this.role === "User";
      },
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Vendor"],
      required: [true, "Role must be provided"]
    },
    addressL1: {
      type: String,
      required: function() {
        return this.role === "User";
      },
    },
    addressL2: {
      type: String,
      set: function(value) {
        // If the role is not 'User', return undefined to prevent setting a default value
        if (this.role !== "User") {
          return undefined;
        }
        // If the role is 'User', return the provided value or an empty string if not provided
        return value || "";
      }
    },
    city: {
      type: String,
      required: function() {
        return this.role === "User";
      },
    },
    country: {
      type: String,
      required: function() {
        return this.role === "User";
      },
    },
    postCode: {
      type: String,
      required: function() {
        return this.role === "User";
      },
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
