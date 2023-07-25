import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";

export default function MyProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/api/product/view/${sessionStorage.getItem("user")}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProducts(res.products);
        } else window.alert(res.message);
        setLoading(false);
      })
      .catch((e) => window.alert("cannot get the products at the moment" + e));
  });
  return (
    <>
      <div className="my-3 text-3xl font-bold text-center">My Products</div>
      {loading && <Loading />}
      {!loading && products.length === 0 && (
        <div className="mt-3 text-center">No products found</div>
      )}

      {!loading && (
        <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/details/${product._id}`}
                className="group"
              >
                <div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={product.image}
                    alt="product-image"
                    className="object-cover object-center w-full h-full group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ₹{product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
