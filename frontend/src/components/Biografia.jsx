

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const Biografia = ({ imageUrl }) => {
  return (
    <Container className="my-5">
      <Row>
      <Col md={6} className="mb-4 mb-md-0">
  <Image src={imageUrl} alt="immagine dt.ssa" width={400} height={450} />
</Col>
        <Col md={6}>
          <p className="text-muted">Biografia</p>
          <h3>Chi sono</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, facilis! Alias eligendi facilis perspiciatis, repellat cupiditate molestias, saepe illo ex quas mollitia consectetur, laborum eius? Placeat sint minima autem non!</p>
          <p>Ilaria caltagirone osteopata</p>
          <p>caltagirone osteopata trapani</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, corrupti. Hic, rerum atque odit facilis suscipit tempora. Quo adipisci, aperiam molestias, atque pariatur reprehenderit fuga animi debitis officia, minus ipsa.</p>
          <p>Ilaria caltagirone osteopata</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Biografia;