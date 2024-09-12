import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    doctorDepartment: "",
  });
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Visita Osteopatica",
    "Osteopatia Pediatrica",
    "Ginnastica Posturale",
    "Taping Elastico",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append("docAvatar", docAvatar);

      const res = await axios.post(
        "http://localhost:4000/api/v1/user/doctor/addnew",
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
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
        doctorDepartment: "",
      });
      setDocAvatar("");
      setDocAvatarPreview("");
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
        <Col md={10} lg={8}>
          <Card className="shadow">
            <Card.Body>
              <div className="text-center mb-4">
                <img src="/logo.png" alt="logo" className="img-fluid mb-3" style={{maxWidth: '200px'}} />
                <h2 className="form-title">Aggiungi un Dottore</h2>
              </div>
              <Form onSubmit={handleAddNewDoctor}>
                <Row>
                  <Col md={4} className="mb-3">
                    <Image
                      src={docAvatarPreview || "/docHolder.jpg"}
                      alt="Avatar del dottore"
                      fluid
                      rounded
                      className="mb-2"
                    />
                    <Form.Group>
                      <Form.Control
                        type="file"
                        onChange={handleAvatar}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Nome"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Cognome"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Row>
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
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select
                        name="doctorDepartment"
                        value={formData.doctorDepartment}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleziona Specializzazione</option>
                        {departmentsArray.map((depart, index) => (
                          <option value={depart} key={index}>
                            {depart}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg">
                        Registra Nuovo Dottore
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddNewDoctor;