const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
    getAllBookings,
    getBookingChargesWithCouponCodeAndCorrespondingDiscount
 } = require("../controller/commonRoleController");
 
//endpoint to get all bookings
 router.get("/get-all-bookings", authMiddleware, getAllBookings);

//endpoint to get all booking charges with coupon code and discount
router.get("/find-all-booking-charges-couponcode-discount", getBookingChargesWithCouponCodeAndCorrespondingDiscount);

 module.exports = router;