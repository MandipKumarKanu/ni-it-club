import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Code,
  Terminal,
  Minus,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  Binary,
  Chip,
  CurlyBrace,
  AngleBracket,
  WavyLine,
  Star,
  HandDrawnArrow,
  Arrow,
  Dots,
  CircleScribble,
} from "../components/ui/Doodles";
import api from "../services/api";
import SEO from "../components/SEO";
import ProjectModal from "../components/ui/ProjectModal";
import Skeleton from "../components/ui/Skeleton";

const WindowHeader = ({
  title,
  color = "bg-ni-black",
  textColor = "text-ni-white",
  onMaximize,
}) => (
  <div
    className={`${color} ${textColor} border-b-4 border-ni-black p-2 sm:p-3 flex justify-between items-center gap-2`}
  >
    <div className="font-mono font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-2 text-xs sm:text-sm truncate flex-1 min-w-0">
      <Terminal size={16} className="shrink-0" />
      <span className="truncate">{title}</span>
    </div>
    <div className="flex gap-1 sm:gap-2 shrink-0">
      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-ni-black bg-ni-white flex items-center justify-center hover:bg-ni-gray-200 cursor-pointer">
        <Minus size={12} className="sm:block hidden" />
        <Minus size={10} className="sm:hidden" />
      </div>
      <div
        className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-ni-black bg-ni-white flex items-center justify-center hover:bg-ni-gray-200 cursor-pointer"
        onClick={onMaximize}
      >
        <Square size={10} className="sm:block hidden" />
        <Square size={8} className="sm:hidden" />
      </div>
      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-ni-black bg-ni-pink flex items-center justify-center hover:bg-red-500 cursor-pointer">
        <X size={12} className="sm:block hidden" />
        <X size={10} className="sm:hidden" />
      </div>
    </div>
  </div>
);

const Showcase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects?page=${page}&limit=9`);
      if (data.docs) {
        setProjects(data.docs);
        setTotalPages(data.totalPages);
      } else {
        setProjects(data); // Fallback if not paginated
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Showcase"
        description="Browse through memorable moments from NI IT Club events - hackathons, workshops, social meetups, and more."
        keywords="NI IT Club projects"
        url="/showcase"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden min-h-screen">
        {/* Background Elements */}
        <Binary className="absolute top-20 left-0 text-ni-black opacity-5 scale-150" />
        <Binary className="absolute bottom-20 right-0 text-ni-black opacity-5 scale-150" />

        {/* Hero Section */}
        <div className="mb-24 relative z-10 max-w-4xl mx-auto">
          <div className="bg-ni-white border-4 border-ni-black shadow-brutal-lg">
            <WindowHeader title="SYSTEM_ROOT/SHOWCASE.EXE" />
            <div className="p-4 sm:p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-ni-black opacity-10 animate-pulse"></div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 sm:mb-6 font-mono">
                Project_Showcase
                <span className="animate-pulse">_</span>
              </h1>

              <p className="text-sm sm:text-xl md:text-2xl font-bold font-mono text-ni-gray-800 mb-6 sm:mb-8">
                &gt; Initializing creative modules... <br />
                &gt; Loading student projects... <br />
                &gt; Status:{" "}
                <span className="text-ni-neon bg-ni-black px-2">ONLINE</span>
              </p>

              <div className="inline-block border-2 border-ni-black p-1 bg-ni-gray-100">
                <p className="font-mono text-sm font-bold px-4 py-2">
                  v2.0.25 [Stable]
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements behind hero */}
          <Chip className="absolute -top-12 -right-12 w-32 h-32 text-ni-blue opacity-20 -z-10 rotate-12" />
          <Dots className="absolute -bottom-12 -left-12 w-40 h-40 text-ni-pink opacity-20 -z-10" />
        </div>

        {loading && page === 1 ? (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden min-h-screen">
              {/* Hero Skeleton Removed as per request */}
              <div className="mb-24 relative z-10 max-w-4xl mx-auto">
                {/* Keeping the container to maintain spacing if needed, or just empty */}
              </div>

              {/* Projects Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-ni-white border-4 border-ni-black shadow-brutal h-full flex flex-col"
                  >
                    <div className="border-b-4 border-ni-black p-2 flex justify-between items-center bg-ni-black">
                      <Skeleton className="h-4 w-24 bg-gray-600" />
                      <div className="flex gap-1">
                        <div className="w-4 h-4 bg-ni-white border-2 border-ni-black" />
                        <div className="w-4 h-4 bg-ni-white border-2 border-ni-black" />
                        <div className="w-4 h-4 bg-ni-pink border-2 border-ni-black" />
                      </div>
                    </div>
                    <Skeleton className="w-full h-56 border-b-4 border-ni-black" />
                    <div className="p-6 flex flex-col grow">
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-6" />
                      <div className="flex gap-2 mt-auto">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {projects.map((project, index) => (
                <div key={project._id} className="group">
                  <div className="bg-ni-white border-4 border-ni-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                    <WindowHeader
                      title={`PROJ_0${index + 1}.js`}
                      color={index % 2 === 0 ? "bg-ni-neon" : "bg-ni-cyan"}
                      textColor="text-ni-black"
                      onMaximize={() => setSelectedProject(project)}
                    />

                    <div
                      className="relative border-b-4 border-ni-black overflow-hidden h-56 group-hover:h-64 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="absolute inset-0 bg-ni-black opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                      <img
                        src={project.image?.url || project.image}
                        alt={project.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-xl sm:text-2xl font-black uppercase mb-3 font-mono">
                        {project.name}
                      </h3>
                      <p className="font-bold mb-6 grow text-ni-gray-800 font-mono text-sm leading-relaxed line-clamp-3">
                        // {project.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techstack.map((tech) => (
                          <span
                            key={tech}
                            className="border-2 border-ni-black px-2 py-1 text-xs font-bold uppercase bg-ni-gray-100 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-auto pt-4 border-t-2 border-dashed border-ni-gray-300">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-2 border-2 border-ni-black bg-ni-black text-ni-white font-bold hover:bg-ni-white hover:text-ni-black transition-colors text-sm font-mono flex items-center justify-center gap-2"
                          >
                            <ExternalLink size={14} /> RUN
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-2 border-2 border-ni-black bg-ni-white text-ni-black font-bold hover:bg-ni-gray-100 transition-colors text-sm font-mono flex items-center justify-center gap-2"
                          >
                            <Github size={14} /> SRC
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-4">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> Previous
                </Button>
                <div className="flex items-center font-mono font-bold bg-ni-white border-2 border-ni-black px-4">
                  Page {page} of {totalPages}
                </div>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2"
                >
                  Next <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-32 relative max-w-4xl mx-auto">
          <div className="bg-ni-pink border-4 border-ni-black shadow-brutal-lg">
            <WindowHeader title="SUBMISSION_FORM.EXE" color="bg-ni-black" />
            <div className="p-6 sm:p-8 md:p-12 text-center relative">
              <Binary className="absolute inset-0 text-ni-black opacity-10" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase mb-4 sm:mb-6 font-mono">
                  Ready to Deploy?
                </h2>
                <p className="text-sm sm:text-xl font-bold mb-6 sm:mb-8 font-mono bg-ni-white inline-block px-3 sm:px-4 py-2 border-2 border-ni-black">
                  Submit your project for code review and showcase.
                </p>

                <button className="text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-4 border-4 border-ni-black bg-ni-white text-ni-black font-black hover:bg-ni-black hover:text-ni-white shadow-[8px_8px_0px_0px_#000000] hover:shadow-none hover:translate-x-1 transition-all font-mono uppercase">
                  &gt; Initialize Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default Showcase;
