const Router = require("express").Router();
const {
  approveProduct,
  approveUser,
  blacklist,
  removeProduct,
  whitelist,
  getAllBlacklist,
  getall
} = require("../controllers/AdminController");

Router.post("/getall", (req, res) => getall(req, res));
Router.post("/approve/user", (req, res) => approveUser(req, res));
Router.post("/approve/product", (req, res) => approveProduct(req, res));
Router.post("/blacklist", (req, res) => blacklist(req, res));
Router.post("/remove", (req, res) => removeProduct(req, res));
Router.post("/whitelist", (req, res) => whitelist(req, res));
Router.post("/getAllBlacklist", (req, res) => getAllBlacklist(req, res));

module.exports = Router;
