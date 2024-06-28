const mongoose = require("mongoose");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Database connection URL from environment variables
const DB_CONNECT = process.env.DB_CONNECT;

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(DB_CONNECT);
        console.log("MongoDB connected: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDb;