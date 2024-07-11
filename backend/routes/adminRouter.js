const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createCouponCodeDiscount,
    updatingBookingFare,
    getAllUsersByType,
    addingCardParkingAvailability,
    getAllContactOrFaqForms,
    respondToTheContactOrFaqForm,
    getAllSubscribedEmails
} = require("../controller/adminController");

// endpoint to create coupon code discount
router.post("/create-coupon-code-discount", authMiddleware, createCouponCodeDiscount);

// endpoint to update booking fare
router.post("/update-booking-fare", authMiddleware, updatingBookingFare);

//endpoint to get all users by type
router.get("/get-all-users", authMiddleware, getAllUsersByType);

//endpoint to update the company detail along with their airport parking slots availability from their apis
router.get("/update-airport-parking-slots", addingCardParkingAvailability);

//endpoint to get all contact forms
router.get("/get-all-contact-or-faq-forms", authMiddleware, getAllContactOrFaqForms);

//enpoint to sent email to the query user depend on type (faq or contact)
router.post("/send-email-for-faq-or-contact-user", authMiddleware, respondToTheContactOrFaqForm);

//endpoint to find subscribed emails
router.get("/subscribed-emails", getAllSubscribedEmails);

module.exports = router;