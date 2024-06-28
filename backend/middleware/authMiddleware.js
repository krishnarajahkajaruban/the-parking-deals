const jwt = require("jsonwebtoken");
const { decodeToken } = require("../common/jwt");

const authMiddleware = async(req, res, next) => {
    
        let token;
        let authHeader = req.headers['authorization'];
    
        if (!authHeader) {
            return res.status(403).json({
                error: "Please provide an auth token"
            });
        }
    
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
    
            try {
                const decoded = await decodeToken(token, process.env.JWT_SECRET);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(error.status || 500).json({
                  error: error.message || "An error occurred during token verification"
                });
            }
    
        } else {
            return res.status(403).json({
                error: "Invalid auth token format"
            });
        }
   
};

module.exports = authMiddleware;
