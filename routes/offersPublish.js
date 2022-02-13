const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//import des models

const Offer = require("../models/Offer");

//import des middleware
const isAuthenticated = require("../middleware/isAuthenticated");

//création d'une nouvelle annonce
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  console.log(req.files);
  console.log(req.fields);

  try {
    //avant la création on vérifie le token de l'user
    //si pas ok Unauthorized
    //else : excution du code

    // on sauvegarde l'image sur cloudinary
    let pictureToUpload = req.files.picture.path;
    const result = await cloudinary.uploader.upload(pictureToUpload);
    console.log(result);

    //on créer la nouvelle annonce

    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        {
          BRAND: req.fields.brand,
        },
        {
          SIZE: req.fields.size,
        },
        {
          CONDITION: req.fields.condition,
        },
        {
          COLOR: req.fields.color,
        },
        {
          CITY: req.fields.city,
        },
      ],
      product_image: result,
      owner: req.user,
    });

    newOffer.product_image.public_id = `/vinted/offers/${newOffer._id}`;
    //on sauvegarde dans la base
    await newOffer.save();
    // a voir
    // result.public_id = `/vinted/offers/${newOffer._id}`;

    res.status(200).json({
      _id: newOffer._id,
      product_name: newOffer.product_name,
      product_description: newOffer.product_description,
      product_price: newOffer.product_price,
      product_details: newOffer.product_details,
      product_image: newOffer.product_image.secure_url,
      owner: {
        _id: req.user._id,
        account: req.user.account,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
