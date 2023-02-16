import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../Basic/Navbar";
import "../Dashbaord/dashboard.css";
import Leftside from "../Dashbaord/LeftsidePatient";

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchAppointments = async () => {
      let { data } = await Axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/upcoming-appointments/`,
        {
          patientId: JSON.parse(localStorage.getItem("user"))._id,
        }
      );
      setAppointments(data);
    };

    fetchAppointments();
    setIsLoading(false);
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
          {isLoading && <h1>Loading</h1>}
          {!isLoading && (
            <div
              className="col-9 col-md-9 p-4"
              style={{
                border: "15px solid yellow ",
                height: "80vh",
                backgroundColor: "#6c757d",
              }}
            >
              <table className="table table-hover table-dark">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Doctor Name</th>
                    <th scope="col">Meet Link</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((Appointment) => (
                    <tr key={Appointment._id}>
                      <th scope="row">{Appointment.date}</th>
                      <th scope="row">{Appointment.slotTime}</th>
                      <th scope="row">{Appointment.doctorName}</th>
                      <th scope="row">
                        <a href={Appointment.googleMeetLink} rel="noreferrer" target="_blank">
                          Join Meet
                        </a>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
