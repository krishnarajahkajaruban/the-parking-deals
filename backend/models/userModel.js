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
    lastname: {
      type: String,
      set: function(value) {
        if (["Admin", "User"].includes(this.role)) {
          return value || "";
        }
        return undefined;
      }
    },    
    companyName : {
      type: String,
      required: function() {
        return this.role === 'Vendor';
      }
    },
    serviceType : {
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
        return ["Vendor", "User"].includes(this.role);
      },
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Vendor"],
      required: [true, "Role must be provided"]
    },
    // addressL1: {
    //   type: String,
    //   required: function() {
    //     return this.role === "User";
    //   },
    // },
    // addressL2: {
    //   type: String,
    //   set: function(value) {
    //     // If the role is not 'User', return undefined to prevent setting a default value
    //     if (this.role !== "User") {
    //       return undefined;
    //     }
    //     // If the role is 'User', return the provided value or an empty string if not provided
    //     return value || "";
    //   }
    // },
    // city: {
    //   type: String,
    //   required: function() {
    //     return this.role === "User";
    //   },
    // },
    // country: {
    //   type: String,
    //   required: function() {
    //     return this.role === "User";
    //   },
    // },
    // postCode: {
    //   type: String,
    //   required: function() {
    //     return this.role === "User";
    //   },
    // },
    dp: {
      type: String,
    },
    rating : {
        type: Number,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    overView : {
        type: String,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    finalQuote : {
        type: Number,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    quote : {
        type: Number,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    cancellationCover : {
        type: Boolean,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    facilities : {
        type: [String],
        required: function() {
          return this.role === 'Vendor';
        }
      },
    dropOffProcedure : {
        type: String,
        required: function() {
          return this.role === 'Vendor';
        }
      },
    pickUpProcedure : {
        type: String,
        required: function() {
          return this.role === 'Vendor';
        }
      },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
