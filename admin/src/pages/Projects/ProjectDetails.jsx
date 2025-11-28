import { useState, useEffect } from "react";
import {
  X,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProjectDetails = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${projectId}`);
        setProject(data);
      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (project && project.screenshots) {
      setLightboxIndex((prev) => (prev + 1) % project.screenshots.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (project && project.screenshots) {
      setLightboxIndex(
        (prev) =>
          (prev - 1 + project.screenshots.length) % project.screenshots.length
      );
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!project) return <div className="p-4">Project not found</div>;

  return (
    <div className="space-y-6 relative">
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full hover:bg-ni-neon hover:text-black transition-colors z-10"
      >
        <X size={20} />
      </button>

      <div className="border-b-2 border-black pb-4 pr-10">
        <h2 className="text-3xl font-bold">{project.name}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techstack?.map((tech, index) => (
            <span
              key={index}
              className="bg-ni-neon px-2 py-1 text-xs font-bold border border-black"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border-2 border-black shadow-brutal overflow-hidden mb-6">
            <img
              src={project.image?.url || project.image}
              alt={project.name}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 font-bold hover:bg-gray-800 transition-colors"
              >
                <Github size={20} /> GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white text-black border-2 border-black px-4 py-2 font-bold hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={20} /> Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-xl mb-2 border-l-4 border-ni-neon pl-3">
              Details
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{project.details}</p>
            </div>
          </div>
        </div>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <div>
          <h3 className="font-bold text-xl mb-4 border-l-4 border-ni-neon pl-3">
            Screenshots ({project.screenshots.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.screenshots.map((img, index) => (
              <div
                key={img._id}
                className="relative group cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={img.thumb || img.url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-ni-neon"
            onClick={closeLightbox}
          >
            <X size={40} />
          </button>

          <button
            className="absolute left-4 text-white hover:text-ni-neon"
            onClick={prevImage}
          >
            <ChevronLeft size={40} />
          </button>

          <img
            src={project.screenshots[lightboxIndex].url}
            alt="Full view"
            className="max-h-[90vh] max-w-[90vw] object-contain border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 text-white hover:text-ni-neon"
            onClick={nextImage}
          >
            <ChevronRight size={40} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-bold bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {project.screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
