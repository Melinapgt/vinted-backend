const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(formidableMiddleware());
app.use(cors());

//accès au variable de l'environnement
require("dotenv").config();

// connexion à la bdd nommé vinted
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//  import des routes

const userRoutes = require("./routes/signup");
app.use(userRoutes);

const offerPublishRoutes = require("./routes/offersPublish");
app.use(offerPublishRoutes);

const deleteOffersRoutes = require("./routes/deleteOffers");
app.use(deleteOffersRoutes);

const updatesOffer = require("./routes/updatesOffers");
app.use(updatesOffer);

const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

const offerRoute = require("./routes/offer");
app.use(offerRoute);

// import des middleware
const isAuthenticated = require("./middleware/isAuthenticated");
app.use(isAuthenticated);

const isOfferExisting = require("./middleware/isOfferExisting");
app.use(isOfferExisting);

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
