

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Context } from '../main';
import axios from 'axios';
import { toast } from 'react-toastify';

const NavbarComponent = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`transition-all ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent bg-opacity-75 py-3'}`}
      style={{ backdropFilter: scrolled ? 'blur(10px)' : 'blur(0)' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/logo.png" 
            alt="logo" 
            className="logo-img" 
            style={{ width: scrolled ? '190px' : '210px', transition: 'width 0.3s ease' }} 
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {['/', '/appointment', '/about'].map((path) => (
              <Nav.Link 
                key={path}
                as={Link} 
                to={path}
                className={`mx-3 ${location.pathname === path ? 'fw-bold border-bottom border-primary' : ''}`}
                style={{
                  fontSize: '1rem',
                  transition: 'color 0.2s ease',
                  color: location.pathname === path ? '#007bff' : '#333',
                }}
              >
                {path === '/' ? 'Home' : path === '/appointment' ? 'Appuntamento' : 'Chi sono'}
              </Nav.Link>
            ))}
          </Nav>
          {isAuthenticated ? (
            <Button 
              variant="outline-primary" 
              onClick={handleLogout}
              className="ms-3 px-4"
              style={{ borderRadius: '20px', transition: 'all 0.3s ease' }}
            >
              LOGOUT
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
              className="ms-3 px-4"
              style={{ borderRadius: '20px', transition: 'all 0.3s ease' }}
            >
              LOGIN
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
