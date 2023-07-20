import { React, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routing } from "./Routing";

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    //checking whether user is logged in / cookie expired
    if (sessionStorage.getItem("user")) {
      setUser(sessionStorage.getItem("user"));
    } else {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/checkUser`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.success) {
            console.log(res);
            sessionStorage.setItem("user", res._id);
            sessionStorage.setItem("user_name", res.name);
            sessionStorage.setItem("isAdmin", res.isAdmin);
            sessionStorage.setItem("photo", res.photo);
            setUser(res.user);
          }
        })
        .catch((e) => console.log(e));
    }
  }, []);
  return (
    <>
      <Router>
        <Routing user={user} setUser={setUser} />
      </Router>
    </>
  );
}
