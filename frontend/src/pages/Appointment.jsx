

import React from 'react';
import Hero from '../components/Hero';
import FormAppuntamento from '../components/FormAppuntamento';

const Appointment = () => {
  return (
    <>
      <Hero
        title="Prenota il tuo appuntamento! | Ilaria Caltagirone Osteopata"
        imageUrl="/signin.png"
      />
      <FormAppuntamento />
    </>
  );
};

export default Appointment;