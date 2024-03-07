import React, { useEffect, useState } from "react";
import Navbar from "../Basic/Navbar";
import LeftSide from "../Dashbaord/LeftsideDoctor";
import "../Dashbaord/dashboard.css";
import Axios from "axios";
import {Button} from "reactstrap";
import {useHistory} from "react-router-dom";

const PersonalDetails = () => {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem("doctorId");
  const history = useHistory();


  useEffect(() => {
    setLoading(true);
    const getDoctorDetails = async () => {
      const res = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}/doctors/getDoctorDetails/${doctorId}`
      );
      if (res.status === 200) {
        setDoctor(res.data);
        window.localStorage.setItem("user", JSON.stringify(res.data));
        setLoading(false);
      } else {
        console.log(res.data.message);
        setLoading(false);
      }
    };
    getDoctorDetails();
  }, [doctorId]);
  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navbar />
      {loading ? (
        <div className="row justify-content-center position-relative">
          <div
            className="spinner-border align-middle d-flex justify-content-center position-absolute top-50 start-50 translate-middle"
            style={{ width: "10rem", height: "10rem" }}
            role="status"
          ></div>
        </div>
      ) : (
        <div>
          <div className="row m-5" style={{ maxWidth: "100%" }}>
            <div
              className="col-3 col-md-3 p-4 bg-white "
              style={{ height: "80vh" }}
            >
              <LeftSide />
            </div>
            <div
              className="col-9 col-md-9 p-4"
              style={{
                border: "15px solid yellow ",
                height: "80vh",
                backgroundColor: "#6c757d",
              }}
            >
              <div className="card mb-4">
                <h4 className="card-header">Personal Details</h4>
                <ul className="list-group">
                  <li className="list-group-item">
                    <span className="badge badge-info mr-2 p-2 text-uppercase ">
                      Name:
                    </span>
                    <span className="text-capitalize">{doctor.name}</span>
                  </li>
                  <li className="list-group-item">
                    <span className="badge badge-info mr-2 p-2 text-uppercase">
                      Specialization:
                    </span>
                    <span className="text-capitalize">
                      {doctor.specialization}
                    </span>
                  </li>
                  <li className="list-group-item">
                    <span className="badge badge-info mr-2 p-2 text-uppercase">
                      Email:
                    </span>
                    {doctor.email}
                  </li>
                  <li className="list-group-item">
                    <span className="badge badge-info mr-2 p-2 text-uppercase">
                      Fees Per Session:
                    </span>
                    {doctor.feesPerSession}
                  </li>
                </ul>
                <Button
                    size="sm"
                    color="info"
                    className="ml-auto"
                    style={{ padding: "1% 10%", fontSize: "17px" }}
                    onClick={() => {
                      history.push("/doctor/update");
                    }}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PersonalDetails;
