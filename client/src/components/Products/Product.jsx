import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../Utilities/Loading";

export default function Product() {
  const { id } = useParams();
  const [isowner, setIsowner] = useState(false);
  const [isadmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("isAdmin")) setIsAdmin(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/product/viewone/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/auth/view/${res.product.sellerId}`
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.success) setSeller(res);
            })
            .catch((e) => console.log(e));
          setProduct(res.product);
          if (res.product.sellerId === sessionStorage.getItem("user"))
            setIsowner(true);
        } else window.alert(res.message);
        setLoading(false);
      })
      .catch((e) => {
        window.alert("cannot view the product at the moment" + e);
        navigate("/");
        setLoading(false);
      });
  }, []);

  const removeProduct = () => {
    const id = sessionStorage.getItem("user");
    if (isowner) {
      const ans = window.confirm("Are you sure to delete this product?");
      if (!ans) return;
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/product/remove/${id}/${product._id}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) return window.alert(res.message);
          window.alert("product removed successfully");
          return navigate("/dashboard");
        })
        .catch((e) => window.alert("Try again later" + e));
    } else if (isadmin) {
      const message = window.prompt("Mention reasons to remove this product?");
      if (!message || message === "") return window.alert("invalid message");
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ id: id, pid: product._id, message: message }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) return window.alert(res.message);
          window.alert("product deleted and student is notified about it");
          navigate("/");
        })
        .catch((e) => window.alert("try again later" + e));
    }
  };
  // logic to buy a product
  const initPayment = (data) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: product.name,
      description: product.description,
      image: product.img,
      order_id: data.id,
      handler: async (response) => {
        let data;
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(response),
        })
          .then((res) => res.json())
          .then((res) => {
            data = res;
            if (res.success)
              window.alert(
                "payment successful\nYou can take the product from the seller hostel"
              );
            else window.alert("payment unsuccessful");
            navigate("/dashboard");
            console.log(data);
          })
          .catch((e) => console.log(e));
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    let data;
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/payment/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        name: product.name,
        amount: product.price,
        pid: product._id,
        sid: product.sellerId,
        uid: sessionStorage.getItem("user"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        data = res;
        initPayment(data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const approve = () => {
    const id = sessionStorage.getItem("user");
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/approve/product`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: id, pid: product._id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) return window.alert(res.message);
        window.alert("product verified and can be purchased now");
        navigate("/");
      })
      .catch((e) => window.alert("try again later" + e));
  };
  return (
    <div className="bg-white">
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="my-3 text-3xl font-bold text-center">
            {product.name}
          </div>
          <div className="pt-6">
            {/* Image gallery */}
            <div className="max-w-2xl mx-auto mt-6 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
              <div className="hidden overflow-hidden rounded-lg aspect-w-3 aspect-h-4 lg:block">
                <img
                  src={product.image}
                  alt="1st image"
                  className="object-center "
                />
              </div>
              <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                <div className="overflow-hidden rounded-lg aspect-w-3 aspect-h-2">
                  <img
                    src={product.image}
                    alt="1st image"
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <div className="overflow-hidden rounded-lg aspect-w-3 aspect-h-2">
                  <img
                    src={product.image}
                    alt="1st image"
                    className="object-cover object-center w-full h-full"
                  />
                </div>
              </div>
              <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
                <img
                  src={product.image}
                  alt="1st image"
                  className="object-cover object-center w-full h-full"
                />
              </div>
            </div>

            {/* Product info */}
            <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
              <div className="flex lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>
                {(isowner || isadmin) && (
                  <span
                    onClick={removeProduct}
                    title="delete this product?"
                    className="ml-4 font-bold tracking-tight text-gray-900 hover:cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <div className="mt-4 lg:mt-0 lg:row-span-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  ₹{product.price}/-
                </p>
                <p className="text-xl tracking-tight text-gray-900">
                  {product.rating === -1 ? "unrated" : product.rating}⭐
                </p>
                <p className="text-xl tracking-tight text-gray-900">
                  {product.approved ? (
                    <span title="verified">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span title="not verified">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  )}
                  {!isowner && (
                    <button
                      onClick={product.approved ? handlePayment : null}
                      className={
                        (product.approved
                          ? "hover:bg-blue-600 "
                          : "cursor-not-allowed ") +
                        "px-2 py-1 text-white bg-blue-400 rounded-md "
                      }
                    >
                      Buy
                    </button>
                  )}
                  {!product.approved && (
                    <p className="text-sm italic text-gray-600 ">
                      *you cannot buy a product unless it is verified by admins
                    </p>
                  )}
                </p>
                {isadmin && !product.approved && (
                  <div
                    onClick={approve}
                    title="approve this product"
                    className="hover:cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                  <div className="mt-4">
                    <ul
                      role="list"
                      className="pl-4 space-y-2 text-sm list-disc"
                    >
                      {product.tags.map((tag) => (
                        <li key={tag} className="text-gray-400">
                          <span className="text-gray-600">{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">
                    Seller details
                  </h2>

                  <div className="mt-4 space-y-6">
                    <div className="text-sm text-gray-600">
                      {seller === null ? (
                        "Not found"
                      ) : (
                        <>
                          <div>name: {seller.name}</div>
                          <div>email: {seller.email}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
