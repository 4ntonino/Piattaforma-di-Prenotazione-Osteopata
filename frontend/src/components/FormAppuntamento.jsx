


import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../main';

const FormAppuntamento = () => {
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    dob: '',
    gender: '', 
    appointmentDate: '', 
    department: 'Visita Osteopatica',
    doctorFirstName: '', 
    doctorLastName: '', 
    address: '', 
    hasVisited: false
  });

  const [doctors, setDoctors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const { setAppointmentsUpdated } = useContext(Context);

  const departmentsArray = [
    "Visita Osteopatica",
    "Osteopatia Pediatrica",
    "Ginnastica Posturale",
    "Taping Elastico",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", { withCredentials: true });
        setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        doctor_firstName: formData.doctorFirstName,
        doctor_lastName: formData.doctorLastName,
        appointment_date: formData.appointmentDate,
        gender: formData.gender.toLowerCase(),
        status: 'Pending'
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        appointmentData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setSuccessMessage(`Appuntamento confermato per il ${new Date(data.appointment.date).toLocaleDateString()} con il Dott. ${data.appointment.doctor} nel reparto ${data.appointment.department}`);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', dob: '',
        gender: '', appointmentDate: '', department: 'Visita Osteopatica',
        doctorFirstName: '', doctorLastName: '', address: '', hasVisited: false
      });
      setAppointmentsUpdated(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Si è verificato un errore');
      setSuccessMessage(null);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Appuntamento</h2>
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Nome" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Cognome" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control type="tel" placeholder="Cellulare" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Seleziona Genere</option>
                <option value="uomo">Uomo</option>
                <option value="donna">Donna</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>{depart}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select 
                name="doctorFullName" 
                value={`${formData.doctorFirstName} ${formData.doctorLastName}`} 
                onChange={(e) => {
                  const [firstName, lastName] = e.target.value.split(" ");
                  setFormData(prev => ({ ...prev, doctorFirstName: firstName, doctorLastName: lastName }));
                }}
                disabled={!formData.department}
                required
              >
                <option value="">Scegli Dottore/Dottoressa</option>
                {doctors
                  .filter((doctor) => doctor.doctorDepartment === formData.department)
                  .map((doctor, index) => (
                    <option value={`${doctor.firstName} ${doctor.lastName}`} key={index}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Control as="textarea" rows={3} placeholder="Indirizzo" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Hai già fatto una visita in passato?" 
            name="hasVisited"
            checked={formData.hasVisited}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            PRENOTA APPUNTAMENTO
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormAppuntamento;