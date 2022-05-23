const { SHA256 } = require("crypto-js");
const express = require("express");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//import des models
const User = require("../models/User");
const sha256 = require("crypto-js/sha256");

//création d'un nouvel account et user

router.post("/user/signup", async (req, res) => {
  console.log(req.fields);
  try {
    const newUserEmail = req.fields.email;
    const searchForEmail = await User.findOne({ email: newUserEmail });
    //   console.log(searchForEmail);
    if (searchForEmail !== null) {
      res.status(400).json({ error: "Unauthorized" });
    } else {
      if (!req.fields.username) {
        res.status(400).json({ error: "Veuillez renseigner le username" });
      } else {
        const password = req.fields.password;
        const salt = uid2(16);
        //   console.log(`salt : ${salt}`);
        const hash = SHA256(password + salt).toString(encBase64);
        //   console.log(`hash: ${hash}`);
        const token = uid2(16);
        //   console.log(`token: ${token}`);
        // if (req.files) {
        //   let pictureToUpload = req.files.picture.path;
        //   const result = await cloudinary.uploader.upload(pictureToUpload);
        //   console.log(result);
        // }

        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
            // avatar: result.secure_url,
          },

          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();

        res.status(200).json({
          id: newUser.id,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    console.log("error ==>", error);
    res.status(400).json({ message: error.message });
  }
});

//connexion

router.post("/user/login", async (req, res) => {
  console.log(req.fields);
  try {
    const userEmail = req.fields.email;
    const password = req.fields.password;
    const searchForAccount = await User.findOne({ email: userEmail });
    console.log(searchForAccount);

    if (searchForAccount === null) {
      res.status(401).json({ error: "Unauthorized!" });
    } else {
      const newHash = sha256(password + searchForAccount.salt).toString(
        encBase64
      );
      if (searchForAccount.hash === newHash) {
        res.status(200).json({
          id: searchForAccount.id,
          token: searchForAccount.token,
          account: searchForAccount.account,
        });
      } else {
        res.status(401).json("Unauthorized! 2");
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
