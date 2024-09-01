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
        return ["User", "Offline-User"].includes(this.role);
      },
      enum: ["Mr.", "Mrs.", "Ms.", "Miss."]
    },
    firstName: {
      type: String,
      required: function() {
        return ["Admin", "User", "Moderator", "Admin-User",  "Offline-User"].includes(this.role);
      },
    },
    lastname: {
      type: String,
      // set: function(value) {
      //   if (["Admin", "User", "Moderator", "Admin-User"].includes(this.role || this.Role)) {
      //     return value || "";
      //   }
      //   return undefined;
      // }
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
      required: function() {
        return ["Admin", "User", "Moderator", "Admin-User", "Vendor"].includes(this.role);
      },
      select: false // Exclude this field when querying
    },
    mobileNumber: {
      type: Number,
      set: function(value) {
        // For roles "Admin", "Moderator", "Admin-User", return the value or an empty string if no value is provided.
        if (["Admin", "Moderator", "Admin-User", "Offline-User"].includes(this.role)) {
          return value || "";
        }
        return value; // If role doesn't match, just return the provided value
      },
      required: function() {
        // Mobile number is required only for "Vendor" and "User" roles.
        return ["Vendor", "User"].includes(this.role);
      },
    },    
    role: {
      type: String,
      enum: ["Admin", "User", "Vendor", "Moderator", "Admin-User", "Offline-User"],
      required: [true, "Role must be provided"]
    },
    active : {
      type: Boolean,
      required: function() {
        return this.role === 'User';
      }
    },
    createdBy : {
      type: Schema.Types.ObjectId,
      required: function() {
        return this.role === 'Offline-User';
      }
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
    dealPercentage : {
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
    // cancellationCover : {
    //     type: Boolean,
    //     required: function() {
    //       return this.role === 'Vendor';
    //     }
    //   },
    facilities : {
        type: [String],
        required: function() {
          return (this.role || this.Role) === 'Vendor';
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
