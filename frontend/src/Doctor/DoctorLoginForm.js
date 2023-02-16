import React, { useContext, useState } from "react";
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
import { AuthContext } from "../Auth/AuthContext";

const DoctorLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(0);
  const { token, setToken, id, setId } = useContext(AuthContext);
  const history = useHistory();

  async function login() {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/doctors/login/`,
        {
          username: username,
          password: password,
        }
      );
      setStatus(res.status);

      const token = res.data.token;
      const doctorUniqueId = res.data.doctorUniqueId;
      const doctorId = res.data.doctorId;

      if (res.status === 200) {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("id", doctorUniqueId);
        window.localStorage.setItem("doctorId", doctorId);

        setId(doctorUniqueId);
        setToken(token);
        history.push("/doctor");
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
              <CardHeader className="">Welcome back</CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label for="email" sm={3}>
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
                      onKeyPress={(target) => {
                        if (target.charCode === 13) {
                          login();
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
                    Wrong username or password! Please try again
                  </p>
                )}
              </CardBody>
              <CardFooter>
                <Button block color="primary" onClick={login}>
                  Sign In
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorLoginForm;
