import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Result from "./pages/Results.jsx";
import BuyCredit from "./pages/BuyCredit.jsx";
import Footer from "./components/Footer.jsx";
import { useContext } from "react";
import { AppContext } from "./context/AppContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  const { showLogin } = useContext(AppContext);
  return (
    <div className="px-4 sm:p x-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-pink-50">
      <ToastContainer />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
