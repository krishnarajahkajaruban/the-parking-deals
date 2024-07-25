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
const ForgotUserEmail = require("../models/forgotUserEmail");
const { handleUpload, deleteOldImage } = require("../utils/cloudinaryUtils");
const ContactForm = require("../models/contact");
const SubscribedEmail = require("../models/subcribedEmail");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
            <a href="www.theparkingdeals.co.uk"><img src="https://res.cloudinary.com/piragashcloud/image/upload/v1721238830/logo512_dmvwkk.png" alt="The Parking Deals Logo" width="80" height="80"></a>
          </div>
          <div style="margin-top: 40px; font-size: 15px;">
            <p>Dear Sir/Madam,</p>
            <p>${content}</p>
            <h1>${verificationCode}</h1>
            <p>If you have any questions, please contact our support team at <a href="mailto:info@theparkingdeals.co.uk">info@theparkingdeals.co.uk</a>.</p>
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

// Function to handle password reset for existing users
const sendVerificationCodeForPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(500).json({ error: "Please provide email" });
      }
  
      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() }).lean();
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Delete any existing password reset code for this email
      await ForgotUserEmail.deleteOne({ email: email.toLowerCase() });
  
      // Generate and hash verification code
      const verificationCode = generateVerificationCode();
      const hashVerificationCode = await hashingVerificationCode(verificationCode);
  
      // Create a new ForgotUserEmail entry
      const newForgotUserEmail = new ForgotUserEmail({
        email: email.toLowerCase(),
        verificationCode: hashVerificationCode,
        verifyStatus: false
      });
  
      await newForgotUserEmail.save();
  
      // Send the verification email
      const emailResponse = await sendVerificationEmail(
        email,
        'Password Reset Verification Code!',
        'Please use the following code to reset your password. If you did not request this, please ignore this email.',
        verificationCode
      );
  
      // Return a successful response
      return res.status(201).json({
        emailSent: emailResponse.emailSent,
        mailMsg: emailResponse.message,
        message: "Verification code sent successfully!",
        info: emailResponse.info || null,
        error: emailResponse.error || null
      });
  
    } catch (err) {
      // Return an error response
      return res.status(500).json({ error: err.message });
    }
  };

// Function to verify the password reset code
const verifyingPasswordReset = async (req, res) => {
    try {
      const { verificationCode, email } = req.body;
  
      if (!email || !verificationCode) {
        return res.status(400).json({ error: "Please provide email and verification code" });
      }
  
      const result = await verifyCode(email, verificationCode, ForgotUserEmail);
      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(result.status).json({ message: result.message });
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

//function for reset the password with new password
const resettingPassword = async (req, res) => {
    try {
      const { newPassword, email } = req.body;
  
      if (!newPassword || !email) {
        return res.status(400).json({ error: "Please provide email and new password" });
      }
  
      // Ensure the email is verified
      const isVerified = await ForgotUserEmail.findOne({ email: email.toLowerCase(), verifyStatus: true });
  
      if (!isVerified) {
        return res.status(400).json({ error: "Please verify with your code sent to the mail first, or request a new one" });
      }
  
      // Hash the new password
      const hashPassword = await bcrypt.hash(newPassword, 12);
  
      // Update the user's password
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: { password: hashPassword } }
      );
  
      // Remove the verification record
      await ForgotUserEmail.deleteOne({ email: email.toLowerCase() });
  
      return res.status(200).json({ message: 'Password reset successfully!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  async function generateBookingId() {
    const latestBooking = await BookingDetail.findOne().sort({ createdAt: -1 }).select("bookingId").exec();
    if (latestBooking && latestBooking.bookingId) {
      const lastIdNumber = parseInt(latestBooking.bookingId.split("-")[1]);
      const newIdNumber = lastIdNumber + 1;
      return `TPD-${newIdNumber.toString().padStart(6, "0")}`;
    } else {
      return "TPD-000100";
    }
  }

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
            // cardDetail,
            bookingQuote,
            couponCode,
            smsConfirmation,
            cancellationCover
        } = req.body;

        const { email, title, firstName, lastName, password, mobileNumber, accessToken, registeredStatus } = userDetail;

        if (!airportName || !dropOffDate || !dropOffTime || !pickUpDate || !pickUpTime || !companyId || !userDetail || !travelDetail || !vehicleDetail 
          // || !cardDetail 
          || !bookingQuote) {
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
            const result = await register(email, title, firstName, lastName, null, password, mobileNumber, "User");

            if (result.status !== 201) {
                return res.status(result.status).json({ error: result.error });
            }

            user = result.user;
            token = generateToken(user, process.env.JWT_SECRET);
        }

        const fromDateObj = new Date(dropOffDate);
        const toDateObj = new Date(pickUpDate);
        const now = new Date();

        // Function to get the date part only in ISO format
        const getDatePart = (date) => date.toISOString().split('T')[0];

        const fromDatePart = getDatePart(fromDateObj);
        const toDatePart = getDatePart(toDateObj);
        const nowDatePart = getDatePart(now);

        console.log('From Date:', fromDatePart);
        console.log('Now:', nowDatePart);

        // Check if dropOffDate is today or in the future
        if (fromDatePart < nowDatePart) {
          return res.status(400).json({ error: "dropOffDate must be today or in the future." });
        }

        // Check if dropOffDate is less than pickUpDate
        if (fromDatePart > toDatePart) {
          return res.status(400).json({ error: "dropOffDate must be less than pickUpDate." });
        }

        const bookingResult = await calculatingTotalBookingCharge(bookingQuote, couponCode, smsConfirmation, cancellationCover);

        if (bookingResult.status !== 200) {
            return res.status(bookingResult.status).json({ error: bookingResult.error });
        }

        // console.log(user);

        const bookingId = await generateBookingId();

        const newCarParkingBooking = new BookingDetail({
            bookingId,
            airportName,
            dropOffDate,
            dropOffTime,
            pickUpDate,
            pickUpTime,
            companyId,
            userId: user._id || user.id,
            travelDetail,
            vehicleDetail,
            // cardDetail,
            bookingQuote: bookingResult.bookingQuote,
            bookingFee: bookingResult.bookingFee,
            ...(smsConfirmation && { smsConfirmationFee: bookingResult.smsConfirmation }),
            ...(cancellationCover && { cancellationCoverFee: bookingResult.cancellationCover }),
            totalBeforeDiscount: bookingResult.totalBeforeDiscount,
            couponDiscount: bookingResult.couponDiscount,
            totalPayable: bookingResult.totalPayable,
            status: "Pending"
        });

        await newCarParkingBooking.save();

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "gbp",
                product_data: {
                  name: "Car Parking Booking",
                  images: ["https://www.theparkingdeals.co.uk/assets/images/logo.png"]
                },
                unit_amount: bookingResult.totalPayable * 100
              },
              quantity: 1
            }
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_URL}/dashboard`,
          cancel_url: `${process.env.FRONTEND_URL}/booking`,
          metadata: {
            booking_id: newCarParkingBooking._id.toString()
          }
        });

        return res.status(201).json({
            id: session.id,
            newCarParkBooking: newCarParkingBooking.toObject(),
            user: user,
            token,
            message: "Car park booking created successfully!"
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
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
      };
        
        // Initialize coupon discount
        let couponDiscount = 0;
        if (couponCode) {
            const validityOfCouponCode = await CouponDiscount.findOne({ couponCode: couponCode.toLowerCase() }).lean();

            if (validityOfCouponCode) { 
              couponDiscount = validityOfCouponCode.discount;
            };
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
        const totalBeforeDiscount = Math.floor((Number(bookingQuote) + bookingFee + smsConfirmationCharge + cancellationCoverCharge)*100)/100;
        const discountAmount = totalBeforeDiscount * (couponDiscount / 100);
        const totalPayable = Math.floor((totalBeforeDiscount - discountAmount)*100)/100;

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

const checkingCouponCodeValidity = async(req, res) => {
  try{
    const { couponCode } = req.body;

    if(!couponCode) {
        return res.status(400).json({ error: "No Coupon code provided"})
    };

    const validityOfCouponCode = await CouponDiscount.findOne({ couponCode: couponCode.toLowerCase() }).lean();

      if (!validityOfCouponCode) {
          return  res.status(400).json({ error: "Coupon code is not valid" });
      };

      res.status(200).json({message: "Coupon code is valid"});
  }catch(err){
      return res.status(500).json({
        error: err.message
    });
  };
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

        const user = await User.findById(cancelledBooking.userId).select("email firstName title lastname mobileNumber").lean().exec();

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
    console.log(req.query);
      const { airport, fromDate, fromTime, toDate, toTime } = req.query;

      if (!airport || !fromDate || !fromTime || !toDate || !toTime) {
          return res.status(400).json({
              error: "Please provide searching details!"
          });
      }

      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      const now = new Date();

      // Function to get the date part only in ISO format
      const getDatePart = (date) => date.toISOString().split('T')[0];

      const fromDatePart = getDatePart(fromDateObj);
      const toDatePart = getDatePart(toDateObj);
      const nowDatePart = getDatePart(now);

      console.log('From Date:', fromDatePart);
      console.log('Now:', nowDatePart);

      // Check if dropOffDate is today or in the future
      if (fromDatePart < nowDatePart) {
        return res.status(400).json({ error: "dropOffDate must be today or in the future." });
      }

      // Check if dropOffDate is less than pickUpDate
      if (fromDatePart >= toDatePart) {
        return res.status(400).json({ error: "dropOffDate must be less than pickUpDate." });
      }

      // Using aggregation to get the user details
      const result = await AirportParkingAvailability.aggregate([
          {
              $match: {
                  airport
              }
          },
          {
              $unwind: "$companyParkingSlot"
          },
          {
              $match: {
                  "companyParkingSlot.fromDate": { $lte: toDateObj },
                  "companyParkingSlot.toDate": { $gte: fromDateObj },
                  "companyParkingSlot.fromTime": { $lte: toTime },
                  "companyParkingSlot.toTime": { $gte: fromTime }
              }
          },
          {
              $lookup: {
                  from: "users",
                  localField: "companyParkingSlot.companyId",
                  foreignField: "_id",
                  as: "vendorDetails"
              }
          },
          {
              $unwind: "$vendorDetails"
          },
          {
              $group: {
                  _id: "$vendorDetails._id",
                  vendorDetails: { $first: "$vendorDetails" }
              }
          },
          {
              $replaceRoot: { newRoot: "$vendorDetails" }
          }
      ]);

      if (result.length === 0) {
          return res.status(200).json([]);
      };

      return res.status(200).json(result);

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

/* update user info */
const updateUserInfo = async (req, res) => {
  try {
      const {
          email, title, firstName, lastName,
          mobileNumber,
      } = req.body;

      const { id } = req.user;

      // const parsedEmail = email && JSON.parse(email);
      // const parsedTitle = title && JSON.parse(title);
      // const parsedFirstName = firstName && JSON.parse(firstName);
      // const parsedLastName = lastName && JSON.parse(lastName);
      // const parsedMobileNumber = mobileNumber && JSON.parse(mobileNumber);
      // const parsedAddressL1 = addressL1 && JSON.parse(addressL1);
      // const parsedAddressL2 = addressL2 && JSON.parse(addressL2);
      // const parsedCity = city && JSON.parse(city);
      // const parsedCountry = country && JSON.parse(country);
      // const parsedPostCode = postCode && JSON.parse(postCode);

      const parsedEmail = email 
      const parsedTitle = title 
      const parsedFirstName = firstName 
      const parsedLastName = lastName 
      const parsedMobileNumber = mobileNumber 
      // const parsedAddressL1 = addressL1 
      // const parsedAddressL2 = addressL2 
      // const parsedCity = city 
      // const parsedCountry = country 
      // const parsedPostCode = postCode 

      const userDetailTobeUpdated = await User.findById(id);

      if(!userDetailTobeUpdated){
        res.status(404).json({ error:"User not found" });
      };

      if(parsedEmail){
        const isEmailVerified = await EmailVerify.findOne({ email: email.toLowerCase(), verifyStatus: true});

        if(!isEmailVerified){
          return res.status(400).json({ error: "Please verify your email first!"});
        };
      };

      let dp = userDetailTobeUpdated.dp;
      let oldDp;

      if (req.file) {

        if (dp) {
          const urlParts = dp.split('/');
          const fileName = urlParts[urlParts.length - 1];
          oldDp = fileName.split('.')[0];
        }

          const b64 = Buffer.from(req.file.buffer).toString('base64');
          const dataURI = `data:${req.file.mimetype};base64,${b64}`;
          const cldRes = await handleUpload(dataURI);
          dp = cldRes.secure_url;

          if(oldDp){
            await deleteOldImage(oldDp);
          };

      }

      const updateFields = {
          email: parsedEmail || userDetailTobeUpdated.email,
          title: parsedTitle || userDetailTobeUpdated.title, 
          firstName: parsedFirstName || userDetailTobeUpdated.firstName, 
          lastName: parsedLastName || userDetailTobeUpdated.lastname,
          mobileNumber: parsedMobileNumber || userDetailTobeUpdated.mobileNumber, 
          // addressL1: parsedAddressL1 || userDetailTobeUpdated.addressL1,
          // addressL2: parsedAddressL2 || userDetailTobeUpdated.addressL2, 
          // city: parsedCity || userDetailTobeUpdated.city, 
          // country: parsedCountry || userDetailTobeUpdated.country, 
          // postCode: parsedPostCode || userDetailTobeUpdated.postCode
      };

      // Only set 'dp' field if a new file was uploaded
      if (dp) {
          updateFields.dp = dp;
      }

      console.log(updateFields);

      const updatedUserInfo = await User.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
      );

      if (!updatedUserInfo) {
          return res.status(404).json({ error: 'Error in updating!' });
      }

      const token = generateToken(updatedUserInfo, process.env.JWT_SECRET);

      res.status(200).json({
          message: 'User info updated successfully!',
          user:updatedUserInfo.toObject(),
          token
      });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const getUserInfoWithUpdatedToken = async(req, res) => {
  try{
    const { id } = req.user;
    const user = await User.findById(id).lean().exec();
    if(!user){
      return res.status(404).json({ error: "User not found" });
    };
    const token = generateToken(user, process.env.JWT_SECRET);
    res.status(200).json({ user, token });
  }catch (err) {
    res.status(500).json({ error: err.message });
  };
};

/* change the user password */
const updatingUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    if(! currentPassword || ! newPassword) {
      return res.status(400).json({ error: 'Please provide current password and new password' });
    };

    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(id, { password: hashPassword });

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/* create a contact form  */
const createContactOrFaqForm = async (req, res) => {
  try {
      const { name, email, mobileNumber, subject, message, type } = req.body;

      if ( !name || !email || !mobileNumber || !subject || !message || !type ) {
          return res.status(400).json({ error: "All fields are required." });
      }

      let form;
      if(type ==="contact"){
        form = new ContactForm({
            name,
            email,
            mobileNumber,
            subject,
            message
        });
  
        await form.save();
      }
      // else if (type === "faq"){
      //   form = new Faq({
      //     fullName,
      //     email,
      //     subject,
      //     message
      // });

      // await form.save();
      // }
      else {
        return res.status(400).json({ error: "Invalid type" });
      };

      res.status(201).json({
          message: `${type === "contact" ? "Contact" : type === "faq" ? "FAQ" : ""} Form submitted successfully!`,
          form: form.toObject()
      });
  }catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
  }
};

/* creating a subscribed user */
const creatingSubscribedUser = async (req, res) => {
  try{
    const { email } = req.body;

    if(!email){
      return res.status(400).json({ error: "Email is required!" });
    };

    const alreadySubscribed= await SubscribedEmail.findOne({ email: email.toLowerCase() });

    if(alreadySubscribed){
      return res.status(400).json({ error: "You already subscribed!" });
    };

    const newSubcribedEmail = new SubscribedEmail(
      {
        email: email.toLowerCase()
      }
    );
    await newSubcribedEmail.save();

    res.status(201).json({ message: "Subscribed successfully!" });
    
  }catch (err) {
    res.status(500).json({ error: err.message });
  };
};

module.exports = {
    sendingVerificationCodeForEmailVerify,
    verifyingEmailVerification,
    sendVerificationCodeForPasswordReset,
    verifyingPasswordReset,
    resettingPassword,
    carParkingBookingDetail,
    calculatingTotalBookingCharge,
    checkingCouponCodeValidity,
    cancelTheBooking,
    findAllVendorDetailForUserSearchedParkingSlot,
    getAllAirports,
    updateUserInfo,
    getUserInfoWithUpdatedToken,
    updatingUserPassword,
    createContactOrFaqForm,
    creatingSubscribedUser
};