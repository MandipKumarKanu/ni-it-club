import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { AngleBracket } from "../ui/Doodles";
import { teamMembers } from "../../data/mockData";

const Team = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-16 relative">
        <h2 className="text-6xl font-black uppercase relative z-10">
          Meet Our{" "}
          <span className="text-ni-blue decoration-wavy underline">Team</span>
        </h2>
        <AngleBracket className="absolute -left-12 top-0 h-20 text-ni-pink hidden md:block" />
        <Button variant="outline" className="hidden md:flex transform rotate-2">
          View All Members
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {teamMembers.map((member, index) => (
          <div key={member.id} className="relative group">
            <div className="absolute inset-0 bg-ni-black transform translate-x-4 translate-y-4 border-brutal"></div>
            <Card
              rotate={index % 2 === 0 ? 1 : -1}
              className="relative z-10 h-full flex flex-col items-center text-center group-hover:-translate-y-2 transition-transform"
            >
              <div className="w-24 h-24 rounded-full border-brutal bg-ni-gray mb-6 overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="absolute inset-0 border-4 border-ni-black rounded-full opacity-20"></div>
              </div>
              <h3 className="text-2xl font-black bg-ni-neon px-2 transform -rotate-1 mb-2 border-2 border-ni-black">
                {member.name}
              </h3>
              <span className="text-ni-pink font-bold uppercase mb-4 tracking-widest">
                {member.role}
              </span>
              {/* Skills/Description Tags */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 border-t-4 border-ni-black pt-4 w-full">
                {Array.isArray(member.description) ? (
                  member.description.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-ni-black text-ni-white px-3 py-1 text-sm font-bold uppercase"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="bg-ni-black text-ni-white px-3 py-1 text-sm font-bold uppercase">
                    {member.description}
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-auto">
                <button className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110">
                  <Github size={20} />
                </button>
                <button className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110">
                  <Linkedin size={20} />
                </button>
                <button className="p-2 border-brutal hover:bg-ni-black hover:text-ni-white transition-colors transform hover:scale-110">
                  <Twitter size={20} />
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
