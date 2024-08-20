const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../common/jwt");
const sendEmail = require("../common/mailService");
const EmailVerify = require("../models/emailVerify");

/* checking user already registered using email */
const checkUserAlreadyRegistered = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }
  
      const trimmedEmail = email.trim();
      
      // Regular expression to check for valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
  
      const emailExists = await User.findOne({
        email: { $regex: new RegExp('^' + trimmedEmail + '$', 'i') }
      }).lean();
  
      if (emailExists) {
        return res.status(200).json({ emailExists: true });
      } else {
        return res.status(200).json({ emailExists: false });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  

/* register */
const register = async (email, title, firstName, lastName, companyName, password, mobileNumber, role, serviceType, dp, rating, overView, quote, finalQuote, cancellationCover, facilities, dropOffProcedure, pickUpProcedure) => {

  console.log(email, title, firstName, lastName, companyName, password, mobileNumber, role, serviceType, dp, rating, overView, quote, finalQuote, cancellationCover, facilities, dropOffProcedure, pickUpProcedure);
  
  try{
    // Check for required fields
    if (!email || 
      (role === "User" && !title) || 
      (["Admin", "User", "Moderator", "Admin-User"].includes(role) && !firstName) || 
      (role === 'Vendor' && !companyName) || 
      !password || 
      (["Vendor", "User"].includes(role) && !mobileNumber) || 
      // (role === "User" && !addressL1) ||
      // (role === "User" && !city) ||
      // (role === "User" && !country) ||
      // (role === "User" && !postCode) ||
      !role || (role === 'Vendor' && !serviceType) || (role === 'Vendor' && !dp) || (role === 'Vendor' && !rating) || (role === 'Vendor' && !overView) || (role === 'Vendor' && !dp) || (role === 'Vendor' && !finalQuote) || (role === 'Vendor' && !quote) || (role === 'Vendor' && !cancellationCover) || (role === 'Vendor' && !facilities) || (role === 'Vendor' && !dropOffProcedure) || (role === 'Vendor' && !pickUpProcedure)) {
      return {
          error: "Please fill all required fields!",
          status: 400
      };
  };

  if(role === "User"){
    const isEmailVerified = await EmailVerify.findOne({ email: email.toLowerCase(), verifyStatus: true});

    if(!isEmailVerified){
      return {
        error: "Please verify your email first!",
        status: 400
      };
    };
  };

    // Validate email and phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9,}$/;

    if (!emailRegex.test(email.trim())) {
        return {
            error: "Invalid email format!",
            status: 400
        };
    } 

    if (["Vendor", "User"].includes(role) && !phoneRegex.test(mobileNumber)) {
        return {
            error: "Invalid phone number format!",
            status: 400
        };
    }

    if (password.length < 8) {
      return {
          error: "Password must be atleast 8 characters long!",
          status: 400
      };
  }

    // Check if user is already registered
    const userAlreadyRegistered = await User.findOne({ email: email.toLowerCase() }).lean();
    if (userAlreadyRegistered) {
        return {
            error: "User already registered with this email!",
            status: 400
        };
    }

    if (role === "Vendor" && JSON.parse(quote) < JSON.parse(finalQuote)) {
      return {
          error: "Discount Quote must be less then actual quote!",
          status: 400
      };
  }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
        email: email.toLowerCase(),
        ...(role === "User" && { title }),
        ...(["Admin", "User", "Moderator", "Admin-User"].includes(role) && { firstName }),
        ...(["Admin", "User", "Moderator", "Admin-User"].includes(role) && { lastname: lastName || "" }),
        ...(role === "Vendor" && { companyName }),
        mobileNumber,
        // ...(role === "User" && { addressL1 }),
        // ...(role === "User" && { addressL2: addressL2 || "" }),
        role,
        // ...(role === "User" && { city }),
        // ...(role === "User" && { country }),
        // ...(role === "User" && { postCode }),
        password: hashedPassword,
        ...(["Vendor", "User"].includes(role) && { dp: role === "User" ? "" : dp}),
        ...(role === "Vendor" && { serviceType }),
        ...(role === "Vendor" && { rating: parseInt(JSON.parse(rating)) }),
        ...(role === "Vendor" && { overView }),
        ...(role === "Vendor" && { cancellationCover: JSON.parse(cancellationCover) }),
        ...(role === "Vendor" && { quote: parseInt(JSON.parse(finalQuote)) === parseInt(JSON.parse(quote)) ? 0 : parseInt(JSON.parse(quote)) }),
        ...(role === "Vendor" && { finalQuote: parseInt(JSON.parse(finalQuote)) }),
        ...(role === "Vendor" && { facilities: JSON.parse(facilities) }),
        ...(role === "Vendor" && { dropOffProcedure }),
        ...(role === "Vendor" && { pickUpProcedure })
    });

    // Save the user to the database
    await user.save();
    const userObject = user.toObject({ getters: true });
    delete userObject.password;

    if(role === "User"){
      const emailResponse = await sendEmail(
        user.email,
        'Welcome to The Parking Deals!',
        `
            <div style="padding: 20px; font-family: Calibri;">
                <div style="text-align: center;">
                    <a href="www.theparkingdeals.co.uk"><img src="https://res.cloudinary.com/piragashcloud/image/upload/v1721238830/logo512_dmvwkk.png" alt="The Parking Deals Logo" width="80" height="80"></a>
                </div>
                <div style="margin-top: 40px; font-size: 15px;">
                    <p>Dear ${user.firstName || user.companyName},</p>
                    <p>Thank you for registering in The Parking Deals! We're excited to have you on board.</p>
                    <p>If you have any questions, please contact our support team at <a href="mailto:info@theparkingdeals.co.uk">info@theparkingdeals.co.uk</a>.</p>
                    <p>Thank you for choosing The Parking Deals. We look forward to serving you.</p>
                </div>
            </div>
        `
      );
    };

    // Return the created user
    return {
        user : userObject,
        status: 201,
        ...(role === "User" && {emailSent: emailResponse.emailSent}),
        ...(role === "User" && {mailMsg: emailResponse.message}),
        message:"Registered successfully!",
        ...(role === "User" && {info: emailResponse.info || null}),
        ...(role === "User" && {error: emailResponse.error || null})
    };
  }catch(err){
    return {
      error: err.message,
      status: 500
    };
  }
}

/* login */
const login = async (email, password, role) => {
    try { 
      if (!email || !password) {
        return {
          error: "Please provide login credentials",
          status: 403
        };
      }

      if (!role) {
        return {
          error: "Please provide role of login",
          status: 403
        };
      };
  
      const user = await User.findOne({ email: email.toLowerCase(), role }).select('+password').lean();
      if (!user) {
        return {
          error: "User does not exist.",
          status: 400
        };
      }

      if (role === 'User' && !user.active) {
        return {
            error: "User has been blocked. Contact support for further details.",
            status: 403
        };
    };
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          error: "Invalid password.",
          status: 400
        };
      }
  
      const token = generateToken(user, process.env.JWT_SECRET);
  
      delete user.password;
      
      return {
        token,
        user,
        status: 200
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500
      };
    }
  };
  

module.exports = {
    checkUserAlreadyRegistered,
    register,
    login
}