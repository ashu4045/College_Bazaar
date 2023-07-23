import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Loading from "../Utilities/Loading";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("user") && sessionStorage.getItem("user") !== "")
      navigate("/dashboard");
  }, []);
  const login = (e) => {
    //send request to backend here
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    if (!email || email === "")
      return window.alert("Please enter a valid email");
    if (!password || password.length < 6)
      return window.alert("Enter your correct password");
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          setLoading(false);
          return window.alert(res.message);
        }
        sessionStorage.setItem("user", res._id);
        sessionStorage.setItem("user_name", res.name);
        sessionStorage.setItem("isAdmin", res.isAdmin);
        sessionStorage.setItem("photo", res.photo);
        setLoading(false);
        return navigate("/dashboard");
      })
      .catch((err) => {
        window.alert("cannot process request at this moment");
        setLoading(false);
      });
  };
  return (
    <>
      {loading && <Loading />}
      <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="w-24 h-auto mx-auto"
              src="images/logo.png"
              alt="Logo"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-center text-gray-600"></p>
          </div>
          <form className="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  ref={emailRef}
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passRef}
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  to="/signup"
                >
                  Create new Account
                </Link>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgetpassword"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {" "}
                  Forgot your password?{" "}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={login}
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
