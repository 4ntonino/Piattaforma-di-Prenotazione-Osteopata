
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLocationArrow, FaPhone } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={3} className="text-center text-md-start mb-4 mb-md-0">
            <Image src="/IlariaCaltagirone.png" alt="logo" fluid style={{ maxWidth: '150px' }} />
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Navigazione</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-dark">Home</Link></li>
              <li><Link to="/appointment" className="text-decoration-none text-dark">Appuntamento</Link></li>
              <li><Link to="/about" className="text-decoration-none text-dark">Chi sono</Link></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Orario di apertura</h5>
            <p className="mb-0">Riceve per Appuntamento</p>
          </Col>
          <Col md={3}>
            <h5 className="text-uppercase mb-3">Contatti</h5>
            <p className="mb-1"><FaPhone className="me-2" /> 333 333222333</p>
            <p className="mb-1"><MdEmail className="me-2" /> osteopatacaltagirone@gmail.com</p>
            <p className="mb-0"><FaLocationArrow className="me-2" /> Via Nino Bixio 48, Trapani</p>
          </Col>
        </Row>
        <hr className="border-secondary my-4" />
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} Osteopata Caltagirone. Tutti i diritti riservati.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;