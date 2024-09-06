
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  padding: 4rem 0;
  background-color: #f8f9fa;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  color: #333;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #007bff;
    margin: 10px auto 0;
  }
`;

const StyledCard = styled(Card)`
  border: none;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow: hidden;
  border-radius: 15px;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const CardImage = styled(Card.Img)`
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  
  ${StyledCard}:hover & {
    transform: scale(1.1);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.7);
  overflow: hidden;
  width: 100%;
  height: 0;
  transition: .5s ease;
  
  ${StyledCard}:hover & {
    height: 100%;
  }
`;

const OverlayText = styled.div`
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
`;

const Dipartimento = () => {
    const departmentsArray = [
        {
          name: "Osteopatia",
          imageUrl: "/osteopata.jpg",
          description: "Trattamenti osteopatici per il benessere del corpo."
        },
        {
          name: "Osteopatia Pediatrica",
          imageUrl: "/pediatrico.jpg",
          description: "Cure osteopatiche specifiche per bambini e neonati."
        },
        {
          name: "Ginnastica Posturale",
          imageUrl: "/ginnastica.jpg",
          description: "Esercizi mirati per migliorare la postura e prevenire dolori."
        },
    ];

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
          slidesToSlide: 1,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 1,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
    };

    return (
        <StyledContainer fluid>
            <Container>
                <SectionTitle>I Nostri Servizi</SectionTitle>
                <Carousel 
                    responsive={responsive} 
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={3000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                {
                    departmentsArray.map((dipartim, index) => (
                        <StyledCard key={index} className="mx-2 mb-4">
                            <CardImage variant="top" src={dipartim.imageUrl} alt={dipartim.name} />
                            <Card.Body>
                                <Card.Title className="text-center font-weight-bold">{dipartim.name}</Card.Title>
                            </Card.Body>
                            <CardOverlay>
                                <OverlayText>
                                    <h3>{dipartim.name}</h3>
                                    <p>{dipartim.description}</p>
                                </OverlayText>
                            </CardOverlay>
                        </StyledCard>
                    ))
                }
                </Carousel>
            </Container>
        </StyledContainer>
    );
};

export default Dipartimento;