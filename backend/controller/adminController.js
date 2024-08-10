const CouponDiscount = require("../models/couponCodeDiscountModel");
const BookingFare = require("../models/bookingFareModel");
const User = require("../models/userModel");
const { register } = require("./authController");
const AirportParkingAvailability = require("../models/airportParkingAvailability");
const ContactForm = require("../models/contact");
const sendEmail = require("../common/mailService");
const SubscribedEmail = require("../models/subcribedEmail");

/* creating coupon code and corresponding discount */
const createCouponCodeDiscount = async (req, res) => {
    try {
        const { couponCode, discount } = req.body;

        const { role } = req.user;

        if(role !== "Admin") {
            return res.status(403).json({ error: 'Only admin can create coupon code and corresponding discount.' });
        }

        if (!couponCode || !discount) {
            return res.status(400).json({ error: 'Coupon code and discount are required.' });
        }
        
        const couponCodeDiscount = new CouponDiscount({
            couponCode: couponCode.toLowerCase(),
            discount,
        });

        await couponCodeDiscount.save();

        return res.status(201).json({
            message: 'Coupon code and discount created successfully.',
            data: couponCodeDiscount,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/* update booking fare */
const updatingBookingFare = async (req, res) => {
    try {
        const { bookingFee, smsConfirmationFee, cancellationCoverFee } = req.body;
        const { role } = req.user;

        if( !bookingFee || !smsConfirmationFee || !cancellationCoverFee){
            return res.status(400).json({ error: 'Booking fee, sms confirmation fee and cancellation cover fee are required.' });
        }

        if (role !== "Admin") {
            return res.status(403).json({ error: 'Only admin can update booking fare.' });
        }

        // Ensure that only one document exists in the collection
        await BookingFare.deleteMany({});

        // Create a new document with the provided fees
        const newBookingFare = new BookingFare({
            bookingFee,
            smsConfirmationFee,
            cancellationCoverFee
        });

        await newBookingFare.save();

        res.status(200).json({
            message: 'Booking fare updated successfully.',
            data: newBookingFare
        });
        
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

/* get all users depend on type */
const getAllUsersByType = async (req, res) => {
    try {
        // Extract query parameters and user information from the request
        const { page = 1, limit = 10, type } = req.query;
        const { role } = req.user;

        if (role !== "Admin") {
            return res.status(403).json({ error: "You are not authorized" });
        }

        if( !(["User", "Vendor"].includes(type)) ) {
            return res.status(403).json({ error: "Invalid user role" });
        }

        // Parse page and limit as integers
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        }

        // Count total documents matching the query
        const totalCount = await User.countDocuments({ role: type });

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        // Fetch the users matching the query with pagination
        const allUsers = await User.find({ role: type })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .lean()
            .exec();

        // Return the fetched users along with pagination details
        return res.status(200).json({
            currentPage: parsedPage,
            totalPages: Math.ceil(totalCount / parsedLimit),
            data: allUsers,
            totalCount
        });

    } catch (err) {
        // Return 500 if an error occurs
        res.status(500).json({ error: err.message });
    }
};

/* adding car parking availability of companies for airports */
const fetchParkingAvailabilityFromAPIs = async () => {
    // Implement fetching logic here, for example using axios
    // Assume we get an array of parking details from various APIs
    let carParkingAvailability = await getCarParkingAvailabilityFromDifferentAPIs();
    return carParkingAvailability;
};

const addingCardParkingAvailability = async (req, res) => {
    try {
        let carParkingAvailability = await fetchParkingAvailabilityFromAPIs();

        const createParkingAvailability = await Promise.all(
            carParkingAvailability.map(async (parkingDetailsOfACompany) => {
                const { companyName, airportsSlots, email, password } = parkingDetailsOfACompany;
                let vendor;

                const checkCompanyRegistered = await User.findOne({ companyName: companyName.toLowerCase() });
                if (!checkCompanyRegistered) {
                    const result = await register(email, companyName, password, "Vendor");

                    if (result.status !== 201) {
                        throw new Error(result.error);
                    }

                    vendor = result.user;
                } else {
                    vendor = checkCompanyRegistered;
                }

                const airportSlotPromises = airportsSlots.map(async (airportSlot) => {
                    const { airport, fromDate, toDate, fromTime, toTime } = airportSlot;
                    const airportLower = airport.toLowerCase();

                    let updatedAirportParkingSlot;
                    const particularAirportParkingSlots = await AirportParkingAvailability.findOne({ airport: airportLower });

                    if (!particularAirportParkingSlots) {
                        updatedAirportParkingSlot = new AirportParkingAvailability({
                            airport: airportLower,
                            companyParkingSlot: [{
                                companyId: vendor._id,
                                fromDate,
                                toDate,
                                fromTime,
                                toTime
                            }]
                        });
                        await updatedAirportParkingSlot.save();
                    } else {
                        updatedAirportParkingSlot = await AirportParkingAvailability.findOneAndUpdate(
                            { airport: airportLower },
                            {
                                $push: {
                                    companyParkingSlot: {
                                        companyId: vendor._id,
                                        fromDate,
                                        toDate,
                                        fromTime,
                                        toTime
                                    }
                                }
                            },
                            { new: true }
                        );
                    }

                    return updatedAirportParkingSlot;
                });

                return Promise.all(airportSlotPromises);
            })
        );

        return res.status(200).json({ 
            message: "Airport Parking Availabilities fetched and updated to db successfully!",
            data: createParkingAvailability
         });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getCarParkingAvailabilityFromDifferentAPIs = async () => {
    // Implement API calls here and return the combined results
    // This is a placeholder for the actual API fetching logic
    return [
        // Sample data structure
        {
            companyName: 'Company A',
            airportsSlots: [
                {
                    airport: 'JFK',
                    fromDate: '2024-01-01',
                    toDate: '2024-01-10',
                    fromTime: '08:00',
                    toTime: '18:00'
                },
                // Add more slots as needed
            ],
            email: 'contact@companya.com',
            password: 'securepassword',
            mobileNumber: '1234567890'
        },
        // Add more companies as needed
    ];
};

/* get all contact forms */
const getAllContactOrFaqForms = async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const { role } = req.user;

        if( role !== "Admin" ){
            return res.status(403).json({ error: "You are not authorized" });
        };

        if(!type){
            return res.status(400).json({ error: "Type is required" });
        };

        // Parse page and limit as integers
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        };

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        let totalCount;
        let allForms
        if(type ==="contact"){
            totalCount = await ContactForm.countDocuments();
            allForms = await ContactForm.find()
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parsedLimit)
                .lean()
                .exec();
        }
        // else if (type === "faq"){
        //     totalCount = await Faq.countDocuments();
        //     allForms = await Faq.find()
        //         .sort({ updatedAt: -1 })
        //         .skip(skip)
        //         .limit(parsedLimit)
        //         .lean()
        //         .exec();
        // }
        else {
            return res.status(400).json({ error: "Invalid type" });
          };

            if(allForms.length === 0){
                return res.status(404).json({ error: "No Contact Form found" });
            };

            return res.status(200).json({
                currentPage: parsedPage,
                totalPages: Math.ceil(totalCount / parsedLimit),
                totalCount,
                data: allForms,
            });
    }catch (err) {
        console.log(err);
        response.status(500).json({ error: "Internal Server Error" });
    }
};

/* respond to the contact or faq */
const respondToTheContactOrFaqForm = async (req, res) => {
    try {
        const { response, type, formId } = req.body;
        const { role } = req.user;

        if (role !== "Admin") {
            return res.status(403).json({ error: "You are not authorized" });
        }

        if (!type || !response || !formId) {
            return res.status(400).json({ error: "Fill the required field!" });
        }

        let form;
        if (type === "contact") {
            form = await ContactForm.findById(formId).lean();
        }
        //  else if (type === "faq") {
        //     form = await Faq.findById(formId);
        //     form.answer = response;
        //     await form.save();
        // } 
        else {
            return res.status(400).json({ error: "Invalid type" });
        }

        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        const emailResponse = await sendEmail(
            form.email,
            'Welcome to The Parking Deals!',
            `
                <div style="padding: 20px; font-family: Calibri;">
                    <div style="text-align: center;">
                        <a href="www.theparkingdeals.co.uk"><img src="https://res.cloudinary.com/piragashcloud/image/upload/v1721238830/logo512_dmvwkk.png" alt="The Parking Deals Logo" width="80" height="80"></a>
                    </div>
                    <div style="margin-top: 40px; font-size: 15px;">
                        <p>Dear ${form.name},</p>
                        <p>Thank you for visiting our website! We're excited to have you on board.</p>
                        <p>Please find the answer to your query below:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Subject</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Message</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Response</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${form.subject}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${form.message}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${response}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>If you have any questions, please contact our support team at <a href="mailto:info@theparkingdeals.co.uk">info@theparkingdeals.co.uk</a>.</p>
                        <p>Thank you for choosing Shopname. We look forward to serving you.</p>
                    </div>
                </div>
            `
        );

        return res.status(201).json({
            form,
            emailSent: emailResponse.emailSent,
            mailMsg: emailResponse.message,
            info: emailResponse.info || null,
            error: emailResponse.error || null
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

/* get all subscribed emails */
const getAllSubscribedEmails = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { role } = req.user;

        if( role !== "Admin" ){
            return res.status(403).json({ error: "You are not authorized" });
        };

        // Parse page and limit as integers
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        };

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        const totalCount = await SubscribedEmail.countDocuments();

        const subscribers = await SubscribedEmail.find()
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parsedLimit)
                .lean()
                .exec();

        if(subscribers.length === 0){
                return res.status(404).json({ error: "No Subscribers found" });
            };

            return res.status(200).json({
                currentPage: parsedPage,
                totalPages: Math.ceil(totalCount / parsedLimit),
                totalCount,
                data: subscribers,
            });
    }catch (err) {
        console.log(err);
        response.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createCouponCodeDiscount,
    updatingBookingFare,
    getAllUsersByType,
    addingCardParkingAvailability,
    getAllContactOrFaqForms,
    respondToTheContactOrFaqForm,
    getAllSubscribedEmails
}