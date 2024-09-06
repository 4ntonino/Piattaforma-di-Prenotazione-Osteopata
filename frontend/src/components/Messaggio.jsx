

import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';

const Messaggio = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:4000/api/v1/message/send",
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            toast.success(res.data.message);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container className="my-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">Invia un messaggio</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaUser className="me-2" />Nome</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Inserisci il tuo nome" 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaUser className="me-2" />Cognome</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Inserisci il tuo cognome" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Inserisci la tua email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FaPhone className="me-2" />Telefono</Form.Label>
                                    <Form.Control 
                                        type="tel" 
                                        placeholder="Inserisci il tuo numero di telefono" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Messaggio</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={6} 
                                placeholder="Scrivi il tuo messaggio qui..."
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" className="px-4 py-2">
                                Invia Messaggio
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Messaggio;