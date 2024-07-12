const express = require('express');
const cors = require('cors');
const connectDb = require("./config/dbConnection");
const dotenv = require('dotenv');
const morgan = require('morgan');
const http = require('http');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const rawBody = require('raw-body');
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
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials']
}));

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
  } else if (event.type === 'payment_intent.payment_failed') {
    console.log("payment intent failed")
    const paymentIntent = event.data.object;
    await handlePaymentFailure(paymentIntent);
  }

  res.json({ received: true });
});

async function handleCheckoutSession(session) {
  // Update booking status to success in your database
  const bookingId = session.metadata.bookingId;
  const stripePaymentId = session.payment_intent;

  await BookingDetail.findByIdAndUpdate(bookingId, { 
    status: 'Paid',
    stripePaymentId // Save the Stripe payment ID
  });
  console.log(`Payment successful for session: ${session.id}`);
}

async function handlePaymentFailure(paymentIntent) {
  // Update booking status to failed in your database
  const bookingId = paymentIntent.metadata.bookingId;
  const stripePaymentId = paymentIntent.id;

  await BookingDetail.findByIdAndUpdate(bookingId, { 
    status: 'Failed',
    stripePaymentId // Save the Stripe payment ID
  });
  console.log(`Payment failed for paymentIntent: ${paymentIntent.id}`);
}


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

// Create HTTP server
const server = http.createServer(app);

// Get port from environment variables or use default port 3000
const PORT = process.env.PORT || 5001;

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
