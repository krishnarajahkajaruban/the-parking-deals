const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Multer = require("multer");
const path = require('path');


const {
    createCouponCodeDiscount,
    updatingBookingFare,
    getAllUsersByType,
    addingCardParkingAvailability,
    getAllContactOrFaqForms,
    respondToTheContactOrFaqForm,
    getAllSubscribedEmails,
    creatingVendor,
    updateVendorInfo,
    deleteVendor,
    changingActiveStatusOfUser,
    createRoleForAdmin,
    updateAdminUserInfo,
    deleteAdminUser
} = require("../controller/adminController");

// Define the maximum file size (in bytes) for each image. For example, 5MB:
const MAX_SIZE = 5 * 1024 * 1024;

// Define allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

// Create the memory storage:
const storage = Multer.memoryStorage();

// Create the upload middleware with file filter and size limits:
const upload = Multer({
  storage,
  limits: {
    fileSize: MAX_SIZE, // Limit each file size to MAX_SIZE
  },
  fileFilter: (req, file, cb) => {
    // Check the file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      // If the file has an allowed extension, accept it
      cb(null, true);
    } else {
      // If the file does not have an allowed extension, reject it
      cb(new Error('Only image files with .jpg, .jpeg, .png, .gif, .bmp extensions are allowed!'), false);
    }
  },
});

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

//endpoint to create vendor
router.post("/create-vendor", authMiddleware, upload.single("logo"), creatingVendor);

//endpoint to update vendor info
router.put("/update-vendor-info/:id", authMiddleware, upload.single("logo"), updateVendorInfo);

//delete vendor
router.delete("/delete-vendor/:id", authMiddleware, deleteVendor);

//change the user active status
router.patch("/change-user-active-status/:id", authMiddleware, changingActiveStatusOfUser);

//create a admin role
router.post("/create-admin-role", authMiddleware, createRoleForAdmin);

//update admin user info
router.put("/update-admin-user/:id", authMiddleware, updateAdminUserInfo);

//delete admin user
router.delete("/delete-admin-user/:id", authMiddleware, deleteAdminUser);

module.exports = router;