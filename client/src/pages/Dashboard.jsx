import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navigation/Navbar";
import MyProducts from "../components/Utilities/MyProducts";
import Purchased from "../components/Utilities/Purchased";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white">
      <Navbar />
      <MyProducts />
      <Purchased />
      <Link
        to="/addproduct"
        title="Sell a product"
        className="fixed px-5 pb-1 text-4xl font-extrabold text-white bg-blue-600 border-2 border-white rounded-full select-none hover:cursor-pointer hover: opacity-80 bottom-2 left-1/2"
      >
        +
      </Link>
    </div>
  );
}
