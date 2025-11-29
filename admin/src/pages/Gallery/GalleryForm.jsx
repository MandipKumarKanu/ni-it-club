import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const GalleryForm = ({ gallery, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (gallery) {
      reset({
        ...gallery,
        date: gallery.date.split("T")[0],
      });
      setExistingImages(gallery.images || []);
    } else {
      reset({});
      setExistingImages([]);
    }
  }, [gallery, reset]);

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await api.delete(`/gallery/${gallery._id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
      toast.success("Image deleted");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("date", data.date);

    if (data.featuredImage && data.featuredImage[0]) {
      formData.append("featuredImage", data.featuredImage[0]);
    }

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      if (gallery) {
        await api.put(`/gallery/${gallery._id}`, formData);
        toast.success("Gallery updated successfully");
      } else {
        await api.post("/gallery", formData);
        toast.success("Gallery created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-20 border-b-2 border-black pb-4 mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {gallery ? "Edit Gallery" : "Create New Gallery"}
        </h2>
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading
            ? "Saving..."
            : gallery
            ? "Update Gallery"
            : "Create Gallery"}
        </Button>
      </div>

      <div className="space-y-4 px-1">
        <Input
          label="Title"
          {...register("title", { required: "Title is required" })}
          error={errors.title}
        />

        <Input
          label="Date"
          type="date"
          {...register("date", { required: "Date is required" })}
          error={errors.date}
        />

        <div className="space-y-2">
          <Input
            label="Featured Image"
            type="file"
            accept="image/*"
            {...register("featuredImage", {
              required: !gallery && "Featured image is required",
            })}
            error={errors.featuredImage}
          />
          {gallery?.featuredImage && (
            <div className="mt-2">
              <p className="text-sm font-bold mb-1">Current Featured:</p>
              <img
                src={gallery.featuredImage.url || gallery.featuredImage}
                alt="Featured"
                className="w-32 h-20 object-cover border-2 border-black"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Input
            label="Add More Gallery Images"
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
            error={errors.images}
          />

          {existingImages.length > 0 && (
            <div className="mt-4 p-4 border-2 border-black bg-gray-50">
              <p className="font-bold mb-3 flex items-center gap-2">
                Existing Images{" "}
                <span className="bg-ni-neon px-2 text-xs border border-black">
                  {existingImages.length}
                </span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingImages.map((img) => (
                  <div
                    key={img._id}
                    className="relative group border-2 border-black shadow-sm bg-white"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={img.thumb || img.url}
                        alt="Gallery item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-2 border-black shadow-sm hover:bg-red-600 hover:scale-110 transition-all z-10"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default GalleryForm;
