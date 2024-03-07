import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

const Card = ({ login, Image, link }) => {
  const { token } = useContext(AuthContext);
  const isDoctor = localStorage.getItem('doctorId');

  return (
    <div className="card mb-3" style={{ width: "18rem" }}>
      <img src={Image} className="card-img-top" alt="..." height="240" />
      <div className="card-body">
        {!token && login === "Doctor" && (
          <Link
            to={link}
            className="btn btn-primary justify-content-center w-100"
          >
            Login As A Doctor
          </Link>
        )}
        {token && login === "Doctor" && (
          <Link
            to={link}
            className="btn btn-primary justify-content-center w-100"
            hidden={!isDoctor}
          >
            My Dashboard
          </Link>
        )}
        {!token && login === "Patient" && (
          <Link
            to={link}
            className="btn btn-primary justify-content-center w-100"
          >
            Login As A Patient
          </Link>
        )}
        {token && login === "Patient" && (
          <Link
            to={link}
            className="btn btn-primary justify-content-center w-100"
            hidden={isDoctor}
          >
            My Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;
