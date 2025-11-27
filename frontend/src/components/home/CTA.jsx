import React from "react";
import Button from "../ui/Button";
import { HandDrawnArrow } from "../ui/Doodles";

const CTA = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 text-center pb-20 relative">
      <HandDrawnArrow className="absolute -left-10 top-1/2 w-32 text-ni-black transform -rotate-45 hidden lg:block" />
      <HandDrawnArrow className="absolute -right-10 top-1/2 w-32 text-ni-black transform rotate-135 hidden lg:block" />

      <div className="bg-ni-neon border-brutal p-16 shadow-brutal-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 relative z-10">
          Ready to Join?
        </h2>
        <p className="text-2xl font-bold mb-10 max-w-3xl mx-auto relative z-10">
          Become a part of the most active tech community on campus. No prior
          experience required.
        </p>
        <Button
          variant="primary"
          className="bg-ni-white text-ni-black hover:text-ni-white text-2xl px-16 py-6 mx-auto border-ni-white relative z-10 shadow-[8px_8px_0px_0px_#ffffff]"
        >
          Hmm...
        </Button>
      </div>
    </section>
  );
};

export default CTA;
