import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import PatientLoginForm from "../Patient/PatientLoginForm";

const PatientLogin = () => {
  return (
    <div>
      <div style={{ height: "71vh" }}>
        <Navbar />
        <PatientLoginForm />
      </div>

      <div className="fixed-bottom" style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default PatientLogin;
