import React, { useEffect, useState } from "react";
import { X, ExternalLink, Terminal, Monitor } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const ProjectModal = ({ project, onClose, onOpenPreview }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  if (!project) return null;

  const handleLiveDemo = () => {
    if (isMobile || !onOpenPreview) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    } else {
      onClose();
      onOpenPreview(project);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ni-black/80 backdrop-blur-sm">
      <div className="bg-ni-white border-4 border-ni-black shadow-brutal-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        <div className="bg-ni-black text-ni-white p-3 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2 font-mono font-bold uppercase">
            <Terminal size={18} />
            <span>{project.name}.exe</span>
          </div>
          <button
            onClick={onClose}
            className="bg-ni-pink text-ni-black hover:bg-red-500 p-1 border-2 border-ni-white transition-colors cursor-target"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="border-4 border-ni-black overflow-hidden relative group">
            <img
              src={project.image?.url || project.image}
              alt={project.name}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 font-mono">
                  {project.name}
                </h2>
                <div className="prose prose-lg font-mono text-ni-gray-800">
                  <p>{project.details || project.shortDescription}</p>
                </div>
              </div>

              {project.screenshots && project.screenshots.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold uppercase border-b-4 border-ni-black inline-block">
                    Screenshots
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.screenshots.map((shot, index) => (
                      <div
                        key={index}
                        className="border-2 border-ni-black overflow-hidden hover:scale-105 transition-transform"
                      >
                        <img
                          src={shot.url || shot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-ni-gray-100 p-4 border-2 border-ni-black">
                <h3 className="font-bold uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-ni-neon block"></span>
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techstack?.map((tech) => (
                    <span
                      key={tech}
                      className="bg-ni-white border border-ni-black px-2 py-1 text-xs font-bold font-mono uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {project.link && (
                  <button
                    onClick={handleLiveDemo}
                    className="block w-full text-center py-3 border-2 border-ni-black bg-ni-neon text-ni-black font-bold hover:bg-ni-black hover:text-ni-neon transition-colors font-mono uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-target"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isMobile ? (
                        <ExternalLink size={18} />
                      ) : (
                        <Monitor size={18} />
                      )}
                      {isMobile ? "Open Site" : "Live Demo"}
                    </div>
                  </button>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 border-2 border-ni-black bg-ni-white text-ni-black font-bold hover:bg-ni-gray-100 transition-colors font-mono uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-target"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaGithub size={18} /> Source Code
                    </div>
                  </a>
                )}
              </div>

              <div className="text-xs font-mono text-ni-gray-600 space-y-2 border-t-2 border-dashed border-ni-gray-300 pt-4">
                <p>
                  <span className="font-bold">Category:</span>{" "}
                  {project.category || "Uncategorized"}
                </p>
                <p>
                  <span className="font-bold">Date:</span>{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
