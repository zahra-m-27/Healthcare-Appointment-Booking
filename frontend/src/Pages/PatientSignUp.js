import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import PatientSignUpForm from "../Patient/PatientSignUpForm";

const PatientSignUp = () => {
  return (
    <div>
      <div style={{ height: "71vh" }}>
        <Navbar />
        <PatientSignUpForm />
      </div>

      <div className="fixed-bottom" style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default PatientSignUp;
