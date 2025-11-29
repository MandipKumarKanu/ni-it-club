import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const TeamForm = ({ member, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member) {
      reset({
        ...member,
        linkedin: member.socialLinks?.linkedin,
        github: member.socialLinks?.github,
        twitter: member.socialLinks?.twitter,
        instagram: member.socialLinks?.instagram,
      });
    } else {
      reset({});
    }
  }, [member, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("role", data.role);
    if (data.specializedIn)
      formData.append("specializedIn", data.specializedIn);
    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.github) formData.append("github", data.github);
    if (data.twitter) formData.append("twitter", data.twitter);
    if (data.instagram) formData.append("instagram", data.instagram);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      if (member) {
        await api.put(`/team/${member._id}`, formData);
        toast.success("Member updated successfully");
      } else {
        await api.post("/team", formData);
        toast.success("Member created successfully");
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
          {member ? "Edit Member" : "Create New Member"}
        </h2>
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading ? "Saving..." : member ? "Update Member" : "Create Member"}
        </Button>
      </div>

      <div className="space-y-4 px-1">
        <Input
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name}
        />

        <Input
          label="Role (comma separated)"
          {...register("role", { required: "Role is required" })}
          error={errors.role}
        />

        <Input
          label="Specialized In (e.g., React, Node.js, UI/UX Design)"
          placeholder="Enter specialization areas..."
          {...register("specializedIn")}
          error={errors.specializedIn}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="LinkedIn URL"
            {...register("linkedin")}
            error={errors.linkedin}
          />
          <Input
            label="GitHub URL"
            {...register("github")}
            error={errors.github}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Twitter URL"
            {...register("twitter")}
            error={errors.twitter}
          />
          <Input
            label="Instagram URL"
            {...register("instagram")}
            error={errors.instagram}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Profile Image"
            type="file"
            accept="image/*"
            {...register("image", { required: !member && "Image is required" })}
            error={errors.image}
          />
          {member?.image && (
            <div className="mt-2">
              <p className="text-sm font-bold mb-1">Current Image:</p>
              <img
                src={member.image?.url || member.image}
                alt="Current Member"
                className="w-20 h-20 object-cover rounded-full border-2 border-black"
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default TeamForm;
