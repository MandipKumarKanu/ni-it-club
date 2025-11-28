import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  X,
  ZoomIn,
  Image as ImageIcon,
  Calendar,
  Users,
  Code,
  Camera,
  ChevronLeft,
  ChevronRight,
  Grid,
} from "lucide-react";
import { Star, Dots, CircleScribble } from "../components/ui/Doodles";
import api from "../services/api";
import SEO from "../components/SEO";

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  // Get state from URL or defaults
  const category = searchParams.get("category") || "All";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
        };

        if (category !== "All") params.category = category;

        const { data } = await api.get("/gallery", { params });
        setAlbums(data.docs);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          hasPrevPage: data.hasPrevPage,
          hasNextPage: data.hasNextPage,
        });
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [category, page]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const setCategory = (newCategory) => {
    updateParams({ category: newCategory, page: 1 });
  };

  const setPage = (newPage) => {
    updateParams({ page: newPage });
  };

  const categories = [
    { name: "All", icon: ImageIcon },
    { name: "Hackathons", icon: Code },
    { name: "Workshops", icon: Calendar },
    { name: "Socials", icon: Users },
  ];

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    // Set initial active image to the first image in the album, or featured image if no images
    if (album.images && album.images.length > 0) {
      setActiveImage(album.images[0]);
    } else {
      setActiveImage(null);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setActiveImage(null);
  };

  const nextImage = () => {
    if (!selectedAlbum || !activeImage) return;
    const currentIndex = selectedAlbum.images.findIndex(
      (img) => img._id === activeImage._id
    );
    const nextIndex = (currentIndex + 1) % selectedAlbum.images.length;
    setActiveImage(selectedAlbum.images[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedAlbum || !activeImage) return;
    const currentIndex = selectedAlbum.images.findIndex(
      (img) => img._id === activeImage._id
    );
    const prevIndex =
      (currentIndex - 1 + selectedAlbum.images.length) %
      selectedAlbum.images.length;
    setActiveImage(selectedAlbum.images[prevIndex]);
  };

  // Keyboard Navigation
  useEffect(() => {
    if (!selectedAlbum) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeAlbum();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, activeImage]);

  return (
    <>
      <SEO
        title="Gallery"
        description="Browse through memorable moments from NI IT Club events - hackathons, workshops, social meetups, and more."
        keywords="NI IT Club gallery, event photos, hackathon photos, workshop images, tech community"
        url="/gallery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="mb-16 sm:mb-20 relative">
          <div className="text-center mb-10 sm:mb-12 relative">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-6 sm:mb-8 text-ni-black relative inline-block">
              <span className="inline-block drop-shadow-[8px_8px_0px_rgba(250,187,14,1)]">
                Gallery
              </span>
              <Camera className="absolute -top-6 sm:-top-8 -right-10 sm:-right-16 w-12 h-12 sm:w-16 sm:h-16 text-ni-pink opacity-60" />
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl font-black mb-4 bg-ni-black text-ni-white inline-block px-4 sm:px-8 py-2 sm:py-4 border-4 border-ni-black shadow-brutal">
              Moments Worth Capturing
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-black uppercase border-4 border-ni-black transition-all text-sm sm:text-base flex items-center gap-2 ${
                    category === cat.name
                      ? "bg-ni-black text-ni-white shadow-brutal scale-105"
                      : "bg-ni-white text-ni-black hover:bg-ni-neon shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1"
                  }`}
                >
                  <Icon size={18} strokeWidth={3} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-ni-white">
            <div className="text-2xl font-black uppercase animate-pulse">
              Loading Gallery...
            </div>
          </div>
        ) : (
          <div className="min-h-screen relative overflow-hidden ">
            {/* Subtle Background */}
            <Dots className="absolute top-20 right-10 w-32 h-32 text-ni-black opacity-5" />
            <Dots className="absolute bottom-40 left-10 w-32 h-32 text-ni-black opacity-5" />

            <div>
              {/* Hero Section */}

              {/* Albums Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album, index) => {
                  const colors = ["bg-ni-neon", "bg-ni-cyan", "bg-ni-pink"];
                  const accentColor = colors[index % colors.length];

                  return (
                    <div
                      key={album._id}
                      className="group cursor-pointer"
                      onClick={() => openAlbum(album)}
                    >
                      <div className="bg-ni-white border-4 border-ni-black shadow-brutal hover:shadow-brutal-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                        {/* Accent stripe */}
                        <div className={`h-2 ${accentColor}`}></div>

                        {/* Image */}
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              album.featuredImage?.url ||
                              "https://placehold.co/600x400?text=No+Image"
                            }
                            alt={album.title}
                            className="w-full h-auto transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                          />

                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ni-black/70">
                            <div className="bg-ni-white text-ni-black p-4 border-4 border-ni-black shadow-brutal">
                              <ZoomIn size={32} strokeWidth={3} />
                            </div>
                          </div>
                        </div>

                        {/* Title bar */}
                        <div
                          className={`${accentColor} border-t-4 border-ni-black p-3 sm:p-4`}
                        >
                          <p className="font-black uppercase text-sm sm:text-base text-ni-black tracking-wide">
                            {album.title}
                          </p>
                          <p className="text-xs font-bold mt-1 opacity-80">
                            {album.images?.length || 0} Photos |{" "}
                            {new Date(album.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {albums.length === 0 && (
                <div className="text-center py-20 sm:py-32 border-4 border-ni-black bg-ni-gray shadow-brutal-lg">
                  <div className="relative z-10">
                    <p className="text-3xl sm:text-5xl font-black text-ni-black uppercase mb-4">
                      No albums found
                    </p>
                    <p className="text-lg sm:text-2xl font-bold mt-4 bg-ni-white inline-block px-4 sm:px-6 py-2 sm:py-3 border-4 border-ni-black shadow-brutal">
                      Try a different category!
                    </p>
                  </div>
                </div>
              )}

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => setPage(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="bg-ni-white border-4 border-ni-black p-3 hover:bg-ni-black hover:text-ni-white disabled:opacity-50 disabled:hover:bg-ni-white disabled:hover:text-ni-black transition-all shadow-brutal disabled:shadow-none"
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <div className="font-black text-xl">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <button
                    onClick={() => setPage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="bg-ni-white border-4 border-ni-black p-3 hover:bg-ni-black hover:text-ni-white disabled:opacity-50 disabled:hover:bg-ni-white disabled:hover:text-ni-black transition-all shadow-brutal disabled:shadow-none"
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>

            {/* Album Viewer Modal */}
            {selectedAlbum &&
              createPortal(
                <div className="fixed inset-0 z-9999 flex flex-col bg-ni-black/95 animate-in fade-in duration-200">
                  {/* Toolbar */}
                  <div className="flex justify-between items-center p-4 bg-ni-black text-ni-white border-b border-ni-gray-800">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-black uppercase truncate max-w-md">
                        {selectedAlbum.title}
                      </h3>
                      <span className="text-sm font-mono bg-ni-gray-800 px-2 py-1 rounded">
                        {selectedAlbum.images.findIndex(
                          (img) => img._id === activeImage?._id
                        ) + 1}{" "}
                        / {selectedAlbum.images.length}
                      </span>
                    </div>
                    <button
                      onClick={closeAlbum}
                      className="p-2 hover:bg-ni-gray-800 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Main Image Stage */}
                    <div className="flex-1 relative flex items-center justify-center bg-ni-black p-4 lg:p-8">
                      {activeImage ? (
                        <>
                          <img
                            src={activeImage.url}
                            alt={activeImage.caption || "Gallery Image"}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                          />

                          {/* Navigation Arrows */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-ni-black/50 hover:bg-ni-neon hover:text-ni-black text-ni-white border-2 border-ni-white hover:border-ni-black transition-all rounded-full"
                          >
                            <ChevronLeft size={24} strokeWidth={3} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-ni-black/50 hover:bg-ni-neon hover:text-ni-black text-ni-white border-2 border-ni-white hover:border-ni-black transition-all rounded-full"
                          >
                            <ChevronRight size={24} strokeWidth={3} />
                          </button>

                          {/* Caption Overlay */}
                          {activeImage.caption && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-ni-black/80 text-ni-white px-6 py-3 border-2 border-ni-white max-w-2xl text-center backdrop-blur-sm">
                              <p className="font-bold text-lg">
                                {activeImage.caption}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-ni-gray-500 font-mono">
                          No images in this album
                        </div>
                      )}
                    </div>

                    {/* Thumbnails Sidebar */}
                    <div className="h-32 lg:h-full lg:w-80 bg-ni-gray-900 border-t lg:border-t-0 lg:border-l border-ni-gray-800 overflow-y-auto p-4">
                      <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
                        {selectedAlbum.images.map((img) => (
                          <div
                            key={img._id}
                            onClick={() => setActiveImage(img)}
                            className={`aspect-square cursor-pointer overflow-hidden border-2 transition-all ${
                              activeImage?._id === img._id
                                ? "border-ni-neon opacity-100 ring-2 ring-ni-neon/50"
                                : "border-transparent opacity-60 hover:opacity-100 hover:border-ni-white"
                            }`}
                          >
                            <img
                              src={img.thumb || img.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
