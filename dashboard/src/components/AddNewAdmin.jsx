import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
  });

  const navigateTo = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/admin/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <img src="/logo.png" alt="logo" className="img-fluid mb-3" style={{maxWidth: '200px'}} />
                <h2 className="form-title">Aggiungi Admin</h2>
              </div>
              <Form onSubmit={handleAddNewAdmin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Nome"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Cognome"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Cellulare"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleziona genere</option>
                    <option value="Uomo">Uomo</option>
                    <option value="Donna">Donna</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Aggiungi Admin
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

export default AddNewAdmin;