const Product = require("../models/productModel");
const User = require("../models/UserModel");
const Order = require("../models/orderModel");

const addProduct = async (req, res) => {
  const sid = req.params.sid;
  let seller;
  try {
    seller = await User.findById(sid);
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "unauthorized access" });
  }
  if (!seller)
    return res
      .status(404)
      .json({ success: false, message: "unauthorized access" });

  let newProd;
  try {
    newProd = await Product.create({ ...req.body, sellerId: sid });
  } catch (e) {
    return res
      .status(504)
      .json({ success: false, message: "product not added" + e });
  }
  if (!newProd)
    return res.status(504).json({
      success: false,
      message: "product cannot be added, try again later",
    });

  let products = seller.myProducts;
  products = [...products, newProd._id];
  User.findByIdAndUpdate(sid, { myProducts: products }, function (e, doc) {
    if (e)
      return res
        .status(400)
        .json({ success: false, message: "couldn't add product" });
    res.json({ success: true, message: "added successfully" });
  });
};

const removeProduct = async (req, res) => {
  const sid = req.params.sid,
    pid = req.params.pid;
  let seller, products;
  try {
    seller = await User.findById(sid);
  } catch {
    return res
      .status(404)
      .json({ success: false, message: "unauthorized access" });
  }
  if (!seller)
    return res
      .status(404)
      .json({ success: false, message: "unauthorized access" });

  products = seller.myProducts;
  console.log(products);
  const idx = products.indexOf(pid);
  if (idx > -1) {
    products.splice(idx, 1);
    User.findByIdAndUpdate(sid, { myProducts: products }, function (e, doc) {
      if (e)
        return res
          .status(400)
          .json({ success: false, message: "couldn't remove product" });
    });
    Product.findByIdAndDelete(pid, function (e, doc) {
      if (e)
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      return res.json({ success: true, message: "removed successfully" });
    });
  }
  res.status(404).json({ success: false, message: "product not found" });
};

const updateProduct = async (req, res) => {
  const sid = req.params.sid,
    pid = req.params.pid;
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

  //Check whether the product owner is updating the product
  if (product.sellerId != sid)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access" });

  Product.findByIdAndUpdate(pid, { ...req.body }, function (e, doc) {
    if (e)
      return res
        .status(404)
        .json({ success: false, message: "couldn't update product" });
    res.json({ success: true, message: "successfully updated" });
  });
};

const viewMyProducts = (req, res) => {
  const sid = req.params.sid;
  if (!sid) return res.json({ success: false, message: "unauthorized access" });
  Product.find({ sellerId: sid }, (err, doc) => {
    if (err)
      return res
        .status(404)
        .json({ success: false, message: "no products found" });
    res.json({ products: doc, success: true });
  });
};

const viewOne = async (req, res) => {
  const pid = req.params.pid;
  let product;
  try {
    product = await Product.findById(pid);
  } catch {
    return res.status(404).json({ success: false, message: "not found" });
  }
  if (!product)
    return res.status(404).json({ success: false, message: "not found" });
  res.json({ product: product, success: true });
};

//view all products of a particular category or tag..
const viewall = async (req, res) => {
  const categories = req.query.category;
  const tags = req.query.tag;
  // const sorted=req.query.sorted;
  let Products;
  try {
    Products = await Product.find();
  } catch {
    return res.status(404).json({ success: false, message: "not found" });
  }
  if (!Products)
    return res.status(404).json({ success: false, message: "not found" });

  if (!categories && !tags) return res.json({ ...Products, success: true });
  let ans = [];
  for (let i = 0; i < Products.length; i++) {
    const category = Products[i].categories,
      tag = Products[i].tags;
    if (category && categories && categories.includes(category)) {
      ans = [...ans, Products[i]];
      continue;
    }
    if (tags && tag && tag.some((i) => tags.includes(i))) {
      ans = [...ans, Products[i]];
    }
  }
  res.json({ products: ans, success: true });
};

//view all products by category...
const GetAllSortedByCategory = async (req, res) => {
  let finalResponse = {};
  let Products;
  try {
    Products = await Product.find();
  } catch {
    return res.status(404).json({ success: false, message: "not found" });
  }
  if (!Products)
    return res.status(404).json({ success: false, message: "not found" });

  for (let i = 0; i < Products.length; i++) {
    const category = Products[i].categories;
    if (!finalResponse[category]) finalResponse[category] = [Products[i]];
    else finalResponse[category] = [...finalResponse[category], Products[i]];
  }
  return res.json({ products: finalResponse, success: true });
};

const get_products_purchased_by_me = async (req, res) => {
  let products;
  const id = req.params.id;
  try {
    products = await Order.find({ buyerId: id });
  } catch {
    return res.status(404).json({ success: false, message: "not found" });
  }
  res.json({ success: true, products: products });
};

module.exports = {
  addProduct,
  removeProduct,
  updateProduct,
  viewMyProducts,
  viewall,
  viewOne,
  GetAllSortedByCategory,
  get_products_purchased_by_me,
};
