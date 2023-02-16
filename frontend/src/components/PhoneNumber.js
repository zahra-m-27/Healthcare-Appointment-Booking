import axios from "axios";
import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import { AuthContext } from "../Auth/AuthContext";
import Navbar from "../Basic/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function PhoneNumber() {
  const [number, setNumber] = useState();
  const { token, id } = useContext(AuthContext);
  const history = useHistory();

  async function updatePhoneNumber() {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/patients/update-phone`,
        {
          patientUniqueId: id,
          phoneNumber: number,
        }
      );
      console.log(id);
      if (res.status === 200) {
        history.push("/patient");
        toast.success("phone number updated", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        console.log(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!token) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <Navbar />
        <Container className="mt-5 p-5 bg-dark text-white w-50 center">
          <FormGroup>
            <Row>
              <Col>
                <Label for="number">
                  <h5>Phone Number</h5>
                </Label>
              </Col>
              <Col>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="provide your phone number"
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Col>
            </Row>
            <Button
              className="mt-4"
              block
              color="primary"
              onClick={updatePhoneNumber}
            >
              Add Phone Number
            </Button>
          </FormGroup>
        </Container>
      </div>
    );
  }
}

export default PhoneNumber;
