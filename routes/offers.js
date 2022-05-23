const express = require("express");
const router = express.Router();

//import des models
const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
  console.log(req.query);

  //gestion des filtres avec find()
  const filters = {};
  if (req.query.title) {
    filters.product_name = new RegExp(req.query.title, "i");
  }

  if (req.query.priceMin) {
    filters.product_price = { $gte: req.query.priceMin };
  }

  if (req.query.priceMax) {
    if (filters.product_price) {
      filters.product_price.$lte = req.query.priceMax;
    } else {
      filters.product_price = { $lte: req.query.priceMax };
    }
  }

  //gestion des sort()

  const sort = {};
  if (req.query.sort) {
    if (req.query.sort === "price-desc") {
      sort.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
      sort.product_price = "asc";
    }
  }

  //gestion de la pagination
  let limit = 2;
  if (req.query.limit) {
    limit = req.query.limit;
  }

  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }

  const skip = (page - 1) * limit;

  const offersToDisplay = await Offer.find(filters)
    .populate({
      path: "owner",
      select: "account",
    })
    .sort(sort)
    .limit(limit)
    .skip(skip);

  //faire apparaitre le nombre d'offres
  const count = await Offer.countDocuments(filters);

  res.status(200).json({ count: count, offers: offersToDisplay });
});

module.exports = router;
