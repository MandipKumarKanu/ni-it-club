import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const EventForm = ({ event, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        date: event.date.split("T")[0],
      });
    } else {
      reset({});
    }
  }, [event, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (data.image[0]) {
          formData.append("image", data.image[0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      if (event) {
        await api.put(`/events/${event._id}`, formData);
        toast.success("Event updated successfully");
      } else {
        await api.post("/events", formData);
        toast.success("Event created successfully");
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
          {event ? "Edit Event" : "Create New Event"}
        </h2>
        <Button type="submit" disabled={isLoading} className="w-auto px-6">
          {isLoading ? "Saving..." : "Save Event"}
        </Button>
      </div>

      <div className="space-y-4 px-1">
        <Input
          label="Event Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Category</label>
            <select
              className="p-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon bg-white"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {[
                "Workshop",
                "Hackathon",
                "Tech Talk",
                "Study Group",
                "Social",
                "Competition",
                "Other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500 text-xs font-bold">
                {errors.category.message}
              </span>
            )}
          </div>
          <Input
            label="Date"
            type="date"
            {...register("date", { required: "Date is required" })}
            error={errors.date}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Time From"
            type="time"
            {...register("timeFrom", { required: "Start time is required" })}
            error={errors.timeFrom}
          />
          <Input
            label="Time To"
            type="time"
            {...register("timeTo", { required: "End time is required" })}
            error={errors.timeTo}
          />
        </div>

        <Input
          label="Location"
          {...register("location", { required: "Location is required" })}
          error={errors.location}
        />

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm">Short Details</label>
          <textarea
            className="p-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon"
            rows="2"
            {...register("shortDetails", {
              required: "Short details are required",
            })}
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm">Full Details</label>
          <textarea
            className="p-2 border-brutal focus:outline-none focus:ring-2 focus:ring-ni-neon"
            rows="4"
            {...register("details", { required: "Details are required" })}
          ></textarea>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRegisterable"
              className="w-5 h-5 accent-ni-neon"
              {...register("isRegisterable")}
            />
            <label htmlFor="isRegisterable" className="font-bold">
              Open for Registration?
            </label>
          </div>

          <Input
            label="Registration Link"
            placeholder="https://..."
            {...register("registrationLink")}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Event Image"
            type="file"
            accept="image/*"
            {...register("image", { required: !event && "Image is required" })}
            error={errors.image}
          />
          {event?.image && (
            <div className="mt-2">
              <p className="text-sm font-bold mb-1">Current Image:</p>
              <img
                src={event.image?.url || event.image}
                alt="Current Event"
                className="w-32 h-20 object-cover border-2 border-black"
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default EventForm;
