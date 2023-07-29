const User = require("../models/UserModel");
const Product = require("../models/productModel");
const Mailer = require("../middlewares/mailer");

//function to verify a particular student/user
const approveUser = async (req, res) => {
  console.log(req.body);
  const { uid } = req.body;
  if (!uid)
    return res.status(404).json({ success: false, message: "invalid request" });
  let user;
  try {
    user = await User.findById(uid);
  } catch {
    return res.status(404).json({ success: false, message: "user not found" });
  }
  if (!user)
    return res.status(404).json({ success: false, message: "user not found" });
  user.approved = true;
  User.findByIdAndUpdate(uid, { ...user }, (err, doc) => {
    if (err) res.json({ success: false, message: "could not verify" });
    res.json({ success: true, message: "student verified" });
  });
};

//function to verify a particular product
const approveProduct = async (req, res) => {
  const pid = req.body.pid;
  if (!pid)
    res.status(404).json({ success: false, message: "invalid request" });
  let product;
  try {
    product = await Product.findById(pid);
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "product not found" });
  }
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "product not found" });

  product.approved = true;
  Product.findByIdAndUpdate(pid, { ...product }, (err, doc) => {
    if (err)
      return res
        .status(504)
        .json({ success: false, message: "could not verify" });
    res.json({ success: true, message: "product verified" });
  });
};

//admins can remove fake products with this function
const removeProduct = async (req, res) => {
  const { pid, message } = req.body;
  if (!pid || !message)
    return res.status(404).json({ success: false, message: "invalid request" });

  let product_to_remove;
  try {
    product_to_remove = Product.findById(pid);
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "product not found" });
  }
  const name = product_to_remove.name;

  Product.findByIdAndDelete(pid, async function (err, doc) {
    if (err)
      return res
        .status(404)
        .json({ success: false, message: "product not found" });

    //send an email to notify student that his product is removed.
    let emailTransporter = await Mailer();
    emailTransporter
      .sendMail({
        from: process.env.ADMIN_MAIL,
        to: req.body.email,
        subject: "Attention!!",
        html: `<h2>Your product was removed</h2>
            <h3>Hey there, hope you are doing well..</h3>
            <p>Your product ${name} was removed by competent authority due to following reasons:<br/>
            <cite>${message}</cite>
            </p>
            <h3>Thankyou</h3>
            </div>`,
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ success: false, message: "unable to notify student" });
      });

    res.json({ success: true, message: "product removed successfully" });
  });
};

//function to blacklist a particular student
const blacklist = async (req, res) => {
  const { uid, message } = req.body;
  if (!uid || !message)
    return res.status(400).json({ success: false, message: "invalid request" });

  let user;
  try {
    user = await User.findById(uid);
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "user doesn't exist" });
  }
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "user doesn't exist" });

  User.findByIdAndUpdate(uid, { blacklisted: true }, (err, doc) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "couldn't blacklist" });

    //send an email to notify student that he is being blacklisted.
    let emailTransporter = Mailer();
    emailTransporter
      .sendMail({
        from: process.env.ADMIN_MAIL,
        to: req.body.email,
        subject: "Attention!!",
        html: `<h2>You are blacklisted on College Bazaar</h2>
            <h3>Hey there, hope you are doing well..</h3>
            <p>You are blacklisted (and debarred to use College Bazaar) by competent authority due to following reasons:<br/>
            <cite>${message}</cite>
            </p>
            <h4>*please visit admin's office if you think this is done by mistake</h4>
            <h3>Thankyou</h3>
            </div>`,
      })
      .catch((err) =>
        res
          .status(500)
          .json({ success: false, message: "unable to notify student" })
      );

    res.json({ success: true, message: "product removed successfully" });
  });
};

const whitelist = (req, res) => {
  const uid = req.body.uid;
  User.findByIdAndUpdate(uid, { blacklisted: false }, (err, doc) => {
    if (err)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    res.json({ success: true, message: "updated successfully" });
  });
};

const getAllBlacklist = async (req, res) => {
  User.find({ blacklisted: true }, (err, doc) => {
    if (err)
      return res.json({
        success: false,
        message: "no blacklisted users found",
      });
    res.json({ success: true, users: doc });
  });
};
const getall = (req, res) => {
  User.find((err, doc) => {
    if (err)
      return res.json({
        success: false,
        message: "no users found",
      });
    let response = [];
    doc.forEach((user) => {
      if (!user.isAdmin) {
        const details = {
          _id: user._id,
          verified: user.verified,
          approved: user.approved,
          blacklisted: user.blacklisted,
          name: user.name,
          email: user.email,
          photo: user.photo,
          isAdmin: user.isAdmin,
        };
        response = [...response, details];
      }
    });
    res.json({ success: true, users: response });
  });
};

module.exports = {
  approveUser,
  approveProduct,
  removeProduct,
  blacklist,
  whitelist,
  getAllBlacklist,
  getall,
};
