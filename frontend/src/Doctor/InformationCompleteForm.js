import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  CardHeader,
  CardBody,
  FormGroup,
  CardFooter,
  Button,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import specializations from "./specialization";

const CompleteInformation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [feesPerSession, setFeesPerSession] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const id= localStorage.getItem("doctorId");
  const history = useHistory();
  const options = [];

  for (let i = 0; i < specializations.length; i++) {
    options.push(specializations[i]);
  }

  async function update() {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/doctors/update/`,
        {
          _id: id,
          name: name,
          phoneNumber: phoneNumber,
          specialization: specialization,
          feesPerSession: feesPerSession,
        }
      );
      const token = res.data.token;

      if (res.status === 200) {
        window.localStorage.setItem("token", token);
        setToken(token);
        history.push("/doctor/perosnaldetails");
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (token) {
    return <Redirect to="/doctor" />;
  }
  return (
    <Container className="text-center">
      <Row>
        <Col lg={6} className="offset-lg-3 mt-5 ">
          <Card>
            <Form>
              <CardHeader className="">
                Please Complete Your Information
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label for="name" sm={3}>
                    Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="provide your name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="phoneNumber" sm={3}>
                    Phone Number
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="your phoneNumber here"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="specialization" sm={3}>
                    Specialization
                  </Label>
                  <Col sm={5}>
                    <select
                      style={{ padding: "8px" }}
                      name="specialization"
                      id="specialization"
                      onChange={(e) => setSpecialization(e.target.value)}
                    >
                      <option>Provide your specialization</option>
                      {options.map((option, index) => {
                        return <option key={index}>{option}</option>;
                      })}
                    </select>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="feesPerSession" sm={3}>
                    Fees Per Session
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="feesPerSession"
                      id="feesPerSession"
                      placeholder="provide your feesPerSession"
                      onChange={(e) => setFeesPerSession(e.target.value)}
                      onKeyPress={(target) => {
                        if (target.charCode === 13) {
                          update();
                        }
                      }}
                    />
                  </Col>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <Button block color="primary" onClick={update}>
                  Complete
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompleteInformation;
