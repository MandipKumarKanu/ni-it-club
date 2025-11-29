import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const ProjectForm = ({ project, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [existingScreenshots, setExistingScreenshots] = useState([]);

  useEffect(() => {
    if (project) {
      reset({
        ...project,
        techstack: project.techstack.join(", "),
      });
      setExistingScreenshots(project.screenshots || []);
    } else {
      reset({});
      setExistingScreenshots([]);
    }
  }, [project, reset]);

  const handleDeleteScreenshot = async (screenshotId) => {
    if (!window.confirm("Delete this screenshot?")) return;

    try {
      await api.delete(`/projects/${project._id}/screenshots/${screenshotId}`);
      setExistingScreenshots((prev) =>
        prev.filter((img) => img._id !== screenshotId)
      );
      toast.success("Screenshot deleted");
    } catch (error) {
      toast.error("Failed to delete screenshot");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("details", data.details);
    formData.append("techstack", data.techstack);
    formData.append("github", data.github);
    if (data.link) formData.append("link", data.link);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    if (data.screenshots && data.screenshots.length > 0) {
      for (let i = 0; i < data.screenshots.length; i++) {
        formData.append("screenshots", data.screenshots[i]);
      }
    }

    try {
      if (project) {
        await api.put(`/projects/${project._id}`, formData);
        toast.success("Project updated successfully");
      } else {
        await api.post("/projects", formData);
        toast.success("Project created successfully");
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
          {project ? "Edit Project" : "Create New Project"}
        </h2>
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>

      <div className="space-y-4 px-1">
        <Input
          label="Project Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name}
        />

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm">Details</label>
          <textarea
            className="p-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon"
            rows="3"
            {...register("details", { required: "Details are required" })}
          ></textarea>
        </div>

        <Input
          label="Tech Stack (comma separated)"
          placeholder="React, Node.js, MongoDB"
          {...register("techstack", { required: "Tech stack is required" })}
          error={errors.techstack}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="GitHub URL"
            {...register("github", { required: "GitHub URL is required" })}
            error={errors.github}
          />
          <Input
            label="Live Link (Optional)"
            {...register("link")}
            error={errors.link}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Project Image"
            type="file"
            accept="image/*"
            {...register("image", {
              required: !project && "Image is required",
            })}
            error={errors.image}
          />
          {project?.image && (
            <div className="mt-2">
              <p className="text-sm font-bold mb-1">Current Image:</p>
              <img
                src={project.image?.url || project.image}
                alt="Current Project"
                className="w-32 h-20 object-cover border-2 border-black"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Input
            label="Screenshots (Max 5)"
            type="file"
            accept="image/*"
            multiple
            {...register("screenshots")}
            error={errors.screenshots}
          />

          {existingScreenshots.length > 0 && (
            <div className="mt-4 p-4 border-2 border-black bg-gray-50">
              <p className="font-bold mb-3 flex items-center gap-2">
                Existing Screenshots{" "}
                <span className="bg-ni-neon px-2 text-xs border border-black">
                  {existingScreenshots.length}
                </span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingScreenshots.map((img) => (
                  <div
                    key={img._id}
                    className="relative group border-2 border-black shadow-sm bg-white"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={img.thumb || img.url}
                        alt="Screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteScreenshot(img._id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-2 border-black shadow-sm hover:bg-red-600 hover:scale-110 transition-all z-10"
                      title="Remove screenshot"
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

export default ProjectForm;
