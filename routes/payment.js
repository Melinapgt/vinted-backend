const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const cors = require("cors");

const app = express();
app.use(cors());

router.post("/payment", async (req, res) => {
  try {
    console.log("req.fields payment ==> ", req.fields);
    const { token, title, amount } = req.fields;

    //transaction
    const response = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: "eur",
      description: title,
      source: token,
    });
    console.log("response stripe ==>", response.status);
    res.status(200).json(response);
  } catch (error) {
    console.log("error payment ==>", error);
    res.status(400).json(error.message);
  }
});

module.exports = router;
