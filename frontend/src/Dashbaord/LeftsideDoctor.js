import React from "react";
import Option from "./Option";
import "./dashboard.css";
import { Link } from "react-router-dom";

const LeftsideDoctor = () => {
  return (
    <div>
      <ul className="mt-5">
        <li style={{ width: "25vw" }}>
          <Link to="/doctor">
            <Option Value="Today's Schedule" Option="today" />
          </Link>
        </li>
        <li style={{ width: "25vw" }}>
          <Link to="/doctor/perosnaldetails">
            <Option Value="Personal Details" />
          </Link>
        </li>
        <li style={{ width: "25vw" }}>
          <Link to="/doctor/previous-appointments">
            <Option Value="Previous Appointments" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftsideDoctor;
