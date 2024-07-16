const express = require('express');
const cors = require('cors');
const connectDb = require("./config/dbConnection");
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
// const { Server } = require('socket.io');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const rawBody = require('raw-body');
const BookingDetail = require('./models/bookingDetailModel'); 
const User = require("./models/userModel");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const commonRoleRouter = require("./routes/commonRoleRouter");
const sendEmail = require('./common/mailService');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Get port from environment variables or use default port 3000
const PORT = process.env.PORT || 5001;

// Middleware setup
app.use(cors({ // CORS setup
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://the-parking-deals.netlify.app', 'https://the-parking-deals-web.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials']
}));

// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://the-parking-deals.netlify.app', 'https://the-parking-deals-web.onrender.com'],
//     methods: ["GET", "POST"],
//   },
// });

app.use(morgan("tiny")); // Logging

// Middleware to handle raw body for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    rawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      type: 'application/json',
    }, (err, string) => {
      if (err) return next(err);
      req.rawBody = string;
      next();
    });
  } else {
    express.json()(req, res, next);
  }
});

// io.on('connection', (socket) => {
//   console.log('Client connected to Socket.io');
// });

// Webhook endpoint to handle Stripe events
app.post('/webhook', async(req, res) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log("checkout session completed")
    const session = event.data.object;
    await handleCheckoutSession(session);
    // io.emit('checkout.session.completed', session);
  } else if (event.type === 'payment_intent.payment_failed') {
    console.log("payment intent failed")
    const paymentIntent = event.data.object;
    await handlePaymentFailure(paymentIntent);
    // io.emit('payment_intent.payment_failed', paymentIntent); 
  }

  res.json({ received: true });
});

async function handleCheckoutSession(session) {
  // Update booking status to success in your database
  const bookingId = session.metadata.bookingId;
  const stripePaymentId = session.payment_intent;

  const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(bookingId, {
    status: "Paid",
    stripePaymentId, // Save the Stripe payment ID
  });
  console.log(`Payment successful for session: ${session.id}`);

  const user = await User.findById(updatedBookingDetail.userId).select("email firstName mobileNumber lastname title").lean().exec(); 

  await Promise.all([
    sendEmailToUser(updatedBookingDetail, user, "Book"),
    sendEmailToCompany(updatedBookingDetail, user, "Book"),
  ]);
}

async function handlePaymentFailure(paymentIntent) {
  // Update booking status to failed in your database
  const bookingId = paymentIntent.metadata.bookingId;
  const stripePaymentId = paymentIntent.id;

  const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(bookingId, { 
    status: 'Failed',
    stripePaymentId // Save the Stripe payment ID
  });
  console.log(`Payment failed for paymentIntent: ${paymentIntent.id}`);

  const user = await User.findById(updatedBookingDetail.userId).select("email firstName mobileNumber lastname title").lean().exec(); 

  await Promise.all([
    sendEmailToUser(updatedBookingDetail, user, "Failed"),
    sendEmailToCompany(updatedBookingDetail, user, "Failed"),
  ]);
}

const sendEmailToUser = async (booking, user, type) => {
  const company = await User.findById(booking.companyId).select("email companyName").lean().exec();

  if (!company) {
      throw new Error("Company not found");
  }

  return sendEmail(
      user.email,
      `Booking ${type === "Cancelled" ? "Cancelled!" : "Failed" ? "Failed!" : "Confirmed!"}`,
      `
          <div style="padding: 20px; font-family: Calibri;">
              <div style="text-align: center;">
                  <a href="webaddress"><img src="logo" alt="Shopname Logo" width="80" height="80"></a>
              </div>
              <div style="margin-top: 40px; font-size: 15px;">
                  <p>Dear ${user.firstName},</p>
                  <p>Your Booking has been ${type === "Cancelled" ? "Cancelled!" : "Confirmed!"} (Booking ID: #${booking._id}) We're excited to have you on board.</p>
                  <p>Company Details:</p>
                  <li>Company Name: ${company.companyName}</li>
                  <li>Email: ${company.email}</li>
                  <br>
                  <p>Travel Details:</p>
                  <li>Departure Terminal: ${booking.travelDetail.departureTerminal}</li>
                  <li>Arrival Terminal: ${booking.travelDetail.arrivalTerminal}</li>
                  <br>
                  <p>Vehicle Details:</p>
                  ${booking.vehicleDetail.map(vehicle => `
                      <ul>
                          <li>Reg No: ${vehicle.regNo}</li>
                          <li>Color: ${vehicle.color}</li>
                      </ul>
                  `).join('')}
                  <p>If you have any questions, please contact our support team at <a href="mailto:supportaddress">supportaddress</a>.</p>
                  <p>Thank you for choosing Air Wing Parking Hub. We look forward to serving you.</p>
              </div>
          </div>
      `
  );
};

const sendEmailToCompany = async (booking, user, type) => {
  const company = await User.findById(booking.companyId).select("email companyName").lean().exec();

  if (!company) {
      throw new Error("Company not found");
  }

  return sendEmail(
      company.email,
      `${type === "Cancelled" ? "Parking Slot Booking Cancelled!" : "Failed" ? "Parking Slot Booking Failed!" : "Parking slot has been Booked!"}`,
      `
          <div style="padding: 20px; font-family: Calibri;">
              <div style="text-align: center;">
                  <a href="webaddress"><img src="logo" alt="Shopname Logo" width="80" height="80"></a>
              </div>
              <div style="margin-top: 40px; font-size: 15px;">
                  <p>Dear ${company.companyName},</p>
                  <p>Your Parking slot for the airport of ${booking.airportName} from the date & time of ${booking.dropOffDate} at ${booking.dropOffTime} to the date & time of ${booking.pickUpDate} at ${booking.pickUpTime} ${type === "Cancelled" ? "booking Cancelled!" : "has been booked"} (Booking ID: #${booking._id}) by
                  <br>
                      <p>Customer Details:</p>
                      <li>Full Name: ${user.title} ${user.firstName} ${user.lastname}</li>
                      <li>Email: ${user.email}</li>
                      <li>Mobile No: ${user.mobileNumber}</li>
                  </br>
                  <br>
                      <p>Travel Details:</p>
                      <li>Departure Terminal: ${booking.travelDetail.departureTerminal}</li>
                      <li>Arrival Terminal: ${booking.travelDetail.arrivalTerminal}</li>
                  </br>
                  <br>
                      <p>Vehicle Details:</p>
                      ${booking.vehicleDetail.map(vehicle => `
                          <ul>
                              <li>Reg No: ${vehicle.regNo}</li>
                              <li>Color: ${vehicle.color}</li>
                          </ul>
                      `).join('')}
                  ! We're excited to have you on board.</p>
                  <p>If you have any questions, please contact our support team at <a href="mailto:supportaddress">supportaddress</a>.</p>
                  <p>Thank you for choosing Air Wing Parking Hub. We look forward to serving you.</p>
              </div>
          </div>
      `
  );
};


// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/common-role", commonRoleRouter);

// Error handling middleware for Multer errors
app.use((err, req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  if (err instanceof Multer.MulterError) {
    res.status(400).json({ error: err.message });
  } else if (err) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});


// Start the server
server.listen(PORT, async() => {
  await connectDb();
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise rejection:', err);
  process.exit(1); // Exit process on unhandled promise rejection
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit process on uncaught exception
});
