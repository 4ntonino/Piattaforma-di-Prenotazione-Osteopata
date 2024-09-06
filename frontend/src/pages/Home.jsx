

import React from 'react';
import Hero from '../components/Hero';
import Biografia from '../components/Biografia';
import Dipartimento from '../components/Dipartimento';
import Messaggio from '../components/Messaggio';

const Home = () => {
  return (
    <>
      <Hero 
        title="Benvenuti sulla pagina di Ilaria Caltagirone | La tua Osteopata." 
        imageUrl="/dr.png"
      />
      <Biografia imageUrl="/dottoressa.png" />
      <Dipartimento />
      <Messaggio />
    </>
  );
};

export default Home;