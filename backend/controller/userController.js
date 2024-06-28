const BookingDetail = require("../models/bookingDetailModel");
const { register, login } = require("./authController");
const User = require("../models/userModel");
const CouponDiscount = require("../models/couponCodeDiscountModel");
const BookingFare = require("../models/bookingFareModel");
const { generateToken, decodeToken } = require("../common/jwt");
const sendEmail = require("../common/mailService");
const AirportParkingAvailability = require("../models/airportParkingAvailability");
const bcrypt = require("bcrypt");
const EmailVerify = require("../models/emailVerify");

// Utility function to generate a 6-digit verification code
const generateVerificationCode = () => {
    const charset = '0123456789';
    let verificationCode = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      verificationCode += charset[randomIndex];
    }
    return verificationCode;
  };
  
  // Utility function to hash the verification code
  const hashingVerificationCode = async (verificationCode) => {
    return await bcrypt.hash(verificationCode, 12);
  };
  
  // Utility function to send the verification email
  const sendVerificationEmail = async (email, subject, content, verificationCode) => {
    return await sendEmail(
      email,
      subject,
      `
        <div style="padding: 20px; font-family: Calibri;">
          <div style="text-align: center;">
            <a href="webaddress"><img src="logo" alt="The Parking Deals Logo" width="80" height="80"></a>
          </div>
          <div style="margin-top: 40px; font-size: 15px;">
            <p>Dear Sir/Madam,</p>
            <p>${content}</p>
            <h1>${verificationCode}</h1>
            <p>If you have any questions, please contact our support team at <a href="mailto:supportaddress">supportaddress</a>.</p>
            <p>Thank you for choosing The Parking Deals. We look forward to serving you.</p>
          </div>
        </div>
      `
    );
  };
  
  // Function to handle email verification for new users
  const sendingVerificationCodeForEmailVerify = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(500).json({ error: "Please provide email" });
      }
  
      // Check if email is already registered
      const userAlreadyRegistered = await User.findOne({ email: email.toLowerCase() }).lean();
      if (userAlreadyRegistered) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      // Delete any existing verification code for this email
      await EmailVerify.deleteOne({ email: email.toLowerCase() });
  
      // Generate and hash verification code
      const verificationCode = generateVerificationCode();
      const hashVerificationCode = await hashingVerificationCode(verificationCode);
  
      // Create a new EmailVerify entry
      const newEmailVerify = new EmailVerify({
        email: email.toLowerCase(),
        verificationCode: hashVerificationCode,
        verifyStatus: false
      });
  
      await newEmailVerify.save();
  
      // Send the verification email
      const emailResponse = await sendVerificationEmail(
        email,
        'Email Verification Code!',
        'Please use the following code to verify your email. We\'re excited to have you on board.',
        verificationCode
      );
  
      // Return a successful response
      return res.status(201).json({
        emailSent: emailResponse.emailSent,
        mailMsg: emailResponse.message,
        message: "Verification code created successfully!",
        info: emailResponse.info || null,
        error: emailResponse.error || null
      });
  
    } catch (err) {
      // Return an error response
      return res.status(500).json({ error: err.message });
    }
  };

// Utility function to verify the provided code
const verifyCode = async (email, verificationCode, Model) => {
    const verificationRequest = await Model.findOne({ email: email.toLowerCase(), verifyStatus: false });
    if (!verificationRequest) {
      return { error: 'Please request a verification code for this email', status: 404 };
    }
  
    const isMatch = await bcrypt.compare(verificationCode, verificationRequest.verificationCode);
    if (isMatch) {
      verificationRequest.verifyStatus = true;
      await verificationRequest.save();
      return { message: 'Verification successful!', status: 200 };
    } else {
      return { error: 'Verification failed!', status: 400 };
    }
  };

// Function to verify the email verification code
const verifyingEmailVerification = async (req, res) => {
    try {
      const { verificationCode, email } = req.body;
  
      if (!email || !verificationCode) {
        return res.status(400).json({ error: "Please provide email and verification code" });
      }
  
      const result = await verifyCode(email, verificationCode, EmailVerify);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(result.status).json({ message: result.message });
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };


/* create a document for car park booking */
const carParkingBookingDetail = async (req, res) => {
    try {
        const {
            airportName,
            dropOffDate,
            dropOffTime,
            pickUpDate,
            pickUpTime,
            companyId,
            userDetail,
            travelDetail,
            vehicleDetail,
            bookingQuote,
            couponCode,
            smsConfirmation,
            cancellationCover
        } = req.body;

        const { email, title, firstName, lastName, password, mobileNumber, address, city, country, postCode, accessToken, registeredStatus } = userDetail;

        if (!airportName || !dropOffDate || !dropOffTime || !pickUpDate || !pickUpTime || !companyId || !userDetail || !travelDetail || !vehicleDetail || !bookingQuote) {
            return res.status(400).json({ error: "All fields must be provided" });
        }

        let user;
        let token;

        if (accessToken) {
            try {
                user = await decodeToken(accessToken, process.env.JWT_SECRET);

                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                if (["Admin", "Vendor"].includes(user.role)) {
                    return res.status(401).json({ error: "You are not authorized for booking as admin or vendor role" });
                }

                token = accessToken;
            } catch (error) {
                return res.status(401).json({ error: error.message || "Invalid token" });
            }
        } else if (registeredStatus) {
            const result = await login(email, password);

            if (result.status !== 200) {
                return res.status(result.status).json({ error: result.error });
            }

            if (["Admin", "Vendor"].includes(result.user.role)) {
                return res.status(401).json({ error: "You are not authorized for booking as admin or vendor role" });
            }

            user = result.user;
            token = result.token;
        } else {
            const result = await register(email, title, firstName, lastName, password, mobileNumber, address, city, country, postCode, "User");

            if (result.status !== 201) {
                return res.status(result.status).json({ error: result.error });
            }

            user = result.user;
            token = generateToken(user, process.env.JWT_SECRET);
        }

        const bookingResult = await calculatingTotalBookingCharge(bookingQuote, couponCode, smsConfirmation, cancellationCover);

        if (bookingResult.status !== 200) {
            return res.status(bookingResult.status).json({ error: bookingResult.error });
        }

        const newCarParkingBooking = new BookingDetail({
            airportName,
            dropOffDate,
            dropOffTime,
            pickUpDate,
            pickUpTime,
            companyId,
            userId: user._id || user.id,
            travelDetail,
            vehicleDetail,
            bookingQuote: bookingResult.bookingQuote,
            bookingFee: bookingResult.bookingFee,
            ...(smsConfirmation && { smsConfirmationFee: bookingResult.smsConfirmation }),
            ...(cancellationCover && { cancellationCoverFee: bookingResult.cancellationCover }),
            totalBeforeDiscount: bookingResult.totalBeforeDiscount,
            couponDiscount: bookingResult.couponDiscount,
            totalPayable: bookingResult.totalPayable,
            status: "Confirmed"
        });

        await newCarParkingBooking.save();

        const [emailResponseForUser, emailResponseForCompany] = await Promise.all([
            sendEmailToUser(newCarParkingBooking, user, "Book"),
            sendEmailToCompany(newCarParkingBooking, user, "Book")
        ]);

        return res.status(201).json({
            newCarParkBooking: newCarParkingBooking.toObject(),
            token,
            emailSentForUser: emailResponseForUser.emailSent,
            mailMsgForUser: emailResponseForUser.message,
            emailSentForCompany: emailResponseForCompany.emailSent,
            mailMsgForCompany: emailResponseForCompany.message,
            message: "Car park booking created successfully!",
            infoForUser: emailResponseForUser.info || null,
            errorForUser: emailResponseForUser.error || null,
            infoForCompany: emailResponseForCompany.info || null,
            errorForCompany: emailResponseForCompany.error || null
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const sendEmailToUser = async (booking, user, type) => {
    const company = await User.findById(booking.companyId).select("email companyName").lean().exec();

    if (!company) {
        throw new Error("Company not found");
    }

    return sendEmail(
        user.email,
        `Booking ${type === "Cancelled" ? "Cancelled!" : "Confirmed!"}`,
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
        `${type === "Cancelled" ? "Parking Slot Booking Cancelled!" : "Parking slot has been Booked!"}`,
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
                        <li>Full Name: ${user.title} ${user.firstName} ${user.lastName}</li>
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

/* calculating total booking charge */
const calculatingTotalBookingCharge = async (bookingQuote, couponCode, smsConfirmation, cancellationCover) => {
    try {
        
        // Check if bookingQuote is provided and is a number
        if (!bookingQuote || isNaN(Number(bookingQuote))) {
            return {
                error: "Booking Quote required and must be a number!",
                status: 400
            };
        }

        // Initialize coupon discount
        let couponDiscount = 0;
        if (couponCode) {
            const validityOfCouponCode = await CouponDiscount.findOne({ couponCode: couponCode.toLowerCase() }).lean();

            if (!validityOfCouponCode) {
                return {
                    error: "Coupon code is not valid",
                    status: 400
                };
            }
            couponDiscount = validityOfCouponCode.discount;
        }

        // Fetch the latest booking fare
        const latestBookingFare = await BookingFare.findOne().lean();
        if (!latestBookingFare) {
            return {
                error: "Booking fare information not available",
                status: 500
            };
        }

        const { bookingFee, smsConfirmationFee, cancellationCoverFee } = latestBookingFare;

        // Calculate additional charges
        const smsConfirmationCharge = smsConfirmation ? smsConfirmationFee : 0;
        const cancellationCoverCharge = cancellationCover ? cancellationCoverFee : 0;

        // Calculate total amounts
        const totalBeforeDiscount = Number(bookingQuote) + bookingFee + smsConfirmationCharge + cancellationCoverCharge;
        const discountAmount = totalBeforeDiscount * (couponDiscount / 100);
        const totalPayable = totalBeforeDiscount - discountAmount;

        // Respond with calculated values
        return {
            bookingQuote: Number(bookingQuote),
            bookingFee,
            smsConfirmation: smsConfirmationCharge,
            cancellationCover: cancellationCoverCharge,
            totalBeforeDiscount,
            couponDiscount,
            discountAmount,
            totalPayable,
            status: 200
        };
        
    } catch (err) {
        return {
            error: err.message,
            status: 500
          };
    }
};

/* cancelled the booking */
const cancelTheBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        const cancelledBooking = await BookingDetail.findOneAndUpdate(
            { 
                _id: bookingId,  
                cancellationCoverFee: { $exists: true, $ne: null }
            },
            {
                $set: {
                    status: "Cancelled"
                }
            }, 
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({
                error: "Unable to cancel the booking. Either you are not subscribed to cancellation cover, or the booking was not found!"
            });
        }

        const user = await User.findById(cancelledBooking.userId).select("email firstName title lastName mobileNumber").lean().exec();

        const [emailResponseForUser, emailResponseForCompany] = await Promise.all([
            sendEmailToUser(cancelledBooking, user, "Cancelled"),
            sendEmailToCompany(cancelledBooking, user, "Cancelled")
        ]);

        return res.status(200).json({
            cancelledBooking: cancelledBooking.toObject(),
            emailSentForUser: emailResponseForUser.emailSent,
            mailMsgForUser: emailResponseForUser.message,
            emailSentForCompany: emailResponseForCompany.emailSent,
            mailMsgForCompany: emailResponseForCompany.message,
            message: "Booking cancelled successfully!",
            infoForUser: emailResponseForUser.info || null,
            errorForUser: emailResponseForUser.error || null,
            infoForCompany: emailResponseForCompany.info || null,
            errorForCompany: emailResponseForCompany.error || null
        });
        
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

/* find all vendors available for the searching creteria */
const findAllVendorDetailForUserSearchedParkingSlot = async (req, res) => {
    try {
        const { airport, fromDate, fromTime, toDate, toTime } = req.query;

        if (!airport || !fromDate || !fromTime || !toDate || !toTime) {
            return res.status(400).json({
                error: "Please provide searching details!"
            });
        }

        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        // Query the AirportParkingAvailability collection
        const parkingSlots = await AirportParkingAvailability.find({
            airport,
            "companyParkingSlot": {
                $elemMatch: {
                    fromDate: { $lte: toDateObj },
                    toDate: { $gte: fromDateObj },
                    fromTime: { $lte: toTime },
                    toTime: { $gte: fromTime }
                }
            }
        });

        if (parkingSlots.length === 0) {
            return res.status(404).json({
                message: "No vendors found matching the criteria."
            });
        }

        const companyIds = parkingSlots.flatMap(slot =>
            slot.companyParkingSlot
                .filter(subSlot =>
                    subSlot.fromDate <= toDateObj &&
                    subSlot.toDate >= fromDateObj &&
                    subSlot.fromTime <= toTime &&
                    subSlot.toTime >= fromTime
                )
                .map(subSlot => subSlot.companyId)
        );

        const uniqueCompanyIds = [...new Set(companyIds)];

        // Query the User collection for the vendor details
        const vendorDetails = await User.find({ _id: { $in: uniqueCompanyIds } });

        return res.status(200).json(vendorDetails);

    } catch (err) {
        return res.status(500).json({
            error: `Server Error: ${err.message}`
        });
    }
};

/* find out all the available airports */
const getAllAirports = async (req, res) => {
    try {
        
        const allAirports = await AirportParkingAvailability.find()
            .select("airport")
            .lean()
            .exec();

        if (allAirports.length === 0) {
            return res.status(200).json([]);
        }

        const nameOfAirports = allAirports.map(airport => ({
           name: airport.airport
        }));

        return res.status(200).json(nameOfAirports);

    } catch (err) {
        // Return 500 if an error occurs
        return res.status(500).json({ error: err.message });
    }
};


module.exports = {
    sendingVerificationCodeForEmailVerify,
    verifyingEmailVerification,
    carParkingBookingDetail,
    calculatingTotalBookingCharge,
    cancelTheBooking,
    findAllVendorDetailForUserSearchedParkingSlot,
    getAllAirports
};