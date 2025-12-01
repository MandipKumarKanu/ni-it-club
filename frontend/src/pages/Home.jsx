import React from "react";
import Hero from "../components/home/Hero";
import AboutUs from "../components/home/AboutUs";
import Team from "../components/home/Team";
import Activities from "../components/home/Activities";
import CTA from "../components/home/CTA";
import SEO from "../components/SEO";
import useHomeStore from "../store/useHomeStore";

const Home = () => {
  const { homeData, loading } = useHomeStore();

  return (
    <>
      <SEO
        title={homeData?.site?.name || "NI IT Club"}
        description={
          homeData?.site?.description ||
          "NI IT Club - Where Innovation Meets Community. Join us to level up your tech skills through workshops, hackathons, and tech talks at National Infotech College."
        }
        keywords="NI IT Club, IT Club Nepal, tech community, hackathons, workshops, coding, Birgunj"
        url="/"
      />
      <div className="space-y-32 pb-20 overflow-x-hidden">
        <Hero
          data={homeData?.hero}
          logo={homeData?.site?.logo}
          loading={loading}
        />
        <AboutUs data={homeData?.about} />
        <Team data={homeData?.teamMembers} loading={loading} />
        <Activities />
        <CTA />
      </div>
    </>
  );
};

export default Home;
