import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import {
  CurlyBrace,
  HandDrawnArrow,
  Binary,
  Chip,
  Dots,
  Star,
  Arrow,
} from "../ui/Doodles";

const Hero = ({ data, logo }) => {
  const heroData = {
    title1: data?.title1 || "Welcome to",
    title2: data?.title2 || "NI IT Club",
    subtitle: data?.subtitle || "Where Innovation Meets Community.",
  };

  const logoUrl = logo?.url || "/niit-c.png";

  return (
    <section className="relative  border-b-4 border-ni-black py-24 lg:py overflow-hidden">
      {/* Background Doodles */}
      <Binary className="absolute top-10 left-10 text-ni-neon transform -rotate-12 scale-150" />
      <Binary className="absolute bottom-20 right-10 text-ni-pink transform rotate-12 scale-150" />
      <Chip className="absolute top-20 right-20 text-ni-cyan w-24 h-24 animate-float" />
      <Dots className="absolute bottom-10 left-1/4 text-ni-black w-32 h-32 opacity-20" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-24">
        <div className="max-w-5xl relative flex-1">
          {/* <CurlyBrace className="absolute -left-16 top-0 h-48 text-ni-black hidden lg:block" /> */}

          <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 text-ni-black drop-shadow-[8px_8px_0px_rgba(204,255,0,1)] relative">
            {heroData.title1} <br />
            <span className="relative inline-block">
              <span className="text-ni-white bg-ni-black px-6 transform -rotate-2 inline-block border-brutal shadow-brutal-sm">
                {heroData.title2}
              </span>
              {/* <Star className="absolute -top-12 -right-12 text-ni-pink w-24 h-24 animate-spin-slow" /> */}
            </span>
          </h1>

          <div className="relative inline-block">
            <p className="text-3xl md:text-4xl font-bold mb-10 bg-ni-neon inline-block px-4 py-2 border-brutal transform rotate-1">
              {heroData.subtitle}
            </p>
            <HandDrawnArrow className="absolute -right-32 top-0 w-24 text-ni-black transform rotate-12 hidden md:block" />
          </div>

          <p className="text-xl mb-12 max-w-2xl font-bold text-ni-black bg-ni-white border-brutal p-6 shadow-brutal transform -rotate-1 relative">
            We are a community of builders, breakers, and creators. Join us to
            level up your skills and build the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 relative">
            <Arrow className="absolute -left-24 top-4 w-20 text-ni-black hidden lg:block" />
            <Button
              variant="primary"
              className="text-2xl px-10 py-5 transform hover:rotate-2"
            >
              Join Us Today <ArrowRight className="ml-2" strokeWidth={3} />
            </Button>
            <Button
              variant="outline"
              className="text-2xl px-10 py-5 bg-ni-white transform hover:-rotate-2"
            >
              View Events
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <img
            src={logoUrl}
            alt="NI IT Club Logo"
            className="max-w-10/12 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
