import React, { useEffect, useRef, useState } from "react";
import Loading from "../Utilities/Loading";
import { useNavigate, Link } from "react-router-dom";
import { isLoggedIn } from "../../App";
export default function Signup({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    photo: "",
    isAdmin: false,
  });
  const navigate = useNavigate();
  const imageRef = useRef();
  useEffect(() => {
    if (user && user !== "") navigate(`/dashboard`);
  }, [user]);

  function handleChange(e, field) {
    //function to handle all the inputs, except image
    setFormdata({ ...formdata, [field]: e.target.value });
  }

  function handleImage() {
    //function to handle the image input
    const image = imageRef.current.files[0];
    if (image && image["type"].split("/")[0] === "image") {
      //continue only if file is an image.
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        let srcData = fileLoadedEvent.target.result; // <--- data: base64
        setFormdata({ ...formdata, photo: srcData });
      };
      fileReader.readAsDataURL(image);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmPassword) {
      return window.alert("passwords do not match");
    }
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/register`, {
      method: "POST",
      Credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    })
      .then((res) => res.json())
      .then((res) => {
        window.alert(res.message);
        setLoading(false);
      })
      .catch((err) => {
        window.alert("cannot process request at this moment");
        setLoading(false);
      });
  };
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user && user !== "") navigate("/dashboard");
  });
  return (
    <>
      {loading && <Loading />}
      <div className="mt-10 sm:mt-0">
        <div className="my-3 text-3xl font-bold text-center">
          Enter your details:
        </div>
        <div className="lg:grid lg:grid-cols-4 place-content-center md:gap-6">
          <div className="mt-5 md:mt-0 md:col-start-2 md:col-end-4">
            <form>
              <div className="overflow-hidden shadow-md sm:rounded-md">
                <div className="px-4 py-5 bg-white-700 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="email_address"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Email address
                      </label>
                      <input
                        type="text"
                        onChange={(e) => handleChange(e, "email")}
                        name="email_address"
                        id="email_address"
                        autoComplete="email"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        onChange={(e) => handleChange(e, "phone")}
                        name="phone"
                        id="phone"
                        autoComplete="phone"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        onChange={(e) => handleChange(e, "name")}
                        name="name"
                        id="name"
                        autoComplete="name"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Create Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => handleChange(e, "password")}
                        name="password"
                        id="password"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="confirm_password"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => handleChange(e, "confirmPassword")}
                        name="confirm_password"
                        id="confirm_password"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="gender"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        onChange={(e) => handleChange(e, "gender")}
                        name="gender"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      >
                        <option value="male" defaultChecked>
                          M
                        </option>
                        <option value="female">F</option>
                        <option value="others">others</option>
                      </select>
                      <label
                        htmlFor="admin"
                        className="block mb-2 text-sm font-bold text-gray-700"
                      >
                        Registering as
                      </label>
                      <select
                        id="isAdmin"
                        onChange={(e) => handleChange(e, "isAdmin")}
                        name="isAdmin"
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline"
                      >
                        <option value={false} defaultChecked>
                          Student
                        </option>
                        <option value={true}>Admin</option>
                      </select>
                    </div>

                    {/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                                        <label htmlFor="photo" className="block mb-2 text-sm font-bold text-gray-700">Upload Photo (max size:50kb)</label>
                                        <input type="file" accept='image/*' ref={imageRef} name="photo" onChange={(e) => handleImage()} id="photo" className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:border-indigo-500 focus:outline-none focus:shadow-outline" />
                                    </div> */}
                  </div>
                </div>
                <Link
                  className="inline-block text-sm font-normal text-blue-500 align-baseline hover:text-blue-800"
                  to="/login"
                >
                  Already registered? Log in
                </Link>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 sm:px-6">
                  {/* {   //for rendering image-->
                                    formdata.photo !== "" &&
                                    <img src={formdata.photo} alt='' className='w-20 h-20 rounded-3xl' />
                                } */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
