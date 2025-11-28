import React, { useState } from "react";
import {
  X,
  ZoomIn,
  Image as ImageIcon,
  Calendar,
  Users,
  Code,
  Camera,
} from "lucide-react";
import { Star, Dots, CircleScribble } from "../components/ui/Doodles";
import SEO from "../components/SEO";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState("All");

  const categories = [
    { name: "All", icon: ImageIcon },
    { name: "Hackathons", icon: Code },
    { name: "Workshops", icon: Calendar },
    { name: "Socials", icon: Users },
  ];

  // Mock images
  const images = [
    {
      id: 1,
      src: "https://placehold.co/600x400/000000/ffffff?text=Hackathon+1",
      category: "Hackathons",
      title: "Winter Hack 2023",
    },
    {
      id: 2,
      src: "https://placehold.co/400x600/ccff00/000000?text=Workshop+1",
      category: "Workshops",
      title: "React Workshop",
    },
    {
      id: 3,
      src: "https://placehold.co/600x600/ff3333/ffffff?text=Social+1",
      category: "Socials",
      title: "Pizza Party",
    },
    {
      id: 4,
      src: "https://placehold.co/500x350/000000/ffffff?text=Hackathon+2",
      category: "Hackathons",
      title: "Coding Night",
    },
    {
      id: 5,
      src: "https://placehold.co/400x500/ccff00/000000?text=Workshop+2",
      category: "Workshops",
      title: "Python Basics",
    },
    {
      id: 6,
      src: "https://placehold.co/600x400/ff3333/ffffff?text=Khelega+Freefire+???",
      category: "Socials",
      title: "Gaming",
    },
  ];

  const filteredImages =
    category === "All"
      ? images
      : images.filter((img) => img.category === category);

  return (
    <>
      <SEO
        title="Gallery"
        description="Browse through memorable moments from NI IT Club events - hackathons, workshops, social meetups, and more."
        keywords="NI IT Club gallery, event photos, hackathon photos, workshop images, tech community"
        url="/gallery"
      />
      <div className="min-h-screen relative overflow-hidden ">
        {/* Subtle Background */}
        <Dots className="absolute top-20 right-10 w-32 h-32 text-ni-black opacity-5" />
        <Dots className="absolute bottom-40 left-10 w-32 h-32 text-ni-black opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero Section */}
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

        {/* Gallery Grid - Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
          {filteredImages.map((image, index) => {
            const colors = ["bg-ni-neon", "bg-ni-cyan", "bg-ni-pink"];
            const accentColor = colors[index % colors.length];

            return (
              <div
                key={image.id}
                className="break-inside-avoid relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="bg-ni-white border-4 border-ni-black shadow-brutal hover:shadow-brutal-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  {/* Accent stripe */}
                  <div className={`h-2 ${accentColor}`}></div>

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
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
                      {image.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 sm:py-32 border-4 border-ni-black bg-ni-gray shadow-brutal-lg">
            <div className="relative z-10">
              <p className="text-3xl sm:text-5xl font-black text-ni-black uppercase mb-4">
                No photos found
              </p>
              <p className="text-lg sm:text-2xl font-bold mt-4 bg-ni-white inline-block px-4 sm:px-6 py-2 sm:py-3 border-4 border-ni-black shadow-brutal">
                Try a different category!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ni-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-ni-white border-4 border-ni-black p-3 sm:p-4 mb-4 shadow-brutal">
              <h3 className="text-xl sm:text-2xl font-black uppercase flex items-center gap-2">
                <Camera size={24} />
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-ni-black text-ni-white hover:bg-ni-pink p-2 transition-all border-4 border-ni-white hover:scale-110 shadow-brutal-sm"
              >
                <X size={24} strokeWidth={4} />
              </button>
            </div>

            {/* Image */}
            <div className="border-4 border-ni-black bg-ni-white p-2 sm:p-4 shadow-brutal-lg">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain border-4 border-ni-black"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Gallery;
