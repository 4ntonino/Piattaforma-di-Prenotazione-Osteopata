

import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Table, Badge, Form, Image } from 'react-bootstrap';
import { FaUserMd, FaCalendarCheck, FaChartLine, FaUserClock } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [logoError, setLogoError] = useState(false);

  const { isAuthenticated, user, appointmentsUpdated, setAppointmentsUpdated } = useContext(Context);

  const calculateWeeklyTrend = useCallback((appointmentsData) => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyCounts = {};
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(oneWeekAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = dayNames[date.getDay()];
      dailyCounts[dayName] = 0;
    }

    appointmentsData.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      if (appointmentDate >= oneWeekAgo && appointmentDate <= today) {
        const dayName = dayNames[appointmentDate.getDay()];
        dailyCounts[dayName]++;
      }
    });

    const trend = Object.entries(dailyCounts).map(([name, count]) => ({
      name,
      count
    }));

    setWeeklyTrend(trend);
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/appointment/getall",
        { withCredentials: true }
      );
      setAppointments(data.appointments);
      calculateWeeklyTrend(data.appointments);
    } catch (error) {
      toast.error("Errore nel caricamento degli appuntamenti");
    } finally {
      setLoading(false);
    }
  }, [calculateWeeklyTrend]);

  useEffect(() => {
    fetchAppointments();
    const intervalId = setInterval(fetchAppointments, 30000);
    return () => clearInterval(intervalId);
  }, [fetchAppointments]);

  useEffect(() => {
    if (appointmentsUpdated) {
      fetchAppointments();
      setAppointmentsUpdated(false);
    }
  }, [appointmentsUpdated, fetchAppointments, setAppointmentsUpdated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const uniqueDoctors = new Set(appointments.map(app => app.doctorId)).size;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Dashboard</h1>
        </Col>
        <Col xs="auto">
          <Image
            src={"/IlariaCaltagirone1.png"}
            alt="Logo Ilaria Caltagirone"
            style={{
              height: '100px',
              width: 'auto',
              maxWidth: '900px',  
              objectFit: 'contain'
            }}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Benvenuto, {user?.firstName} {user?.lastName}</h5>
              <p className="text-muted">Gestisci i tuoi appuntamenti e monitora le attività della clinica.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <h6 className="text-muted mb-2">Appuntamenti Totali</h6>
                <h2>{appointments.length}</h2>
              </div>
              <FaCalendarCheck size={24} className="text-primary mt-3" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <h6 className="text-muted mb-2">Dottori Coinvolti</h6>
                <h2>{uniqueDoctors}</h2>
              </div>
              <FaUserMd size={24} className="text-success mt-3" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <h6 className="text-muted mb-2">Tasso di Accettazione</h6>
                <h2>{((appointments.filter(app => app.status === 'Accepted').length / appointments.length) * 100).toFixed(1)}%</h2>
              </div>
              <FaChartLine size={24} className="text-info mt-3" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div>
                <h6 className="text-muted mb-2">In Attesa</h6>
                <h2>{appointments.filter(app => app.status === 'Pending').length}</h2>
              </div>
              <FaUserClock size={24} className="text-warning mt-3" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Trend Appuntamenti Settimanali</h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Appuntamenti Recenti</h5>
              {loading ? (
                <p>Caricamento appuntamenti...</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Paziente</th>
                      <th>Data</th>
                      <th>Dottore</th>
                      <th>Reparto</th>
                      <th>Stato</th>
                      <th>Visitato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                        <td>{new Date(appointment.appointment_date).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                        <td>{appointment.department}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={appointment.status}
                            onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                            className={`bg-${appointment.status === "Pending" ? "warning" : appointment.status === "Accepted" ? "success" : "danger"} text-white`}
                          >
                            <option value="Pending">In attesa</option>
                            <option value="Accepted">Accettato</option>
                            <option value="Rejected">Rifiutato</option>
                          </Form.Select>
                        </td>
                        <td>
                          <Badge bg={appointment.hasVisited ? "success" : "danger"}>
                            {appointment.hasVisited ? "Sì" : "No"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {appointments.length === 0 && !loading && (
                <p className="text-center text-muted">Nessun appuntamento trovato.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;