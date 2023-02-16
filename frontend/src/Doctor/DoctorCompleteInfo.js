import React from "react";
import Footer from "../Basic/Footer";
import Navbar from "../Basic/Navbar";
import InformationCompleteForm from "./InformationCompleteForm";

const DoctorCompleteInfo = () => {
  return (
    <div>
      <div style={{ height: "71vh" }}>
        <Navbar />
        <InformationCompleteForm />
      </div>

      <div className="fixed-bottom" style={{ width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default DoctorCompleteInfo;
