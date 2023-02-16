import React, { useState, useEffect } from "react";
import Axios from "axios";
import Scrollbar from "react-scrollbars-custom";
import Navbar from "../Basic/Navbar";
import "../Dashbaord/dashboard.css";
import StarPicker from "react-star-picker";
import Leftside from "../Dashbaord/LeftsideDoctor";
import { Link } from "react-router-dom";

const DoctorPreviousAppointments = () => {
  const [Appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/doctors/previous-appointments/`,
      {
        doctorId: localStorage.getItem("doctorId"),
      }
    );
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navbar />
      <div>
        <div className="row m-5" style={{ maxWidth: "100%" }}>
          <div
            className="col-3 col-md-3 p-4 bg-white "
            style={{ height: "80vh" }}
          >
            <Leftside />
          </div>
          <div
            className="col-9 col-md-9 p-3"
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <Scrollbar
              noScrollX
              style={{ position: "", height: "73vh", width: "150vh" }}
              className="col-12 col-md-12"
            >
              <table className="table table-hover table-dark">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Patient Name</th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Appointments.map((Appointment) => (
                    <tr>
                      <th scope="row">{Appointment.date}</th>
                      <th scope="row">{Appointment.slotTime}</th>
                      <th scope="row">{Appointment.patientName}</th>
                      {Appointment.feedback.given ? (
                        <th
                          scope="row"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <StarPicker
                            value={Appointment.feedback.stars}
                            size="20"
                          ></StarPicker>
                          <Link to={`/doctor/feedback/${Appointment._id}`}>
                            Details
                          </Link>
                        </th>
                      ) : (
                        <th
                          scope="row"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          -
                        </th>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scrollbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPreviousAppointments;
