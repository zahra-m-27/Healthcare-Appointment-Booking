import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../image/navbaricon1.png";
import { AuthContext } from "../Auth/AuthContext";

const Navbar = () => {
  const { setToken, setId } = useContext(AuthContext);
  const history = useHistory();
  const token = localStorage.getItem("token");

  const logOut = () => {
    localStorage.clear();
    setToken(null);
    setId(null);
    history.push("/");
  };

  const signUpAsPatient = () => {
    history.push("/patientsignup");
  };

  const signUpAsDoctor = () => {
    history.push("/doctorsignup");
  };

  return (
    <nav
      className="navbar navbar-dark bg-dark navbar-expand-lg pl-4 pr-4 w-100 "
      style={{ backgroundColor: " #1a1a1a" }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src={logo}
          alt=""
          width="30"
          height="24"
          className="d-inline-block align-top mr-2 mt-1"
        ></img>
        Hospital Management System
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="collapsibleNavbar">
        <ul className="navbar-nav ml-auto text-light bg-dark">
          <li className="navbar-item" style={{ textAlign: "right" }}>
            <link to="/" className="nav-link " style={{ padding: 0 }} />
            {!token && (
              <div
                style={{
                  border: "ridge",
                  borderColor: "#8bc2ff",
                  width: "fit-content",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                SignUp As A{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={signUpAsPatient}
                >
                  Patient
                </span>{" "}
                /{" "}
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={signUpAsDoctor}
                >
                  Doctor
                </span>
              </div>
            )}
            {token && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={logOut}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
