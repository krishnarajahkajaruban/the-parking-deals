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
    origin: ['https://www.theparkingdeals.co.uk', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://the-parking-deals.netlify.app', 'https://the-parking-deals-web.onrender.com'],
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
app.post('/webhook', async (req, res) => {
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
    try {
        console.log(session);
        const booking_id = session.metadata.booking_id;
        const stripePaymentId = session.id;

        console.log(`Booking ID: ${booking_id}`);
        console.log(`Stripe Payment ID: ${stripePaymentId}`);

        // Update booking status to failed in your database
        const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(
            booking_id,
            {
                status: 'Paid',
                stripePaymentId // Save the Stripe payment ID
            },
            { new: true }
        );

        if (!updatedBookingDetail) {
            throw new Error(`Booking detail not found for ID: ${booking_id}`);
        }

        console.log(`Updated Booking Detail: ${JSON.stringify(updatedBookingDetail)}`);

        // Check if userId is present in the updated booking detail
        if (!updatedBookingDetail.userId) {
            throw new Error(`User ID not found in booking detail for ID: ${booking_id}`);
        }

        console.log(`User ID: ${updatedBookingDetail.userId}`);

        // Retrieve user details
        const user = await User.findById(updatedBookingDetail.userId)
            .select("firstName lastname title email mobileNumber")
            .lean()
            .exec();

        if (!user) {
            throw new Error(`User not found for ID: ${updatedBookingDetail.userId}`);
        }

        console.log(`User Details: ${JSON.stringify(user)}`);

        // Send emails to user and company
        await Promise.all([
            sendEmailToUser(updatedBookingDetail, user, "Confirmed"),
            sendEmailToCompany(updatedBookingDetail, user, "Confirmed"),
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

        console.log(`Booking ID: ${booking_id}`);
        console.log(`Stripe Payment ID: ${stripePaymentId}`);

        // Update booking status to failed in your database
        const updatedBookingDetail = await BookingDetail.findByIdAndUpdate(
            booking_id,
            {
                status: 'Failed',
                stripePaymentId // Save the Stripe payment ID
            },
            { new: true }
        );

        if (!updatedBookingDetail) {
            throw new Error(`Booking detail not found for ID: ${booking_id}`);
        }

        console.log(`Updated Booking Detail: ${JSON.stringify(updatedBookingDetail)}`);

        // Check if userId is present in the updated booking detail
        if (!updatedBookingDetail.userId) {
            throw new Error(`User ID not found in booking detail for ID: ${booking_id}`);
        }

        console.log(`User ID: ${updatedBookingDetail.userId}`);

        // Retrieve user details
        const user = await User.findById(updatedBookingDetail.userId)
            .select("firstName lastname title email mobileNumber")
            .lean()
            .exec();

        if (!user) {
            throw new Error(`User not found for ID: ${updatedBookingDetail.userId}`);
        }

        console.log(`User Details: ${JSON.stringify(user)}`);

        // Send emails to user and company
        await Promise.all([
            sendEmailToUser(updatedBookingDetail, user, "Failed"),
            sendEmailToCompany(updatedBookingDetail, user, "Failed"),
        ]);

        console.log(`Emails sent successfully for paymentIntent: ${paymentIntent.id}`);

    } catch (error) {
        console.error(`Error handling payment failure: ${error.message}`);
    }
}


const sendEmailToUser = async (booking, user, type) => {
    const company = await User.findById(booking.companyId).select("email companyName serviceType").lean().exec();

    if (!company) {
        throw new Error("Company not found");
    }

    return sendEmail(
        user.email,
        `Booking ${type === "Cancelled" ? "Cancelled!" : type === "Failed" ? "Failed!" : "Confirmed!"}`,
        `
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet">
            <title>The Parking Deals</title>
        </head>

        <body>
        <style>
                * {
                    box-sizing: border-box;
                    font-family: "Poppins", sans-serif !important;
                    scroll-behavior: smooth;
                    margin: 0;
                    padding: 0;
                }

                .mt-1 {
                    margin-top: .25rem !important;
                }

                .mt-2 {
                    margin-top: .5rem !important;
                }

                .mt-3 {
                    margin-top: 1rem !important;
                }

                .mt-4 {
                    margin-top: 1.5rem !important;
                }

                .mt-5 {
                    margin-top: 3rem !important;
                }

                .mb-1 {
                    margin-bottom: .25rem !important;
                }

                .mb-2 {
                    margin-bottom: .5rem !important;
                }

                .mb-3 {
                    margin-bottom: 1rem !important;
                }

                .mb-4 {
                    margin-bottom: 1.5rem !important;
                }

                .mb-5 {
                    margin-bottom: 3rem !important;
                }

                .text-bold {
                    font-weight: 600 !important;
                }

                .text-center {
                    text-align: center;
                }

                .font-weight-normal {
                    font-weight: 400 !important;
                }

                .booking_info_area ul {
                    padding-left: 40px;
                }

                .booking_info_area ul li {
                    font-size: 14px;
                    color: #000;
                    margin-bottom: 5px;
                }

                .booking_info_area {
                    position: relative;
                    padding: 20px;
                }

                .booking_info_header {
                    width: 100%;
                    position: relative;
                    background-color: #e7e7fa;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }

                .booking_info_header img {
                    height: 60px;
                    object-fit: contain;
                }

                .booking_info_title {
                    font-size: 25px;
                    color: #000;
                    font-weight: 700;
                    margin: 20px 0 30px 0;
                }

                .booking_info_area p {
                    font-size: 14px;
                    color: #000;
                    font-weight: 400;
                }

                .booking_head {
                    font-size: 20px;
                    color: #000;
                    margin-bottom: 20px;
                }

                .booking_sub_head {
                    font-size: 16px;
                    color: #000;
                    margin-bottom: 15px;
                }

                .booking_info_area a {
                    color: #d12788;
                    text-wrap: nowrap;
                }

                .booking_footer_text {
                    font-size: 16px;
                    font-weight: 400;
                }

                .booking_accept_area {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                }

                .table-container {
                    width: 100%;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                thead th {
                    background-color: #f2f2f2;
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                tbody th {
                    background-color: #f9f9f9;
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                tbody td {
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                @media screen and (max-width: 600px) {

                    table,
                    tbody,
                    th,
                    td,
                    tr {
                        display: block;
                        width: 100%;
                    }

                    tbody th,
                    tbody td {
                        text-align: left;
                        padding-left: 15px;
                        padding-right: 15px;
                        position: relative;
                    }

                    tbody th::before,
                    tbody td::before {
                        content: attr(data-label);
                        position: absolute;
                        left: 0;
                        width: 100%;
                        padding-left: 10px;
                        font-weight: bold;
                        text-align: left;
                    }
                }
            </style>
            <div class="booking_info_area">
                <div class="booking_info_header">
                    <img src="https://www.theparkingdeals.co.uk/assets/images/logo.png" alt="The Parking Deals">
                </div>
                <h3 class="booking_info_title">Booking ${type === "Cancelled" ? "Cancelled!" : type === "Failed" ? "Failed!" : "Confirmed!"}</h3>
                <p class="mb-4">Dear ${user.firstName},</p>

                <p class="mb-3">
                    Thank you for booking with
                    <b> ${company.companyName}</b>
                    through us. You will find your booking details and
                    next steps below. You can
                    view, amend or print your booking online by visiting our Manage my booking page.
                </p>

                <h4 class="booking_head">
                    Booking ${type === "Cancelled" ? "Cancelled!" : type === "Failed" ? "Failed!" : "Confirmed!"}:&nbsp;
                    <span>${booking.bookingId}</span>
                </h4>

                <div class="table-container">
                    <table>
                        <tbody>
                            <tr>
                                <th>Booked By</th>
                                <td>${user.title} ${user.firstName} ${user.lastname}</td>
                                <th>Flying From</th>
                                <td>${booking.airportName}</td>
                            </tr>
                            <tr>
                                <th>Service</th>
                                <td>${company.companyName}</td>
                                <th>Inbound Flight</th>
                                <td>${booking.travelDetail.inBoundFlight || "-"}</td>
                            </tr>
                            <tr>
                                <th>Service Type</th>
                                <td>${company.serviceType}</td>
                                <th>Extras</th>
                                <td>Cancellation Cover: ${booking.cancellationCoverFee ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <th>From</th>
                                <td>${booking.dropOffDate} ${
                                    booking.dropOffTime}</td>
                                <th>Inbound Terminal</th>
                                <td>${booking.travelDetail.arrivalTerminal}</td>
                            </tr>
                            <tr>
                                <th>To</th>
                                <td>${booking.pickUpDate} ${booking.
                                    pickUpTime}</td>
                                <th>Outbound Terminal</th>
                                <td>${booking.travelDetail.departureTerminal}</td>
                            </tr>
                            ${booking.vehicleDetail.map(vehicle => `
                            <tr>
                                <th colspan="4" class="text-center">Vehicle Details</th>
                            </tr>
                            <tr>
                                <th>Reg No</th>
                                <td>${vehicle.regNo}</td>
                                <th>Color</th>
                                <td>${vehicle.color}</td>
                            </tr>
                            <tr>
                                <th>Make</th>
                                <td>${vehicle.make || "-"}</td>
                                <th>Model</th>
                                <td>${vehicle.model || "-"}</td>
                            </tr>`).join('')}
                            <tr>
                                <th colspan="4" class="text-center">Total Amount: £${booking.totalPayable}</th>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>

                <p class="mt-4">
                    Note:
                    The Parking Deals acts as booking agents only and do not store or handle customer vehicles. Your service
                    delivery contract will be with
                    <span>${company.companyName}.</span>
                    You must follow the instructions below and contact the service provider to
                    arrange your service. For any
                    issues regarding the parking service (delay, damage etc.) please contact your service provider.
                </p>

                <p class="mt-2">
                    <b>
                        Complaint Number: <a href="tel::07399440027">07399440027</a>
                    </b>
                </p>
                <p class="mt-2">
                    <b>
                        Complaint Email: <a href="mailto:info@theparkingdeals.co.uk">info@theparkingdeals.co.uk</a>
                    </b>
                </p>

                <h4 class="booking_head mt-5">
                    Instructions:
                </h4>

                <!-- <h5 class="booking_sub_head mt-3">
                    Telephone your friendly driver:
                    <span>07534185858 or 07534185856</span>
                </h5> -->

                <p>We require you to call us 20-30 minutes prior to your arrival so we can arrange a driver for you.</p>

                <h5 class="booking_sub_head mt-4">
                    Directions and Instructions:
                </h5>

                <p class="mb-3 text-bold">Arrival Procedure</p>
                <p>
                    Please call us 20 minutes prior arriving to the airport on
                    <span>${company.mobileNumber}</span>.
                    <br>
                    Please follow signs for Multi-Storey car park (LU2 9QT Height Restrictions 2.1m or 6ft 8in) and drive to the
                    barrier, you need to take a
                    ticket after the barrier follow the sign for Level 3 or off airport parking meet & greet drop off point pull
                    into a bay, where you will find our
                    driver waiting for you, and please give your ticket and the key to the driver. Will ask you to check your
                    vehicle and sign the paperwork for
                    handover.
                </p>

                <p class="mb-3 mt-4 text-bold">Return Procedure</p>
                <p>
                    On your safe retum, we require you to call us twice on 07534185858 or 07534185856. Once as soon as you land
                    and the other as soon
                    as you collected your luggage.
                </p>
                <p class="mt-2">
                    You will be required to pay per £5.OO (15mins) Change to validate car park Entry & Exit Fee.
                </p>

                <p class="mb-3 mt-4 text-bold">ATTENTION</p>
                <p>
                    If you return after midnight you have to pay additional day charge
                </p>

                <h5 class="booking_sub_head mt-4">
                    After 15 Minutes: Normal Airport tariffs apply.
                </h5>

                <p>
                    For any amendments or any changes while you abroad, please email
                    <a href="mailto::${company.email}">:${company.email}</a>
                </p>

                <h5 class="booking_sub_head mt-4">
                    Warning: <span class="font-weight-normal">Please note that unless your car:</span>
                </h5>

                <ul>
                    <li>Have a valid road tax and contains a valid road tax for your return date</li>
                    <li>has tyre tread on each tyre that is within the legal limit</li>
                    <li>or is in any other way unsafe to drive</li>
                </ul>

                <p class="mt-3 mb-3">
                    the driver will not be able to take your car and you will have to make other arrangements to park your car.
                    Your contract will be
                    deemed to have started and you will not be able to claim a refund.
                </p>

                <p>
                    Please also ensure that your vehicle has water in the washer bottle and that you have not run your fuel down
                    to the minimum as
                    although our car park is close to the airport we will have to drive your car off the airport itself.
                </p>

                <h4 class="booking_head mt-5">
                    Essential Information:
                </h4>

                <p class="mb-3">
                    A booking may be cancelled up to 48 hours prior to drop off date except on certain non-flexible offers and
                    same day bookings which are
                    non-refundable. All cancellations will incur a El 5 administration fee unless cancellation cover is
                    purchased at time of booking.
                </p>

                <p class="mb-3">
                    You must allow sufficient time to drop off the vehicle and complete airport departure procedures. Please
                    take in to account traffic delays,
                    breakdowns or semce delays during busy periods. If you are late or early, please inform Service Provider as
                    soon as possible. Last
                    minute changes or no advance notice may result in delays to your service.
                </p>

                <p class="mb-3">
                    Any parking is at your own risk and subject to service provider's terms and conditions, so we ask that you
                    don't keep any valuables in
                    your car. Check your vehicle carefully at pickup and report any issues to driver and ensure these are logged
                    on the paperwork before
                    leaving. Claims cannot be considered once your vehicle has left the terminal or car park. You can view our
                    full terms on our website
                </p>

                <p>
                    If you have any further queries or if you need any help with your booking, please contact us on
                    <a href="tel:tel:07399440027">tel:07399440027</a>
                </p>

                <h6 class="mt-5 booking_footer_text">
                    The Parking Deals is a trading name of Air Travel Extras Limited. The Parking Deals uses 3rd party payment
                    processing
                    companies to accept payments. Therefore, you may see their name on your bank/card statements.
                </h6>

                <h6 class="mt-3 booking_footer_text mb-4">
                    <b>
                        We use cookies to improve your experience on our site. By continuing to browse the site, you agree to
                        our use of
                        <a href="https://www.theparkingdeals.co.uk/terms-and-conditions" rel="noopener"
                            target="_blank">cookies</a>
                        &nbsp;&&nbsp;
                        <a href="https://www.theparkingdeals.co.uk/privacy-policy" rel="noopener"
                            target="_blank">privacy-policy</a>
                    </b>
                </h6>

                <hr class="mb-3 ">

                <h4 class="booking_head mb-2">
                    Contact Us
                </h4>

                <p>
                    <b>
                        <a href="mailto:info@theparkingdeals.co.uk">
                            info@theparkingdeals.co.uk
                        </a>
                    </b>
                </p>

                <p class="mt-2">
                    <b><a href="tel:07399440027">07399440027</a></b>
                </p>

                <hr class="mt-4">

                <h4 class="booking_head mt-4 mb-2 text-center">
                    We Accept
                </h4>

                <div class="booking_accept_area">
                    <!-- <img src="https://www.paypalobjects.com/digitalassets/c/website/logo/full-text/pp_fc_hl.svg" height="25"
                        alt="Pay Pal"> -->
                    <img src="https://i.ibb.co/tmGWs0x/6220ac7d912013c51947f9c6.png" height="50" alt="Stripe">
                </div>
            </div>
        </body>
              `
    );
};

const sendEmailToCompany = async (booking, user, type) => {
    const company = await User.findById(booking.companyId).select("email companyName serviceType").lean().exec();

    if (!company) {
        throw new Error("Company not found");
    }

    return sendEmail(
        company.email,
        `${type === "Cancelled" ? "Parking Slot Booking Cancelled!" : type === "Failed" ? "Parking Slot Booking Failed!" : "Parking slot has been Booked!"}`,
        `
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet">
            <title>The Parking Deals</title>
        </head>

        <body>
        <style>
                * {
                    box-sizing: border-box;
                    font-family: "Poppins", sans-serif !important;
                    scroll-behavior: smooth;
                    margin: 0;
                    padding: 0;
                }

                .mt-1 {
                    margin-top: .25rem !important;
                }

                .mt-2 {
                    margin-top: .5rem !important;
                }

                .mt-3 {
                    margin-top: 1rem !important;
                }

                .mt-4 {
                    margin-top: 1.5rem !important;
                }

                .mt-5 {
                    margin-top: 3rem !important;
                }

                .mb-1 {
                    margin-bottom: .25rem !important;
                }

                .mb-2 {
                    margin-bottom: .5rem !important;
                }

                .mb-3 {
                    margin-bottom: 1rem !important;
                }

                .mb-4 {
                    margin-bottom: 1.5rem !important;
                }

                .mb-5 {
                    margin-bottom: 3rem !important;
                }

                .text-bold {
                    font-weight: 600 !important;
                }

                .text-center {
                    text-align: center;
                }

                .font-weight-normal {
                    font-weight: 400 !important;
                }

                .booking_info_area ul {
                    padding-left: 40px;
                }

                .booking_info_area ul li {
                    font-size: 14px;
                    color: #000;
                    margin-bottom: 5px;
                }

                .booking_info_area {
                    position: relative;
                    padding: 20px;
                }

                .booking_info_header {
                    width: 100%;
                    position: relative;
                    background-color: #e7e7fa;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }

                .booking_info_header img {
                    height: 60px;
                    object-fit: contain;
                }

                .booking_info_title {
                    font-size: 25px;
                    color: #000;
                    font-weight: 700;
                    margin: 20px 0 30px 0;
                }

                .booking_info_area p {
                    font-size: 14px;
                    color: #000;
                    font-weight: 400;
                }

                .booking_head {
                    font-size: 20px;
                    color: #000;
                    margin-bottom: 20px;
                }

                .booking_sub_head {
                    font-size: 16px;
                    color: #000;
                    margin-bottom: 15px;
                }

                .booking_info_area a {
                    color: #d12788;
                    text-wrap: nowrap;
                }

                .booking_footer_text {
                    font-size: 16px;
                    font-weight: 400;
                }

                .booking_accept_area {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                }

                .table-container {
                    width: 100%;
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                thead th {
                    background-color: #f2f2f2;
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                tbody th {
                    background-color: #f9f9f9;
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                tbody td {
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                @media screen and (max-width: 600px) {

                    table,
                    tbody,
                    th,
                    td,
                    tr {
                        display: block;
                        width: 100%;
                    }

                    tbody th,
                    tbody td {
                        text-align: left;
                        padding-left: 15px;
                        padding-right: 15px;
                        position: relative;
                    }

                    tbody th::before,
                    tbody td::before {
                        content: attr(data-label);
                        position: absolute;
                        left: 0;
                        width: 100%;
                        padding-left: 10px;
                        font-weight: bold;
                        text-align: left;
                    }
                }
            </style>

            <div class="booking_info_area">
                <div class="booking_info_header">
                    <img src="https://www.theparkingdeals.co.uk/assets/images/logo.png" alt="The Parking Deals">
                </div>
                
                <h4 class="booking_head">
                    Booking ${type === "Cancelled" ? "Cancelled!" : type === "Failed" ? "Failed!" : "Confirmed!"}:&nbsp;
                    <span>${booking.bookingId}</span>
                </h4>

                <div class="table-container">
                    <table>
                        <tbody>
                            <tr>
                                <th>Booked By</th>
                                <td>${user.title} ${user.firstName} ${user.lastname}</td>
                                <th>Flying From</th>
                                <td>${booking.airportName}</td>
                            </tr>
                            <tr>
                                <th>Service</th>
                                <td>${company.companyName}</td>
                                <th>Inbound Flight</th>
                                <td>${booking.travelDetail.inBoundFlight || "-"}</td>
                            </tr>
                            <tr>
                                <th>From</th>
                                <td>${booking.dropOffDate} ${
                                    booking.dropOffTime}</td>
                                <th>Inbound Terminal</th>
                                <td>${booking.travelDetail.arrivalTerminal}</td>
                            </tr>
                            <tr>
                                <th>To</th>
                                <td>${booking.pickUpDate} ${booking.
                                    pickUpTime}</td>
                                <th>Outbound Terminal</th>
                                <td>${booking.travelDetail.departureTerminal}</td>
                            </tr>
                            <tr>
                                <th>Mobile Number</th>
                                <td>${user.mobileNumber}</td>
                                <th>Service Type</th>
                                <td>${company.serviceType}</td>
                            </tr>
                            ${booking.vehicleDetail.map(vehicle => `
                            <tr>
                                <th colspan="4" class="text-center">Vehicle Details</th>
                            </tr>
                            <tr>
                                <th>Reg No</th>
                                <td>${vehicle.regNo}</td>
                                <th>Color</th>
                                <td>${vehicle.color}</td>
                            </tr>
                            <tr>
                                <th>Make</th>
                                <td>${vehicle.make || "-"}</td>
                                <th>Model</th>
                                <td>${vehicle.model || "-"}</td>
                            </tr>`).join('')}
                            <tr>
                                <th colspan="4" class="text-center">Total Amount: £${booking.bookingQuote}</th>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>

                <h6 class="mt-5 booking_footer_text">
                    The Parking Deals is a trading name of Air Travel Extras Limited. The Parking Deals uses 3rd party payment
                    processing
                    companies to accept payments. Therefore, you may see their name on your bank/card statements.
                </h6>

                <h6 class="mt-3 booking_footer_text mb-4">
                    <b>
                        We use cookies to improve your experience on our site. By continuing to browse the site, you agree to
                        our use of
                        <a href="https://www.theparkingdeals.co.uk/terms-and-conditions" rel="noopener"
                            target="_blank">cookies</a>
                        &nbsp;&&nbsp;
                        <a href="https://www.theparkingdeals.co.uk/privacy-policy" rel="noopener"
                            target="_blank">privacy-policy</a>
                    </b>
                </h6>

                <hr class="mb-3 ">

                <h4 class="booking_head mb-2">
                    Contact Us
                </h4>

                <p>
                    <b>
                        <a href="mailto:info@theparkingdeals.co.uk">
                            info@theparkingdeals.co.uk
                        </a>
                    </b>
                </p>

                <p class="mt-2">
                    <b><a href="tel:07399440027">07399440027</a></b>
                </p>

                <hr class="mt-4">
            </div>
        </body>
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
server.listen(PORT, async () => {
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
