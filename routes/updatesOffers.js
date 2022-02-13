const express = require("express");
const router = express.Router();

//import middleware
const isAuthenticated = require("../middleware/isAuthenticated");
const isOfferExisting = require("../middleware/isOfferExisting");
const Offer = require("../models/Offer");

//modifier le prix
router.put(
  "/update/offer/price",
  isAuthenticated,
  isOfferExisting,
  async (req, res) => {
    console.log(req.fields);
    try {
      const newPrice = req.fields.product_price;
      const offerToUpdate = await Offer.findById(req.fields._id);
      offerToUpdate.product_price = newPrice;

      await offerToUpdate.save();

      res
        .status(200)
        .json({ message: "The price of the offer has been updated" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
