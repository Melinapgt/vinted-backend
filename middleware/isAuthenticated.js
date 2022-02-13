const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const isTokenValid = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });

    if (isTokenValid) {
      req.user = isTokenValid;
      return next();
    } else {
      return res.status(401).json({ error: "Unauthorized2" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized1" });
  }
};

module.exports = isAuthenticated;
