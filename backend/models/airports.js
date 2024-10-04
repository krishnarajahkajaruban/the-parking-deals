const { Schema, model } = require("mongoose");

const airportSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Airport name must be provided"],
      unique: true
    },
    terminals: {
      type: [String],
      required: [true, "Terminals must be provided"],
      validate: {
        validator: function(arr) {
          // Check that all values are from the allowed terminals
          const allowedTerminals = ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4', 'Terminal 5'];
          return arr.every(terminal => allowedTerminals.includes(terminal)) && arr.length <= 5;
        },
        message: props => `Terminals must only include values from 'Terminal 1' to 'Terminal 5' and the maximum length is 5.`
      }
    }    
  },
  { timestamps: true }
);

module.exports = model("Airport", airportSchema);
