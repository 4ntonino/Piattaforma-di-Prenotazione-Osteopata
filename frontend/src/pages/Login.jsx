
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, confirmPassword, role: "Paziente" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        navigateTo("/");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Container 
      className="d-flex justify-content-center align-items-center min-vh-100" 
      style={{ background: "l" }}
    >
      <Row className="w-100">
        <Col md={5} lg={4} className="mx-auto">
          <Card 
            className="shadow-lg p-4 border-0" 
            style={{ borderRadius: "15px", background: "#ffffffd9" }}
          >
            <Card.Body>
              <h2 className="mb-4 text-center" style={{ fontWeight: "600", color: "#333" }}>Sign In</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="text-muted">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 border-bottom rounded-0"
                    style={{ boxShadow: "none", paddingLeft: "0" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="text-muted">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 border-bottom rounded-0"
                    style={{ boxShadow: "none", paddingLeft: "0" }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label className="text-muted">Conferma la Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Conferma la Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-0 border-bottom rounded-0"
                    style={{ boxShadow: "none", paddingLeft: "0" }}
                  />
                </Form.Group>

                <Button 
                  variant="dark" 
                  type="submit" 
                  className="w-100 mb-3"
                  style={{
                    padding: "10px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    backgroundColor: "#271776",
                    borderColor: "#271776",
                    borderRadius: "30px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#3a20b4"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#271776"}
                >
                  Login
                </Button>

                <div className="text-center">
                  <p className="mb-0 text-muted">Non sei registrato?</p>
                  <Link 
                    to="/register" 
                    className="text-dark text-decoration-none"
                    style={{ fontWeight: "500" }}
                  >
                    Registrati
                  </Link>
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