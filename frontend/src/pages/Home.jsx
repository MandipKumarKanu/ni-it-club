import React, { useState, useEffect } from "react";
import Hero from "../components/home/Hero";
import AboutUs from "../components/home/AboutUs";
import Team from "../components/home/Team";
import Activities from "../components/home/Activities";
import CTA from "../components/home/CTA";
import SEO from "../components/SEO";
import FullPageLoader from "../components/ui/FullPageLoader";
import api from "../services/api";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await api.get("/home");
        setHomeData(data);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

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
        <Hero data={homeData?.hero} logo={homeData?.site?.logo} />
        <AboutUs data={homeData?.about} />
        <Team data={homeData?.teamMembers} />
        <Activities />
        <CTA />
      </div>
    </>
  );
};

export default Home;
