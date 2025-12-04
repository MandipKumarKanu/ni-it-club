import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Minus,
  Square,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Terminal,
} from "lucide-react";

const ProjectIframeWindow = ({ project, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!project) return null;

  const hasLiveLink = project.link;

  return (
    <div className="fixed inset-0 z-50 bg-ni-black/80 backdrop-blur-sm">
    
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              #fff 20px,
              #fff 21px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              #fff 20px,
              #fff 21px
            )`,
          }}
        />
      </div>

      <div
        ref={windowRef}
        className={`bg-ni-white border-4 border-ni-black shadow-brutal-lg flex flex-col transition-all duration-300 ${
          isMinimized
            ? "h-auto w-80 md:w-96"
            : isMaximized
            ? "fixed inset-4 md:inset-6"
            : "w-[95vw] lg:w-[85vw] xl:w-[80vw] h-[85vh] max-w-7xl"
        }`}
        style={
          isMinimized
            ? {
                position: "fixed",
                bottom: "20px",
                left: "20px",
                top: "auto",
                transform: "none",
              }
            : !isMaximized
            ? {
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }
            : {}
        }
      >
        <div
          className={`bg-ni-black text-ni-white p-2 md:p-3 flex justify-between items-center select-none shrink-0 ${
            isMinimized ? "cursor-pointer" : ""
          }`}
          onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        >
          <div className="flex items-center gap-2 font-mono font-bold text-xs md:text-sm truncate flex-1">
            <Terminal size={16} className="shrink-0 text-ni-neon" />
            <span className="truncate">
              {project.name} {isMinimized ? "" : "- Live Preview"}
            </span>
          </div>

          <div className="flex gap-1 md:gap-2 shrink-0">
            <button
              className="w-6 h-6 md:w-7 md:h-7 border-2 border-ni-white/30 bg-ni-gray-800 flex items-center justify-center hover:bg-ni-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
                if (isMaximized) setIsMaximized(false);
              }}
              title={isMinimized ? "Restore" : "Minimize"}
            >
              <Minus size={12} />
            </button>

            <button
              className="w-6 h-6 md:w-7 md:h-7 border-2 border-ni-white/30 bg-ni-gray-800 flex items-center justify-center hover:bg-ni-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
                if (isMinimized) setIsMinimized(false);
              }}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Square size={10} /> : <Maximize2 size={12} />}
            </button>

            <button
              className="w-6 h-6 md:w-7 md:h-7 border-2 border-ni-black bg-ni-pink flex items-center justify-center hover:bg-red-500 transition-colors text-ni-black"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* URL Bar - Hidden when minimized */}
        {!isMinimized && (
          <div className="bg-ni-gray-100 border-b-4 border-ni-black p-2 flex items-center gap-2 shrink-0">
            <button
              className="p-1.5 border-2 border-ni-black bg-ni-white hover:bg-ni-gray-200 transition-colors"
              onClick={() => setIsLoading(true)}
              title="Refresh"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>

            <div className="flex-1 flex items-center bg-ni-white border-2 border-ni-black px-3 py-1.5 font-mono text-xs md:text-sm truncate">
              <span className="text-ni-gray-500 mr-1">🔒</span>
              <span className="truncate">
                {hasLiveLink ? project.link : "No live preview available"}
              </span>
            </div>

            {hasLiveLink && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 border-2 border-ni-black bg-ni-neon hover:bg-ni-cyan transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {!isMinimized && (
          <div className="flex-1 relative bg-ni-gray-200 overflow-hidden">
            {hasLiveLink ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ni-white z-10">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-ni-black border-t-ni-neon animate-spin"></div>
                    </div>
                    <p className="mt-4 font-mono font-bold text-sm animate-pulse">
                      Loading live preview...
                    </p>
                    <p className="mt-2 font-mono text-xs text-ni-gray-600">
                      {project.link}
                    </p>
                  </div>
              )}
              <iframe
                src={project.link}
                title={`Preview of ${project.name}`}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-ni-white">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-6 border-4 border-ni-black bg-ni-gray-100 flex items-center justify-center">
                  <Terminal size={40} className="text-ni-gray-400" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-2 font-mono">
                  No Live Preview
                </h3>
                <p className="font-mono text-ni-gray-600 mb-6">
                  This project doesn't have a live demo URL.
                </p>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-4 border-ni-black bg-ni-neon font-bold uppercase font-mono hover:bg-ni-cyan transition-colors shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                  >
                    View Source Code
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )}
          </div>
        )}

        {!isMinimized && (
          <div className="bg-ni-gray-100 border-t-2 border-ni-black px-3 py-1 flex items-center justify-between font-mono text-xs shrink-0">
            <span className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                }`}
              ></span>
              {isLoading ? "Loading..." : "Ready"}
            </span>
            <span className="text-ni-gray-500">
              {project.techstack?.slice(0, 3).join(" • ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIframeWindow;
