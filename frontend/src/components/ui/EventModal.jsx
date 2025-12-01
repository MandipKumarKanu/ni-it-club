import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Trophy,
  Code2,
  Mic,
  BookOpen,
  Star,
} from "lucide-react";
import Button from "./Button";

const EventModal = ({ event, onClose }) => {
  useEffect(() => {
    if (event) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [event]);

  if (!event) return null;

  const typeConfig = {
    Workshop: { color: "bg-ni-cyan", icon: Code2 },
    Hackathon: { color: "bg-ni-neon", icon: Trophy },
    "Tech Talk": { color: "bg-ni-pink", icon: Mic },
    "Study Group": { color: "bg-ni-blue", icon: BookOpen },
    Other: { color: "bg-ni-black", icon: Star },
  };

  const config = typeConfig[event.category] || typeConfig["Workshop"];
  const Icon = config.icon;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-ni-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-ni-white border-4 border-ni-black shadow-brutal-lg animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          className={`${config.color} border-b-4 border-ni-black p-6 flex justify-between items-start sticky top-0 z-10`}
        >
          <div className="pr-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-ni-black text-ni-white px-3 py-1 font-black uppercase text-xs flex items-center gap-2">
                <Icon size={14} />
                {event.category}
              </span>
              {event.isFeatured && (
                <span className="bg-ni-white text-ni-black border-2 border-ni-black px-2 py-0.5 font-bold uppercase text-[10px]">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase leading-tight">
              {event.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-ni-white border-2 border-ni-black p-2 hover:bg-ni-black hover:text-ni-white transition-colors shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border-2 border-ni-black p-4 text-center">
              <Calendar className="mx-auto mb-2 text-ni-black" size={24} />
              <p className="font-black uppercase text-sm text-gray-500 mb-1">
                Date
              </p>
              <p className="font-bold text-lg">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="bg-gray-50 border-2 border-ni-black p-4 text-center">
              <Clock className="mx-auto mb-2 text-ni-black" size={24} />
              <p className="font-black uppercase text-sm text-gray-500 mb-1">
                Time
              </p>
              <p className="font-bold text-lg">
                {event.timeFrom} - {event.timeTo}
              </p>
            </div>
            <div className="bg-gray-50 border-2 border-ni-black p-4 text-center">
              <MapPin className="mx-auto mb-2 text-ni-black" size={24} />
              <p className="font-black uppercase text-sm text-gray-500 mb-1">
                Location
              </p>
              <p className="font-bold text-lg truncate" title={event.location}>
                {event.location}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black uppercase mb-3 border-b-4 border-ni-neon inline-block">
              About Event
            </h3>
            <div className="prose prose-neutral max-w-none font-medium text-gray-800">
              <p className="whitespace-pre-wrap">
                {event.description || event.shortDetails}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-4 border-ni-black border-dashed">
            {event.isRegisterable && event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-ni-black text-ni-white border-4 border-ni-black py-4 font-black uppercase text-center shadow-brutal hover:bg-ni-neon hover:text-ni-black transition-all flex items-center justify-center gap-2 group"
              >
                Register Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            ) : (
              <div className="flex-1 bg-gray-100 border-4 border-ni-black py-4 font-black uppercase text-center text-gray-400 cursor-not-allowed">
                Registration Closed
              </div>
            )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventModal;
