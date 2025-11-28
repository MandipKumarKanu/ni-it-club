import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const EventDetails = ({ eventId, onClose }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${eventId}`);
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!event) return <div className="p-4">Event not found</div>;

  return (
    <div className="space-y-6 relative">
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-black text-white p-2 rounded-full hover:bg-ni-neon hover:text-black transition-colors z-10"
      >
        <X size={20} />
      </button>

      <div className="border-b-2 border-black pb-4 pr-10">
        <h2 className="text-3xl font-bold">{event.name}</h2>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="bg-ni-neon px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000]">
            {event.category}
          </span>
          <span
            className={`px-3 py-1 text-sm font-bold border border-black shadow-[2px_2px_0px_0px_#000] ${
              event.status === "upcoming"
                ? "bg-ni-cyan text-white"
                : event.status === "completed"
                ? "bg-gray-300"
                : "bg-yellow-300"
            }`}
          >
            {event.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="border-2 border-black shadow-brutal overflow-hidden mb-6">
            <img
              src={event.image?.url || event.image}
              alt={event.name}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-ni-blue" />
              <div>
                <p className="font-bold">Date</p>
                <p>{format(new Date(event.date), "EEEE, MMMM dd, yyyy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-ni-blue" />
              <div>
                <p className="font-bold">Time</p>
                <p>
                  {event.timeFrom} - {event.timeTo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-ni-blue" />
              <div>
                <p className="font-bold">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            {event.isRegisterable && (
              <div className="flex items-center gap-3">
                <Users className="text-ni-blue" />
                <div>
                  <p className="font-bold">Registration</p>
                  <p>{event.registeredCount} registered</p>
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ni-blue underline flex items-center gap-1"
                    >
                      <LinkIcon size={14} /> Link
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-xl mb-2 border-l-4 border-ni-neon pl-3">
              Short Description
            </h3>
            <p className="text-gray-700">{event.shortDetails}</p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-2 border-l-4 border-ni-neon pl-3">
              Full Details
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{event.details}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
