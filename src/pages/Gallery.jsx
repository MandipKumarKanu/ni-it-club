import React, { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import Button from "../components/ui/Button";
import { AngleBracket, Star, Dots, Zigzag } from "../components/ui/Doodles";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState("All");

  const categories = ["All", "Hackathons", "Workshops", "Socials"];

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
      src: "https://placehold.co/600x400/ff3333/ffffff?text=Social+2",
      category: "Socials",
      title: "Gaming Night",
    },
  ];

  const filteredImages =
    category === "All"
      ? images
      : images.filter((img) => img.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <Dots className="absolute top-0 left-0 w-full h-full text-ni-black opacity-5 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
        <div>
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 relative inline-block">
            Gallery
            <Star className="absolute -top-8 -right-8 w-16 h-16 text-ni-neon animate-spin-slow" />
          </h1>
          <p className="text-xl font-bold max-w-xl bg-ni-white border-brutal p-4 transform -rotate-1 shadow-brutal">
            Capturing the chaos and creativity of our community.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 font-black uppercase border-brutal transition-all transform hover:-translate-y-1 ${
                category === cat
                  ? "bg-ni-black text-ni-neon shadow-brutal rotate-2"
                  : "bg-ni-white text-ni-black hover:bg-ni-pink hover:text-ni-white hover:rotate-2"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid relative group cursor-pointer p-2 bg-ni-white border-brutal shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            style={{ transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)` }}
            onClick={() => setSelectedImage(image)}
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-ni-black border-2 border-ni-white z-20"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-ni-black border-2 border-ni-white z-20"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-ni-black border-2 border-ni-white z-20"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-ni-black border-2 border-ni-white z-20"></div>

            <div className="overflow-hidden border-2 border-ni-black">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-ni-neon text-ni-black p-3 border-brutal shadow-brutal transform rotate-12 scale-125">
                <ZoomIn size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="mt-3 text-center font-black uppercase bg-ni-black text-ni-white py-1 transform -rotate-1">
              {image.title}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ni-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col animate-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-ni-neon border-brutal p-4 mb-4 shadow-brutal transform -rotate-1">
              <h3 className="text-2xl font-black uppercase">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-ni-black text-ni-white hover:bg-ni-pink p-2 transition-colors border-2 border-ni-white shadow-sm"
              >
                <X size={24} strokeWidth={4} />
              </button>
            </div>
            <div className="border-brutal bg-ni-white p-4 shadow-brutal-lg overflow-hidden transform rotate-1 relative">
              <Zigzag className="absolute top-0 left-0 w-full text-ni-gray opacity-20" />
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[70vh] border-2 border-ni-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
