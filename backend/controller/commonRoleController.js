const BookingDetail = require("../models/bookingDetailModel");
const User = require("../models/userModel");
const BookingCharges = require("../models/bookingFareModel");
const CouponCodeDiscount = require("../models/couponCodeDiscountModel");

/* view bookings (common for both user, vendor and admin) */
const getAllBookings = async (req, res) => {
    try {
        // Extract query parameters and user information from the request
        const { page, limit, status, date } = req.query;
        const { id, role } = req.user;

        // Initialize userId if the role is "User"
        let userId;
        let companyId;

        if (role === "User") {
            userId = id;
        }

        if (role === "Vendor") {
            companyId = id;
        }

        // Parse page and limit as integers
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        // Validate page and limit values
        if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        }

        // Construct the query object based on userId, companyId, status, and date
        const query = {};

        if (userId) {
            query.userId = userId;
        }

        if (companyId) {
            query.companyId = companyId;
        }

        if (status) {
            // Validate status value
            if (status !== 'Paid' && status !== 'Pending' && status !== 'Failed' && status !== 'Cancelled') {
                return res.status(400).json({ error: "Invalid Status" });
            }
            query.status = status;
        }

        if (date) {
            // Parse the date string into a Date object
            const selectedDate = new Date(date);

            // Set the start and end of the day for the selected date
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            // Add the date filter to the query
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        // Count total documents matching the query
        const totalCount = await BookingDetail.countDocuments(query);

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        // Fetch the bookings matching the query with pagination
        const allBookings = await BookingDetail.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .lean()
            .exec();

        // Return 404 if no bookings are found
        if (allBookings.length === 0) {
            return res.status(404).json({ error: "No bookings found" });
        }

        const bookingDetailsWithUserAndCompanyDetails = await Promise.all(
            allBookings.map(async ({ userId, companyId, ...bookingDetail }) => {
                const user = await User.findById(userId).lean();
                const company = await User.findById(companyId).lean();
                if (role === "Admin") {
                    bookingDetail.user = user;
                    bookingDetail.company = company;
                } else if (role === "Vendor") {
                    bookingDetail.user = user;
                } else if (role === "User") {
                    bookingDetail.company = company;
                }
                return bookingDetail;
            })
        );

        // Return the fetched bookings along with pagination details
        return res.status(200).json({
            currentPage: parsedPage,
            totalPages: Math.ceil(totalCount / parsedLimit),
            totalCount,
            data: bookingDetailsWithUserAndCompanyDetails,
        });

    } catch (err) {
        // Return 500 if an error occurs
        res.status(500).json({ error: err.message });
    }
};

/* find all booking charge and coupon code with discount */
const getBookingChargesWithCouponCodeAndCorrespondingDiscount = async (req, res) => {
    try {
      const [bookingCharges, couponCodeDiscounts] = await Promise.all([
        BookingCharges.findOne(),
        CouponCodeDiscount.findOne()
      ]);
  
      res.status(200).json({
        bookingCharges,
        couponCodeDiscounts,
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



module.exports = {
    getAllBookings,
    getBookingChargesWithCouponCodeAndCorrespondingDiscount
};
