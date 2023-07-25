import React, { useEffect, useState } from "react";
import Loading from "./Loading";

//list of products that a particular user has purchased
export default function Purchased() {
  const user = sessionStorage.getItem("user");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/product/purchased/${user}`)
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.products);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <div className="my-3 text-3xl font-bold text-center">
        Products you ordered / seen
      </div>
      {loading && <Loading />}
      {!loading && products.length === 0 && <div>No products found</div>}
      {!loading && (
        <ul className="max-h-screen p-2 mx-2 mt-2 mb-6 overflow-auto border border-gray-600 rounded-md">
          {products.map((product) => (
            <React.Fragment key={product.product_id}>
              <li className="flex justify-between px-2 py-1 mt-1 text-xl">
                <span>{product.product_name}</span>
                <span>₹{product.amount}</span>
                <span>
                  {product.purchased && (
                    <span title="purchased">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="inline w-6 h-6 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  {!product.purchased && (
                    <span title="not purchased">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="inline w-6 h-6 text-red-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </span>
              </li>
              <hr className="text-3xl text-gray-500" />
            </React.Fragment>
          ))}
        </ul>
      )}
    </>
  );
}
