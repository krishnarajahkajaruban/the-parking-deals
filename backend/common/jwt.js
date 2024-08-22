const jwt = require('jsonwebtoken');

const generateToken = (user, secret, expiresIn = '1d') => {
  const payload = {
    id: user._id,
    email: user.email,
    ...(user.role === "User" && { title: user.title }),
    ...(["Admin", "User", "Moderator", "Admin-User"].includes(user.role) && { firstName: user.firstName }),
    ...(["Admin", "User", "Moderator", "Admin-User"].includes(user.role) && { lastName: user.lastname }),
    ...(user.role === "Vendor" && { companyName: user.companyName }),
    ...(user.role === "Vendor" && { serviceType: user.serviceType }),
    ...(user.role === "Vendor" && { rating: user.rating }),
    ...(user.role === "Vendor" && { dealPercentage: user.dealPercentage }),
    ...(user.role === "Vendor" && { overView: user.overView }),
    ...(user.role === "Vendor" && { cancellationCover: user.cancellationCover }),
    ...(user.role === "Vendor" && { quote: user.quote }),
    ...(user.role === "Vendor" && { finalQuote: user.finalQuote }),
    ...(user.role === "Vendor" && { facilities: user.facilities }),
    ...(user.role === "Vendor" && { dropOffProcedure: user.dropOffProcedure }),
    ...(user.role === "Vendor" && { pickUpProcedure: user.pickUpProcedure }),
    mobileNumber: user.mobileNumber,
    ...(user.role === "User" && { active: user.active }),
    // ...(user.role === "User" && {addressL1: user.addressL1}),
    // ...(user.role === "User" && {addressL2: user.addressL2}),
    role: user.role,
    // ...(user.role === "User" && {city: user.city}),
    // ...(user.role === "User" && {country: user.country}),
    // ...(user.role === "User" && {postCode: user.postCode}),
    ...(["Vendor", "User"].includes(user.role) && {dp: user.dp})
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
