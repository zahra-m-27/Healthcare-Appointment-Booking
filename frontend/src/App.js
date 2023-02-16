import React, { useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import DoctorLogin from "./Pages/DoctorLogin";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PatientDashboard from "./Pages/PaitentDashboard";
import Error from "./Pages/Error";
import { AuthContext } from "./Auth/AuthContext";
import PhoneNumber from "./components/PhoneNumber";
import PersonalDetails from "./Doctor/PersonalDetails";
import SearchDoctor from "./Patient/SearchDoctor";
import PreviousAppointments from "./Patient/PerviousAppointments";
import SelectDate from "./Patient/SelectDate";
import BookingSlots from "./Doctor/BookingSlots";
import Payment from "./Patient/Payment";
import DoctorPreviousAppointments from "./Doctor/DoctorPreviousAppointments";
import UpcomingAppointments from "./Patient/UpcomingAppointments";
import PatientFeedback from "./Patient/PatientFeedback";
import FeedbackDetails from "./Doctor/FeedbackDetails";
import PatientLogin from "./Pages/PatientLogin";
import PatientSignUp from "./Pages/PatientSignUp";
import DoctorSignUp from "./Pages/DoctorSignUp";
import DoctorCompleteInfo from "./Doctor/DoctorCompleteInfo";

function App() {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [id, setId] = useState(window.localStorage.getItem("id"));

  return (
    <Router>
      <AuthContext.Provider value={{ token, setToken, id, setId }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/doctorlogin" component={DoctorLogin} />
          <Route exact path="/doctorsignup" component={DoctorSignUp} />
          <Route exact path="/patientlogin" component={PatientLogin} />
          <Route exact path="/patientsignup" component={PatientSignUp} />
          <Route exact path="/doctor" component={DoctorDashboard} />
          <Route exact path="/doctor/update" component={DoctorCompleteInfo} />
          <Route exact path="/patient/searchdoctor" component={SearchDoctor} />
          <Route exact path="/patient" component={PatientDashboard} />
          <Route exact path="/patient/update-phone" component={PhoneNumber} />
          <Route
            exact
            path="/patient/previousappointments"
            component={PreviousAppointments}
          />
          <Route
            exact
            path="/doctor/perosnaldetails"
            component={PersonalDetails}
          />
          <Route
            exact
            path="/doctor/previous-appointments"
            component={DoctorPreviousAppointments}
          />
          <Route
            exact
            path="/doctor/feedback/:id"
            component={FeedbackDetails}
          />
          <Route exact path="/patient/selectdate" component={SelectDate} />
          <Route exact path="/patient/book-slot" component={BookingSlots} />
          <Route exact path="/patient/payment" component={Payment} />
          <Route
            exact
            path="/patient/upcoming-appointments"
            component={UpcomingAppointments}
          />
          <Route
            exact
            path="/patient/feedback/:id"
            component={PatientFeedback}
          />
          <Route path="*" component={Error} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
