const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const { 
    carParkingBookingDetail,
    calculatingTotalBookingCharge,
    cancelTheBooking,
    findAllVendorDetailForUserSearchedParkingSlot,
    getAllAirports
 } = require("../controller/userController");

 //endpoint to create car parking booking
 router.post("/car-park-booking", carParkingBookingDetail);

//endpoint to calculate the total booking charge
router.post("/calculate-total-booking-charge", async (req, res) => {
    const { bookingQuote, couponCode, smsConfirmation, cancellationCover } = req.body;

    const result = await calculatingTotalBookingCharge(bookingQuote, couponCode, smsConfirmation, cancellationCover);

    if (result.status !== 200) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json({ 
        bookingQuote: result.bookingQuote,
        bookingFee: result.bookingFee,
        smsConfirmation: result.smsConfirmation,
        cancellationCover: result.cancellationCover,
        totalBeforeDiscount: result.totalBeforeDiscount,
        couponDiscount: result.couponDiscount,
        discountAmount: result.discountAmount,
        totalPayable: result.totalPayable
     });

});

//endpoint to cancel the booking
router.patch("/cancell-booking", authMiddleware, cancelTheBooking);

//endpoint to find all vendor detail for user searched parking slot
router.get("/find-vendor-detail", findAllVendorDetailForUserSearchedParkingSlot);

//endpoint to get all the airports name in the db
router.get("/get-all-airports", getAllAirports);

 module.exports = router;