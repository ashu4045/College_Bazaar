import React, { useState } from "react";
import Navbar from "../components/Navigation/Navbar";
import ProductList from "../components/Products/ProductList";
import Footer from "../components/Utilities/Footer";
import Search from "../components/Utilities/Search";
import { Link } from "react-router-dom";
export default function Homepage(props) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Navbar toggle={toggle} setToggle={setToggle} />
      <div className="flex justify-between mb-4">
        <div className="pl-4 text-3xl font-bold text-center text-slate-600">
          Featured products
        </div>
        <Search />
      </div>
      <ProductList />
      <Footer />
      <Link
        to="/addproduct"
        title="Sell a product"
        className="fixed px-5 pb-1 text-4xl font-extrabold text-white bg-blue-600 border-2 border-white rounded-full select-none hover:cursor-pointer hover: opacity-80 bottom-2 left-1/2"
      >
        +
      </Link>
    </>
  );
}
