

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const Hero = ({ title, imageUrl }) => {
  return (
    <Container className="my-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h1>{title}</h1>
          <p>
            
            Benvenuti nel mondo del benessere olistico con l'osteopata Ilaria Caltagirone.
            Il nostro approccio 
            L'osteopatia è una disciplina che si concentra sulla salute globale del corpo, considerando la stretta connessione tra struttura e funzione. Attraverso tecniche manuali precise e delicate, l'osteopatia mira a ripristinare l'equilibrio naturale del corpo, promuovendo il suo potere di autoguarigione.
          </p>
        </Col>
        <Col md={6} className="text-center">
          <Image src="/CaltagironeSfondoBlu.png" alt="logo ilaria" fluid className="animated-image" />
        </Col>
      </Row>
    </Container>
  );
};

export default Hero;