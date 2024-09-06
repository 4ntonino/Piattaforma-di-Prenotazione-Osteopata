

import React from 'react';
import Hero from '../components/Hero';
import Biografia from '../components/Biografia';

const AboutUs = () => {
  return (
    <>
      <Hero
        title="Qualche informazione su di me.."
        imageUrl="/"
      />
      <Biografia imageUrl="/dottoressa.png" />
    </>
  );
};

export default AboutUs;