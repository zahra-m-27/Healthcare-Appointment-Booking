import React, { useState } from "react";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsidePatient";
import "react-calendar/dist/Calendar.css";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

const SelectDate = (props) => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };
  let previous = new Date();
  previous.setDate(previous.getDate() - 1);
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
            className="col-9 col-md-9 p-4"
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <div className="d-flex justify-content-center">
              <div>
                <Calendar
                  tileDisabled={({ date }) =>
                    date.getDay() === 0 || date < previous
                  }
                  onChange={onChange}
                  value={date}
                />
                <p class="text-center">
                  {date.getFullYear().toString() +
                    "-" +
                    (date.getMonth() + 1).toString() +
                    "-" +
                    date.getDate().toString()}
                </p>
              </div>
            </div>
            <div className="row justify-content-center mt-5 ml-5">
              <div className="col-2">
                <Link to="/patient/searchdoctor">
                  <Button color="danger">GO BACK</Button>
                </Link>
              </div>
              <div className="col-4">
                <Link
                  to={{
                    pathname: "/patient/book-slot",
                    state: {
                      date: date,
                      doctor: props.location.doctor.doctor,
                    },
                  }}
                >
                  <Button color="primary">Confirm And Go to Next Step</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDate;
