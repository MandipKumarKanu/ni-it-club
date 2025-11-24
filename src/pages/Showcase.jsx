import React from "react";
import { Github, ExternalLink, Code } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { projects } from "../data/mockData";

const Showcase = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
          Project{" "}
          <span className="text-ni-neon bg-ni-black px-4">Showcase</span>
        </h1>
        <p className="text-2xl font-bold max-w-3xl mx-auto border-b-4 border-ni-red pb-4 inline-block">
          Built by students, for the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="p-0 flex flex-col h-full group hover:shadow-[12px_12px_0px_0px_#000000] transition-shadow duration-300"
          >
            <div className="relative border-b-3 border-ni-black overflow-hidden h-48">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute top-0 right-0 bg-ni-black text-ni-white p-2 border-l-3 border-b-3 border-ni-white">
                <Code size={20} />
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-3xl font-black uppercase mb-3">
                {project.title}
              </h3>
              <p className="font-medium mb-6 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="bg-ni-gray border-2 border-ni-black px-2 py-1 text-xs font-bold uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-auto">
                <Button variant="primary" className="flex-1 py-2 text-sm">
                  <ExternalLink size={16} className="mr-2" /> Demo
                </Button>
                <Button variant="secondary" className="flex-1 py-2 text-sm">
                  <Github size={16} className="mr-2" /> Code
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-20 bg-ni-black text-ni-white p-12 text-center border-4 border-ni-neon shadow-brutal-lg">
        <h2 className="text-4xl font-black uppercase mb-6">
          Have a project to show?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Submit your project to be featured in our showcase. We love seeing
          what you build!
        </p>
        <Button variant="primary" className="text-xl px-8 py-4">
          Submit Project
        </Button>
      </div>
    </div>
  );
};

export default Showcase;
