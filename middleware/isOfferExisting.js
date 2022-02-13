const Offer = require("../models/Offer");

const isOfferExisting = async (req, res, next) => {
  const searchForId = await Offer.findById(req.fields._id);
  if (searchForId) {
    return next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isOfferExisting;
