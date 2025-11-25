import React from "react";
import Hero from "../components/home/Hero";
import AboutUs from "../components/home/AboutUs";
import Team from "../components/home/Team";
import Activities from "../components/home/Activities";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <div className="space-y-32 pb-20 overflow-x-hidden">
      <Hero />
      <AboutUs />
      <Team />
      <Activities />
      <CTA />
    </div>
  );
};

export default Home;
