// Import required libraries
const express = require('express');
const cors = require('cors');
const connectDb = require("./config/dbConnection");
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const BookingDetail = require('./models/bookingDetailModel'); 

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const commonRoleRouter = require("./routes/commonRoleRouter");

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware setup
app.use(cors({ // CORS setup
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://the-parking-deals.netlify.app', 'https://the-parking-deals-web.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials']
}));

app.use(morgan("tiny")); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL encoded data parsing

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/common-role", commonRoleRouter);

// Create HTTP server
const server = http.createServer(app);

// Get port from environment variables or use default port 3000
const PORT = process.env.PORT || 5001;

// Webhook endpoint to handle Stripe events
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await handleCheckoutSession(session);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await handlePaymentFailure(paymentIntent);
  }

  response.json({ received: true });
});

async function handleCheckoutSession(session) {
  // Update booking status to success in your database
  const bookingId = session.metadata.bookingId;
  await BookingDetail.findByIdAndUpdate(bookingId, { status: 'Paid' });
  console.log(`Payment successful for session: ${session.id}`);
}

async function handlePaymentFailure(paymentIntent) {
  // Update booking status to failed in your database
  const bookingId = paymentIntent.metadata.bookingId;
  await BookingDetail.findByIdAndUpdate(bookingId, { status: 'Failed' });
  console.log(`Payment failed for paymentIntent: ${paymentIntent.id}`);
}


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
