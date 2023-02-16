import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import DoctorSignUpForm from "../Doctor/DoctorSignUpForm";

const DoctorSignUp = () => {
  return (
    <div>
      <div style={{ height: "71vh" }}>
        <Navbar />
        <DoctorSignUpForm />
      </div>

      <div className="fixed-bottom" style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default DoctorSignUp;
