const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Mailer = require("../middlewares/mailer");
JWT_SECRET = process.env.JWT_SECRET;
const createToken = (id) => {
  //function to create jwt cookies
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60 * 1000,
  });
};

//register ->
const register = async (req, res) => {
  try {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 25; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }
    let user;
    const isAdmin = req.body.isAdmin;
    try {
      user = await User.create({
        ...req.body,
        approved: isAdmin, //if user is admin, no need of approval
        confirmationCode: code,
      });
    } catch {
      return res
        .status(500)
        .json({ success: false, message: "email already registered" });
    }
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "unable to create user" });

    let emailTransporter = await Mailer();
    emailTransporter
      .sendMail({
        from: process.env.ADMIN_MAIL,
        to: req.body.email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
                <h2>Hello ${req.body.name}</h2>
                <p>Thank you for considering us. Please confirm your email by clicking on the following link</p>
                <a href=${process.env.SERVER_URL}/api/auth/verify/${code}> Click here</a>
                </div>`,
      })
      .catch((err) =>
        res.json({ success: false, message: "confirmation mail not sent" })
      );
    res.json({
      success: true,
      message: "We've just sent an email... verify your account",
    });
  } catch (err) {
    let error = err.message;
    if (err.code === 11000) error = "Email is already registerd";
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const confirmEmail = (req, res) => {
  User.updateOne(
    { confirmationCode: req.params.code },
    { verified: true },
    function (err, docs) {
      if (err) {
        console.log(err);
        return res
          .status(404)
          .json({ success: false, message: "unable to verify your account" });
      } else {
        res.send("<h1>Account verified, please log into the app.</h1>");
      }
    }
  );
};

//login ->
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    try {
      user = await User.login(email, password);
    } catch {
      return res
        .status(404)
        .json({ success: false, message: "incorrect credentials" });
    }
    if (!user.verified)
      return res
        .status(404)
        .json({ success: false, message: "email is not verified" });
    if (!user.approved)
      return res.status(404).json({
        success: false,
        message:
          "your account is not approved by admins. You can't login now..",
      });

    const token = createToken(user._id);
    // console.log(token);
    res.cookie("jwtCookie", token, {
      httpOnly: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      _id: user._doc._id,
      name: user._doc.name,
      email: user._doc.email,
      isAdmin: user._doc.isAdmin,
      photo: user._doc.photo,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//logout ->
const logout = (req, res) => {
  try {
    res.cookie("jwtCookie", "", { maxAge: 1 }); //set cookie age 1ms and already removed the data in sessionStorage from frontend
  } catch (e) {
    res.json({ success: false, message: "Can't log out " + e });
  }
  res.json({ success: true, message: "successfully logged out" });
};

const viewProfile = async (req, res) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch {
    return res.status(404).json({ success: false, message: "user not found" });
  }
  if (!user)
    return res.status(404).json({ success: false, message: "user not found" });
  res.json({ ...user._doc, success: true });
};

const updateProfile = (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, { ...req.body }, function (e, doc) {
    if (e)
      return res
        .status(404)
        .json({ success: false, message: "some error occured" });
    res.json({ success: true, message: "updated successfully" });
  });
};

module.exports = {
  register,
  login,
  logout,
  confirmEmail,
  updateProfile,
  viewProfile,
};
