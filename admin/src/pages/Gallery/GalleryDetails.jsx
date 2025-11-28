import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const GalleryDetails = ({ galleryId, onClose }) => {
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get(`/gallery/${galleryId}`);
        setGallery(data);
      } catch (error) {
        toast.error("Failed to load gallery details");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [galleryId]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (gallery && gallery.images) {
      setLightboxIndex((prev) => (prev + 1) % gallery.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (gallery && gallery.images) {
      setLightboxIndex(
        (prev) => (prev - 1 + gallery.images.length) % gallery.images.length
      );
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!gallery) return <div className="p-4">Gallery not found</div>;

  return (
    <div className="space-y-6 relative">
      {/* <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full hover:bg-ni-neon hover:text-black transition-colors z-10"
      >
        <X size={20} />
      </button> */}

      <div className="border-b-2 border-black pb-4 pr-10">
        <h2 className="text-3xl font-bold">{gallery.title}</h2>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-gray-600 font-bold">
            {format(new Date(gallery.date), "MMMM dd, yyyy")}
          </span>
          <span className="bg-ni-neon px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000]">
            {gallery.category || "General"}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl mb-4 border-l-4 border-ni-neon pl-3">
          Featured Image
        </h3>
        <div className="border-2 border-black shadow-brutal overflow-hidden">
          <img
            src={gallery.featuredImage?.url}
            alt={gallery.title}
            className="w-full max-h-80 object-cover"
          />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl mb-4 border-l-4 border-ni-neon pl-3">
          Gallery Images ({gallery.images?.length || 0})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.images?.map((img, index) => (
            <div
              key={img._id}
              className="relative group cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.thumb || img.url}
                  alt="Gallery item"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

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
            src={gallery.images[lightboxIndex].url}
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
            {lightboxIndex + 1} / {gallery.images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDetails;
