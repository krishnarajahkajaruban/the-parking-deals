const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv");
const morgan = require("morgan");
const http = require("http");
// const { Server } = require('socket.io');
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const rawBody = require("raw-body");
const BookingDetail = require("./models/bookingDetailModel");
const User = require("./models/userModel");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const commonRoleRouter = require("./routes/commonRoleRouter");
const sendEmail = require("./common/mailService");
const { sendEmailToUser, sendEmailToCompany } = require("./common/sendingmail");

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Get port from environment variables or use default port 3000
const PORT = process.env.PORT || 5001;

// Middleware setup
app.use(
  cors({
    // CORS setup
    origin: [
      "https://www.theparkingdeals.co.uk",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://the-parking-deals.netlify.app",
      "https://the-parking-deals-web.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
  })
);

// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://the-parking-deals.netlify.app', 'https://the-parking-deals-web.onrender.com'],
//     methods: ["GET", "POST"],
//   },
// });

app.use(morgan("tiny")); // Logging

// Middleware to handle raw body for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    rawBody(
      req,
      {
        length: req.headers["content-length"],
        limit: "1mb",
        type: "application/json",
      },
      (err, string) => {
        if (err) return next(err);
        req.rawBody = string;
        next();
      }
    );
  } else {
    express.json()(req, res, next);
  }
});

// io.on('connection', (socket) => {
//   console.log('Client connected to Socket.io');
// });

// Webhook endpoint to handle Stripe events
app.post("/webhook", async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("checkout session completed");
    const session = event.data.object;
    await handleCheckoutSession(session);
    // io.emit('checkout.session.completed', session);
  } else if (event.type === "payment_intent.payment_failed") {
    console.log("payment intent failed");
    const paymentIntent = event.data.object;
    await handlePaymentFailure(paymentIntent);
    // io.emit('payment_intent.payment_failed', paymentIntent);
  }

  res.json({ received: true });
});

async function handleCheckoutSession(session) {
  try {
    console.log(session);
    const booking_id = session.metadata.booking_id;
    const stripePaymentId = session.id;
    const bookingUser = session.metadata.user;

    console.log(`Booking ID: ${booking_id}`);
    console.log(`Stripe Payment ID: ${stripePaymentId}`);

    // Update booking status to failed in your database
    const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(
      booking_id,
      {
        status: "Paid",
        stripePaymentId, // Save the Stripe payment ID
      },
      { new: true }
    );

    if (!updatedBookingDetail) {
      throw new Error(`Booking detail not found for ID: ${booking_id}`);
    }

    console.log(
      `Updated Booking Detail: ${JSON.stringify(updatedBookingDetail)}`
    );

    // Check if userId is present in the updated booking detail
    if (!bookingUser) {
      throw new Error(
        `User ID not found in booking detail for ID: ${booking_id}`
      );
    }

    // Retrieve user details
    // const user = await User.findById(updatedBookingDetail.userId)
    //   .select("firstName lastname title email mobileNumber")
    //   .lean()
    //   .exec();

    // if (!user) {
    //   throw new Error(`User not found for ID: ${updatedBookingDetail.userId}`);
    // }

    console.log(`User Details: ${JSON.stringify(bookingUser)}`);

    // Send emails to user and company
    await Promise.all([
      sendEmailToUser(updatedBookingDetail, bookingUser, "Confirmed"),
      sendEmailToCompany(updatedBookingDetail, bookingUser, "Confirmed"),
    ]);

    console.log(`Emails sent successfully for payment success: ${session.id}`);
  } catch (error) {
    console.error(`Error handling payment success: ${error.message}`);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    // Extract booking ID from payment intent metadata
    console.log(paymentIntent);
    const booking_id = paymentIntent.metadata.booking_id;
    const stripePaymentId = paymentIntent.id;
    const bookingUser = session.metadata.user;

    console.log(`Booking ID: ${booking_id}`);
    console.log(`Stripe Payment ID: ${stripePaymentId}`);

    // Update booking status to failed in your database
    const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(
      booking_id,
      {
        status: "Failed",
        stripePaymentId, // Save the Stripe payment ID
      },
      { new: true }
    );

    if (!updatedBookingDetail) {
      throw new Error(`Booking detail not found for ID: ${booking_id}`);
    }

    console.log(
      `Updated Booking Detail: ${JSON.stringify(updatedBookingDetail)}`
    );

    // Check if userId is present in the updated booking detail
    if (!bookingUser) {
      throw new Error(
        `User ID not found in booking detail for ID: ${booking_id}`
      );
    }

    // console.log(`User ID: ${updatedBookingDetail.userId}`);

    // // Retrieve user details
    // const user = await User.findById(updatedBookingDetail.userId)
    //   .select("firstName lastname title email mobileNumber")
    //   .lean()
    //   .exec();

    // if (!user) {
    //   throw new Error(`User not found for ID: ${updatedBookingDetail.userId}`);
    // }

    console.log(`User Details: ${JSON.stringify(bookingUser)}`);

    // Send emails to user and company
    await Promise.all([
      sendEmailToUser(updatedBookingDetail, bookingUser, "Failed"),
      sendEmailToCompany(updatedBookingDetail, bookingUser, "Failed"),
    ]);

    console.log(
      `Emails sent successfully for paymentIntent: ${paymentIntent.id}`
    );
  } catch (error) {
    console.error(`Error handling payment failure: ${error.message}`);
  }
}



// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/common-role", commonRoleRouter);

// Error handling middleware for Multer errors
app.use((err, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  if (err instanceof Multer.MulterError) {
    res.status(400).json({ error: err.message });
  } else if (err) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

// app.patch('/update-active-field', async (req, res) => {
//   try {
//     const result = await User.updateMany(
//       { role: 'User' }, // Query to find users with the role 'User'
//       { $set: { active: true } } // Update operation to set 'active' to true
//     );

//     res.status(200).json({
//       message: 'Update successful',
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error('Error updating users:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// Start the server
server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise rejection:", err);
  process.exit(1); // Exit process on unhandled promise rejection
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit process on uncaught exception
});
