const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
  verified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  blacklisted: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  name: { type: String, required: [true, "please enter your name"] },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    lowercase: true,
  },
  confirmationCode: String,
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: [6, "password should be atleast 6 characters long"],
  },
  photo: { type: String },
  myOrders: Array,
  myProducts: Array,
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};

const User = mongoose.model("user", userSchema);
module.exports = User;
