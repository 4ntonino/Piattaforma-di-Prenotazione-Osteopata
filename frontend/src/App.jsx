
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Importa i componenti
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import Login from './pages/Login';

// Importa il contesto
import { Context } from './main';

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  return (
    <Router>
      <Navbar />
      <Container fluid className="px-0">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/appointment' element={<Appointment />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Container>
      <ToastContainer position="top-center" />
      <Footer />
    </Router>
  );
};

export default App;