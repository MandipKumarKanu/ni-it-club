import React, { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import Button from "../components/ui/Button";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">
            Gallery
          </h1>
          <p className="text-xl font-medium max-w-xl">
            Capturing the chaos and creativity of our community.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 font-bold uppercase border-2 border-ni-black transition-all ${
                category === cat
                  ? "bg-ni-black text-ni-neon shadow-brutal"
                  : "bg-ni-white text-ni-black hover:bg-ni-gray"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid relative group cursor-pointer border-3 border-ni-black bg-ni-black"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-300 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
              <div className="bg-ni-neon text-ni-black p-2 border-2 border-ni-black shadow-brutal transform rotate-3">
                <ZoomIn size={24} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 bg-ni-white border-t-3 border-r-3 border-ni-black px-4 py-2 font-bold uppercase text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
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
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-ni-neon border-3 border-ni-black p-4 mb-4 shadow-brutal">
              <h3 className="text-xl font-black uppercase">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="hover:bg-ni-black hover:text-ni-neon p-1 transition-colors border-2 border-transparent hover:border-ni-neon"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            <div className="border-3 border-ni-black bg-ni-white p-2 shadow-brutal-lg overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
