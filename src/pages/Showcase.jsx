import React from "react";
import { Github, ExternalLink, Code } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  Binary,
  Chip,
  CurlyBrace,
  AngleBracket,
  WavyLine,
} from "../components/ui/Doodles";
import { projects } from "../data/mockData";

const Showcase = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      <Binary className="absolute top-20 left-0 text-ni-black opacity-10 scale-150 transform -rotate-45" />
      <Binary className="absolute bottom-20 right-0 text-ni-black opacity-10 scale-150 transform rotate-45" />

      <div className="text-center mb-20 relative z-10">
        <div className="inline-block relative">
          <AngleBracket className="absolute -left-16 top-0 h-32 text-ni-blue hidden md:block" />
          <AngleBracket
            direction="right"
            className="absolute -right-16 top-0 h-32 text-ni-blue hidden md:block"
          />

          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-6 relative">
            Project <br />
            <span className="text-ni-neon bg-ni-black px-6 transform -rotate-2 inline-block border-brutal shadow-brutal-sm">
              Showcase
            </span>
          </h1>
        </div>

        <p className="text-2xl font-bold max-w-3xl mx-auto bg-ni-white border-brutal p-4 shadow-brutal transform rotate-1">
          Built by students, for the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projects.map((project, index) => (
          <div key={project.id} className="relative group">
            <div className="absolute -inset-2 bg-ni-black transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
            <Card
              rotate={index % 2 === 0 ? -1 : 1}
              className="p-0 flex flex-col h-full group hover:shadow-[12px_12px_0px_0px_#000000] transition-shadow duration-300 relative z-10"
            >
              <div className="relative border-b-4 border-ni-black overflow-hidden h-56">
                <div className="absolute inset-0 bg-ni-neon opacity-20 group-hover:opacity-0 transition-opacity z-10"></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-0 right-0 bg-ni-black text-ni-white p-3 border-l-4 border-b-4 border-ni-white z-20">
                  <Code size={24} strokeWidth={3} />
                </div>
                <WavyLine className="absolute bottom-0 left-0 w-full text-ni-white h-4 z-20" />
              </div>

              <div className="p-8 flex-grow flex flex-col bg-ni-white relative">
                <CurlyBrace className="absolute -left-4 top-1/2 h-24 text-ni-gray opacity-50" />

                <h3 className="text-4xl font-black uppercase mb-4 transform -rotate-1">
                  {project.title}
                </h3>
                <p className="font-bold mb-8 flex-grow text-lg">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, i) => (
                    <span
                      key={tech}
                      className={`border-2 border-ni-black px-3 py-1 text-xs font-black uppercase transform ${
                        i % 2 === 0
                          ? "rotate-2 bg-ni-cyan"
                          : "-rotate-2 bg-ni-pink text-ni-white"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                  <Button
                    variant="primary"
                    className="flex-1 py-3 text-sm border-2 shadow-sm hover:shadow-md"
                  >
                    <ExternalLink size={18} className="mr-2" strokeWidth={3} />{" "}
                    Demo
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 py-3 text-sm border-2 shadow-sm hover:shadow-md"
                  >
                    <Github size={18} className="mr-2" strokeWidth={3} /> Code
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-24 relative max-w-4xl mx-auto">
        <Chip className="absolute -top-12 -left-12 w-24 h-24 text-ni-black animate-spin-slow" />

        <div className="bg-ni-black text-ni-white p-12 text-center border-brutal shadow-brutal-lg transform -rotate-1 relative overflow-hidden">
          <Binary className="absolute inset-0 text-ni-neon opacity-10 scale-150" />

          <h2 className="text-5xl font-black uppercase mb-8 relative z-10">
            Have a project to show?
          </h2>
          <p className="text-xl font-bold mb-10 max-w-2xl mx-auto relative z-10">
            Submit your project to be featured in our showcase. We love seeing
            what you build!
          </p>
          <Button
            variant="primary"
            className="text-xl px-10 py-5 border-ni-white relative z-10 hover:bg-ni-white hover:text-ni-black"
          >
            Submit Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
