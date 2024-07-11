const BookingDetail = require("../models/bookingDetailModel");
const User = require("../models/userModel");

/* view bookings (common for both user, vendor and admin) */
const getAllBookings = async (req, res) => {
    try {
        // Extract query parameters and user information from the request
        const { page, limit, status } = req.query;
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

        // Construct the query object based on userId and status
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

        // Count total documents matching the query
        const totalCount = await BookingDetail.countDocuments(query);

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        // Fetch the orders matching the query with pagination
        const allBookings = await BookingDetail.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .lean()
            .exec();

        // Return 404 if no orders are found
        if (allBookings.length === 0) {
            return res.status(404).json({ error: "No bookings found" });
        }

        const bookingDetailsWithUserAndCompanyDetails = await Promise.all(
            allBookings.map(async ({userId, companyId, ...bookingDetail}) => {
                const user = await User.findById(userId).lean();
                const company = await User.findById(companyId).lean();
                if(role === "Admin"){
                    bookingDetail.user = user;
                    bookingDetail.company = company;
                }else if (role === "Vendor"){
                    bookingDetail.user = user;
                }else if (role === "User"){
                    bookingDetail.company = company;
                }
                return bookingDetail;
            })
        );

        // Return the fetched orders along with pagination details
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

module.exports = {
    getAllBookings
};
