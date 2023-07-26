const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();
JWT_SECRET = process.env.JWT_SECRET;

const checkUser = async (req, res) => {
  // Getting cookie and verifying it to ensure user is logged in..
  const token = await req.cookies.jwtCookie;
  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(404).json({ user: "" });
      } else {
        User.findById(decodedToken.id)
          .exec()
          .then((user) =>
            res.json({
              success: true,
              _id: user._doc._id,
              name: user._doc.name,
              email: user._doc.email,
              isAdmin: user._doc.isAdmin,
              photo: user._doc.photo,
            })
          )
          .catch((e) => res.status(404).json({ success: false, user: "" }));
      }
    });
  } else {
    res.json({ success: false, user: "" });
  }
};

module.exports = { checkUser };
