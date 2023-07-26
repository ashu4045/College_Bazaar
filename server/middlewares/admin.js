const User = require("../models/UserModel");

const check = async (req, res, next) => {
  const uid = req.body.id;
  const user = await User.findById(uid);
  if (!user || user.isAdmin === false)
    return res.json({ success: false, message: "unauthorized access" });
  next();
};

module.exports = {
  check,
};
