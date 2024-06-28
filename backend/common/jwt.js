const jwt = require('jsonwebtoken');

const generateToken = (user, secret, expiresIn = '1d') => {
  const payload = {
    id: user._id,
    email: user.email,
    ...(user.role === "User" && { title: user.title }),
    ...(user.role.includes(["Admin", "User"]) && { firstName: user.firstName }),
    ...(user.role.includes(["Admin", "User"]) && { lastName: user.lastName }),
    ...(user.role === "Vendor" && { companyName: user.companyName }),
    ...(user.role === "User" && { mobileNumber: user.mobileNumber}),
    ...(user.role === "User" && {address: user.address}),
    role: user.role,
    ...(user.role === "User" && {city: user.city}),
    ...(user.role === "User" && {country: user.country}),
    ...(user.role === "User" && {postCode: user.postCode})
  };

  return jwt.sign(payload, secret, { expiresIn });
};

const decodeToken = (token, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject({ status: 401, message: "Invalid JWT token" });
        } else {
          resolve(decoded);
        }
      });
    });
  };

module.exports = {
    generateToken,
    decodeToken
};
