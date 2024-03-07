import React, {useContext, useState} from "react";
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
import {AuthContext} from "../Auth/AuthContext";

const PatientSignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState(0);
  const { token, setToken, id, setId } = useContext(AuthContext);
  const history = useHistory();

  async function signUp() {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/signup/`,
        {
          username: username,
          password: password,
          email: email,
          name: name,
          phoneNumber: phoneNumber,
        }
      );
      setStatus(res.status);

      const receivedToken = res.data.token;
      const patientId = res.data.patientId;

      if (res.status === 200) {
        window.localStorage.clear();
        window.localStorage.setItem("token", receivedToken);
        window.localStorage.setItem("id", patientId);

        setToken(receivedToken);
        setId(patientId);
        history.push("/patient");
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (token) {
    return <Redirect to="/patient" />;
  }
  return (
    <Container className="text-center">
      <Row>
        <Col lg={6} className="offset-lg-3 mt-5 ">
          <Card>
            <Form>
              <CardHeader className="">
                Dear Patient! Please sign up here
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label for="username" sm={3}>
                    Username
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="provide your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="password" sm={3}>
                    Password
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="your password here"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="email" sm={3}>
                    Email
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="provide your email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Col>
                </FormGroup>
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
                      onKeyPress={(target) => {
                        if (target.charCode === 13) {
                          signUp();
                        }
                      }}
                    />
                  </Col>
                </FormGroup>
                {status === 201 && (
                  <p
                    className="warning"
                    style={{ color: "red", fontSize: "15px" }}
                  >
                    Username in use! Wrong username or password! Please try
                    again
                  </p>
                )}
              </CardBody>
              <CardFooter>
                <Button block color="primary" onClick={signUp}>
                  Sign Up
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientSignUpForm;
