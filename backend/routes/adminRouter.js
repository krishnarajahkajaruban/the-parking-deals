const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createCouponCodeDiscount,
    updatingBookingFare,
    getAllUsersByType,
    addingCardParkingAvailability
} = require("../controller/adminController");

// endpoint to create coupon code discount
router.post("/create-coupon-code-discount", authMiddleware, createCouponCodeDiscount);

// endpoint to update booking fare
router.post("/update-booking-fare", authMiddleware, updatingBookingFare);

//endpoint to get all users by type
router.get("/get-all-users", authMiddleware, getAllUsersByType);

//endpoint to update the company detail along with their airport parking slots availability from their apis
router.get("/update-airport-parking-slots", addingCardParkingAvailability);

module.exports = router;