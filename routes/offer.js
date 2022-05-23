const express = require("express");
const router = express.Router();

//import des models
const Offer = require("../models/Offer");

router.get("/offer", async (req, res) => {
  try {
    console.log(req.query);
    const { id } = req.query;

    const searchForOffer = await Offer.findById(id).populate({
      path: "owner",
      select: "account",
    });

    res.status(200).json(searchForOffer);
  } catch (error) {
    res.status(400).json({ error: error, message: error.message });
  }
});
module.exports = router;
