import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import DoctorLoginForm from "../Doctor/DoctorLoginForm";

const DoctorLogin = () => {
  return (
    <div>
      <div style={{ height: "71vh" }}>
        <Navbar />
        <DoctorLoginForm />
      </div>

      <div className="fixed-bottom" style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default DoctorLogin;
