const BookingDetail = require("../models/bookingDetailModel");
const User = require("../models/userModel");
const BookingCharges = require("../models/bookingFareModel");
const CouponCodeDiscount = require("../models/couponCodeDiscountModel");
const { isValidObjectId } = require("mongoose");
const Airport = require("../models/airports");

/* view bookings (common for both user, vendor and admin) */
const getAllBookings = async (req, res) => {
    try {
        // Extract query parameters and user information from the request
        const { page, limit, status, date, bookingId } = req.query;
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
        // const parsedPage = parseInt(page);
        // const parsedLimit = parseInt(limit);

        // Validate page and limit values
        // if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
        //     return res.status(400).json({ error: "Page and limit must be positive integers" });
        // }

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
            // Convert the date string (dd/mm/yyyy) to a Date object
            const [day, month, year] = date.split('/');
            const startDate = new Date(Number(year), Number(month) - 1, Number(day));
            
            // Set the time range to include the whole day
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);

            console.log(startDate);
            console.log(endDate);
    
            query.createdAt = { $gte: startDate, $lt: endDate };
        };

        if (bookingId) {
            // Use a regex to find booking IDs that start with the provided bookingId
            query.bookingId = { $regex: `^${bookingId}`, $options: 'i' }; // 'i' option makes the search case-insensitive
        }

        // Count total documents matching the query
        const totalCount = await BookingDetail.countDocuments(query);

        // Calculate the number of documents to skip based on the current page
        // const skip = (parsedPage - 1) * parsedLimit;

        // Fetch the bookings matching the query with pagination
        const allBookings = await BookingDetail.find(query)
            .sort({ updatedAt: -1 })
            // .skip(skip)
            // .limit(parsedLimit)
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
                if (["Admin", "User", "Moderator", "Admin-User"].includes(role)) {
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

        // Calculate the remaining data count
        // const remainingDataCount = totalCount - (skip + allBookings.length);

        // Return the fetched bookings along with pagination details and remaining data count
        return res.status(200).json({
            // currentPage: parsedPage,
            // totalPages: Math.ceil(totalCount / parsedLimit),
            totalCount,
            data: bookingDetailsWithUserAndCompanyDetails,
            // remainingDataCount: remainingDataCount < 0 ? 0 : remainingDataCount, // Ensure non-negative value
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

/* get all vendors */
const findAllVendors = async (req, res) => {
  try {
    const { airportId } = req.query;

    let query = { role: "Vendor" };

    if (airportId) {
      if (!isValidObjectId(airportId)) {
        return res.status(400).json({ error: "Invalid airport ID" });
      }
      query.airports = { $in: [airportId] };
    }

    const allVendors = await User.find(query).sort({ updatedAt: -1 });

    if (allVendors.length === 0) {
      return res.status(404).json({ error: "No vendors found" });
    }

    return res.status(200).json({
      data: allVendors,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/* get all airports */
const getAllAirports = async(req, res) => {
    try{
        const airports = await Airport.find();
        res.status(200).json(airports);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getAllBookings,
    getBookingChargesWithCouponCodeAndCorrespondingDiscount,
    findAllVendors,
    getAllAirports
};
