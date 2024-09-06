import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Admin" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Image src="/IlariaCaltagirone.png" alt="logo" fluid style={{ maxHeight: '300px'}} />
              </div>
              <h2 className="text-center mb-4">Accedi All'area riservata</h2>
              <p className="text-center text-muted mb-4">Ilaria Caltagirone | Accesso consentito ai soli admin!</p>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Control
                    type="password"
                    placeholder="Conferma Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;