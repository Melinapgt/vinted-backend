const express = require("express");
const router = express.Router();

//import middleware
const isAuthenticated = require("../middleware/isAuthenticated");
const isOfferExisting = require("../middleware/isOfferExisting");
const Offer = require("../models/Offer");

router.delete(
  "/delete/offer",
  isAuthenticated,
  isOfferExisting,
  async (req, res) => {
    console.log(req.fields);

    try {
      await Offer.findByIdAndRemove(req.fields._id);

      res.status(200).json({
        message: `offer ref ${req.fields._id} has been successfully removed`,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
