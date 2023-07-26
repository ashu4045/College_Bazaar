import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import AddProduct from "./components/Products/AddProduct";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Product from "./components/Products/Product";
import AdminDashboard from "./pages/AdminDashboard";
import Help from "./pages/Help";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}></Route>
      <Route
        path="/dashboard"
        element={
          sessionStorage.getItem("isAdmin") ? <AdminDashboard /> : <Dashboard />
        }
      ></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/addproduct" element={<AddProduct />}></Route>
      <Route path="/product/details/:id" element={<Product />}></Route>
      <Route path="/help" element={<Help />}></Route>
    </Routes>
  );
};
