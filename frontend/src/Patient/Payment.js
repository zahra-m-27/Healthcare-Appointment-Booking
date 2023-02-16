import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Basic/Navbar";
import Leftside from "../Dashbaord/LeftsidePatient";
import StripeCheckoutButton from "react-stripe-checkout";
import { toast } from "react-toastify";
import { faker } from "@faker-js/faker";

const Payment = (props) => {
  const [finalBalance, setFinalBalance] = useState(0);
  const history = useHistory();
  const { dateId, doctor, slotId } = props.location.data;

  const bookSlot = async () => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/doctors/book-slot/`,
      {
        patientId: JSON.parse(localStorage.getItem("user"))._id,
        patientName: JSON.parse(localStorage.getItem("user")).name,
        slotId: slotId,
        dateId: dateId,
        doctorId: doctor._id,
      }
    );
    // Add meet link
    Axios.put(
      `${process.env.REACT_APP_SERVER_URL}/appointments/add-meet-link`,
      {
        appointmentId: data._id,
      }
    ).then((x) => {
      console.log(`Updated Meet Link from frontend!`);
    });
  };

  useEffect(() => {
    setFinalBalance(1.18 * doctor.feesPerSession);
  }, []);

  const makePayment = async (token) => {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_SERVER_URL}/patients/payment`,
      {
        token,
        finalBalance: finalBalance,
      }
    );

    if (data) {
      await bookSlot();
      setFinalBalance(0);
      toast("Appointment booked successfully", {
        type: "success",
      });
      history.push("/patient/searchdoctor");
    }
  };

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
            className="col-9 col-md-9 p-4 "
            style={{
              border: "15px solid yellow ",
              height: "80vh",
              backgroundColor: "#6c757d",
            }}
          >
            <div className="container text-white">
              <div className="row">
                <div className="well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <address>
                        <strong>{faker.company.name()}</strong>
                        <p>
                          {faker.address.street()},{" "}
                          {faker.address.cityName() +
                            " " +
                            faker.address.stateAbbr()}
                          , {faker.address.country()}
                        </p>
                        Phone Number: {doctor.phoneNumber}
                      </address>
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-center">
                      <h1>Receipt</h1>
                    </div>
                    <table className="table table-hover text-white">
                      <thead>
                        <tr>
                          <th>Doctor Name</th>
                          <th>Specialization</th>

                          <th className="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="col-md-9">
                            <em>{doctor.name}</em>
                          </td>
                          <td
                            className="col-md-1"
                            style={{ textAlign: "center" }}
                          >
                            {doctor.specialization}
                          </td>

                          <td className="col-md-1 text-center">
                            {doctor.feesPerSession}
                          </td>
                        </tr>

                        <tr>
                          <td> &nbsp; </td>

                          <td className="text-right">
                            <p>
                              <strong>Tax:&nbsp;</strong>
                            </p>
                          </td>
                          <td className="text-center">
                            <p>
                              <strong>{0.18 * doctor.feesPerSession}</strong>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td> &nbsp; </td>

                          <td className="text-right">
                            <h4>
                              <strong>Total:&nbsp;</strong>
                            </h4>
                          </td>
                          <td className="text-center text-danger">
                            <h4>
                              <strong>{finalBalance}</strong>
                            </h4>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <StripeCheckoutButton
                      stripeKey="pk_test_51MCK6eANMreWJyGp42zeb6pqJ5WBOBViyYVyxhk4xUIxOE3zJuEVD14nrkV4q4CvGEMpYgBNKeaTSfUBNmJCpyrc006VFSFNgK"
                      token={makePayment}
                      amount={finalBalance * 100}
                      name="Place Appointment"
                      shippingAddress
                      billingAddress
                    >
                      <button
                        type="button"
                        className="btn btn-success btn-lg btn-block"
                      >
                        Pay Now&nbsp;&nbsp;&nbsp;
                        <span className="glyphicon glyphicon-chevron-right" />
                      </button>
                    </StripeCheckoutButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
