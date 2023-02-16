import React from "react";
import Card from "./Card";

import doctorLogin from "../image/doctorlogin.png";
import patientLogin from "../image/patientlogin.png";

const LoginButton = () => {
  return (
    <div className="d-flex flex-md-row flex-column justify-content-around align-items-center my-4">
      <Card
        LoginButton="Doctor"
        login="Doctor"
        Image={doctorLogin}
        link={"/doctorlogin"}
      />
      <Card
        LoginButton="Patient"
        login="Patient"
        Image={patientLogin}
        link={"/patientlogin"}
      />
    </div>
  );
};

export default LoginButton;
