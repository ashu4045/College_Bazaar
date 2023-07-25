"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

const PaymentRoute = require("./routes/paymentRoutes");
const AuthRoute = require("./routes/authRoute");
const ProductRoute = require("./routes/productRoute");
const AdminRoute = require("./routes/adminRoute");

const { check } = require("./middlewares/admin");

app.use(cookieParser()); //to handle cookies
app.use(express.json());

app.use(function (req, res, next) {
  //CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//connection to database
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("error while connecting to database" + err));

app.get("/", (req, res) =>
  res.json({ message: "server is up and running..." })
);

app.use("/api/auth", AuthRoute);
app.use("/api/product", ProductRoute);
app.use("/api/payment/", PaymentRoute);
//check if admin then expose admin controls
app.use("/api/admin", check, AdminRoute);

app.listen(PORT, () => console.log(`server started at ${PORT}`));
