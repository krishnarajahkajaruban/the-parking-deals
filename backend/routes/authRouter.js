const router = require("express").Router();

const { 
    checkUserAlreadyRegistered,
    register,
    login
 } = require("../controller/authController");

//endpoint to check user already register with the provided email
router.post("/check-user-registerd", checkUserAlreadyRegistered);

// register endpoint
router.post("/register", async (req, res) => {
    const { email, title, firstName, lastName, companyName, password, mobileNumber, role } = req.body;

    let result;

    if(role === 'User'){
        result = await register(email, title, firstName, lastName, companyName, password, mobileNumber, role, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }else{
        return res.status(400).json({ error:"Invalid role!"})
    };

    if (result.status !== 201) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json({ 
        user: result.user,
        emailSent: result.emailSent,
        mailMsg: result.mailMsg,
        message: result.message,
        info: result.info,
        error: result.error
     });
});

//login endpoint
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    const result = await login(email, password, role);

    if (result.status !== 200) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json({ 
        token: result.token,
        user: result.user
     });

}); 


module.exports = router;
