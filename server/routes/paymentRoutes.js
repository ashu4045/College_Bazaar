const Router = require("express").Router();
const { order, verify } = require("../controllers/Payment");

Router.post("/orders", (req, res) => order(req, res));
Router.post("/verify", (req, res) => verify(req, res));

module.exports = Router;
