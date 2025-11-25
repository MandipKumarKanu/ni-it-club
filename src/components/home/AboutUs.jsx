import React from "react";
import Card from "../ui/Card";
import { CircleScribble, Dots } from "../ui/Doodles";

const AboutUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <CircleScribble className="absolute -top-20 right-0 w-64 h-64 text-ni-neon opacity-50" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <h2 className="text-6xl font-black uppercase mb-8 relative inline-block">
            About Us
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-ni-pink transform -skew-x-12 -z-10"></div>
          </h2>
          <div className="bg-ni-white text-ni-black p-8 shadow-brutal-lg border-brutal relative transform rotate-1">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-ni-black"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-ni-black"></div>
            <p className="text-xl leading-relaxed font-bold mb-6">
              NI IT Club is the premier student organization dedicated to
              fostering a culture of technical excellence and innovation. We
              bridge the gap between academic learning and industry requirements
              through hands-on workshops, hackathons, and collaborative
              projects.
            </p>
            <p className="text-xl leading-relaxed font-bold">
              Our mission is to empower every student with the tools and
              community they need to succeed in the tech world.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <Dots className="absolute inset-0 text-ni-black opacity-10 scale-150" />
          {[
            {
              title: "Learn & Build",
              description:
                "Master new technologies through hands-on projects and collaborative coding sessions.",
              color: "bg-ni-neon",
              rotate: -2,
            },
            {
              title: "Connect",
              description:
                "Network with like-minded tech enthusiasts and build lasting friendships.",
              color: "bg-ni-cyan",
              rotate: 2,
            },
            {
              title: "Innovate",
              description:
                "Turn your ideas into reality with support from our creative community.",
              color: "bg-ni-pink",
              rotate: -1,
            },
            {
              title: "Grow",
              description:
                "Develop your skills and prepare for a successful career in technology.",
              color: "bg-ni-blue",
              rotate: 1,
            },
          ].map((item, index) => (
            <Card
              key={index}
              rotate={item.rotate}
              className={`flex flex-col items-center justify-center text-center p-8 ${item.color} border-brutal shadow-brutal hover:scale-105 transition-transform duration-300`}
            >
              <h3 className="text-2xl font-black uppercase mb-4 bg-ni-black text-ni-white px-2 transform -rotate-1">
                {item.title}
              </h3>
              <p className="text-lg font-bold leading-tight">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
