const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");

async function order(req, res) {
  console.log("order method called with data : ", req.body);
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Something Went Wrong!" });
      }
      let new_order;
      try {
        new_order = await Order.create({
          product_name: req.body.name,
          product_id: req.body.pid,
          buyerId: req.body.uid,
          sellerId: req.body.sid,
          order_id: order.id,
          amount: req.body.amount,
          purchased: false,
        });
      } catch {
        return res
          .status(500)
          .json({ success: false, message: "couldn't create order" });
      }
      if (!new_order)
        return res
          .status(500)
          .json({ success: false, message: "couldn't create order" });
      res.status(200).json({ success: true, data: order });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error!" });
    console.log(error);
  }
}

async function verify(req, res) {
  console.log("verify method called with data : ", req.body);
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findOne({ order_id: razorpay_order_id });
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "cannot verify your payment" });
      Order.findOneAndUpdate(
        { order_id: razorpay_order_id },
        { purchased: true },
        (err, doc) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: "cannot verify your payment" });
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
}

module.exports = { verify, order };
