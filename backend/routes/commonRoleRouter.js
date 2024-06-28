const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
    getAllBookings
 } = require("../controller/commonRoleController");
 
//endpoint to get all bookings
 router.get("/get-all-bookings", authMiddleware, getAllBookings);

 module.exports = router;