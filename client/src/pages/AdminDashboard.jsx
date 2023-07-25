import Loading from "../components/Utilities/Loading";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Purchased from "../components/Utilities/Purchased";
import MyProducts from "../components/Utilities/MyProducts";
import Navbar from "../components/Navigation/Navbar";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/getall`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: sessionStorage.getItem("user") }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) return console.log(res.message);
        setStudents(res.users);
      })
      .catch((e) => console.log(e));
  }, []);
  const approve = (sid) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/approve/user`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: sessionStorage.getItem("user"), uid: sid }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        return window.alert(res.message);
      })
      .catch((e) => {
        setLoading(false);
        window.alert("cannot connect to server now.." + e);
      });
    window.location.reload();
  };
  const blacklist = (sid) => {
    setLoading(true);
    const message = window.prompt("Reasons to blacklist this user: ");
    if (!message || message === "") return window.alert("invalid message");
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/blacklist`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        id: sessionStorage.getItem("user"),
        uid: sid,
        message: message,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        return window.alert(res.message);
      })
      .catch((e) => {
        setLoading(false);
        window.alert("cannot connect to server now.." + e);
      });
    window.location.reload();
  };

  const whitelist = (sid) => {
    console.log(sid);
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/admin/whitelist`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ id: sessionStorage.getItem("user"), uid: sid }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        return window.alert(res.message);
      })
      .catch((e) => {
        setLoading(false);
        window.alert("cannot connect to server now.." + e);
      });
    window.location.reload();
  };
  return (
    <>
      <Navbar />
      <div className="bg-white">
        {loading && <Loading />}
        <MyProducts />
        {students && students.length > 0 && (
          <>
            <div className="mb-2 text-2xl font-bold text-center">
              List of Students
            </div>
            <div className="max-h-screen p-2 mx-2 mt-2 mb-6 overflow-auto border border-gray-600 rounded-md">
              <ul>
                {students.map((student) => (
                  <React.Fragment key={student._id}>
                    <li className="flex justify-between px-2 py-1 mt-1 text-xl">
                      <span>{student.name}</span>
                      <span>
                        {!student.approved && (
                          <span
                            className="hover:cursor-pointer"
                            onClick={() => approve(student._id)}
                            title="approve user"
                          >
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
                        {student.blacklisted && (
                          <span
                            className="hover:cursor-pointer"
                            onClick={() => whitelist(student._id)}
                            title="remove from blacklist"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 text-pink-400"
                            >
                              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                              <path
                                fillRule="evenodd"
                                d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                        {!student.blacklisted && (
                          <span
                            className="hover:cursor-pointer"
                            onClick={() => blacklist(student._id)}
                            title="blacklist user"
                          >
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
            </div>
          </>
        )}
        <Purchased />
        <Link
          to="/addproduct"
          title="Sell a product"
          className="fixed px-5 pb-1 text-4xl font-extrabold text-white bg-blue-600 border-2 border-white rounded-full select-none hover:cursor-pointer hover: opacity-80 bottom-2 left-1/2"
        >
          +
        </Link>
      </div>
    </>
  );
}
