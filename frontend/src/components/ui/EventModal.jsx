import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  ArrowRight,
  Trophy,
  Code2,
  Mic,
  BookOpen,
  Star,
  Download,
  ExternalLink,
  Share2,
  CheckCircle,
  Users,
  Tag,
  Zap,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import {
  openGoogleCalendar,
  downloadICalFile,
} from "../../utils/calendarUtils";

const EventModal = ({ event, onClose }) => {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowCalendarOptions(false);
      setShowShareOptions(false);
    };
    if (showCalendarOptions || showShareOptions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showCalendarOptions, showShareOptions]);

  const isUpcoming = () => {
    if (!event) return false;
    const eventDate = new Date(event.date);
    if (event.timeFrom) {
      const timeParts = event.timeFrom.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const meridiem = timeParts[3];
        if (meridiem) {
          if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
          else if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
        }
        eventDate.setHours(hours, minutes, 0, 0);
      }
    }
    return eventDate > new Date();
  };

  const shareEvent = async (platform) => {
    const eventUrl = window.location.origin + "/events?highlight=" + event._id;
    const text = "Check out this event: " + event.name;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(eventUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else if (platform === "twitter") {
      window.open(
        "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(text) +
          "&url=" +
          encodeURIComponent(eventUrl),
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        "https://wa.me/?text=" + encodeURIComponent(text + " " + eventUrl),
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(eventUrl),
        "_blank"
      );
    }
    setShowShareOptions(false);
  };

  if (!event) return null;

  const typeConfig = {
    Workshop: { color: "bg-ni-cyan", icon: Code2 },
    Hackathon: { color: "bg-ni-neon", icon: Trophy },
    "Tech Talk": { color: "bg-ni-pink", icon: Mic },
    "Study Group": { color: "bg-ni-blue", icon: BookOpen },
    Other: { color: "bg-gray-400", icon: Star },
  };

  const config = typeConfig[event.category] || typeConfig["Workshop"];
  const Icon = config.icon;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-ni-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl bg-ni-white flex flex-col sm:border-4 border-ni-black shadow-brutal animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div
          className={`${config.color} border-b-4 border-ni-black p-4 flex items-center gap-4 shrink-0`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-ni-black text-ni-white px-2 py-0.5 font-black uppercase text-xs flex items-center gap-1.5">
                <Icon size={12} strokeWidth={3} />
                {event.category}
              </span>
              {event.isFeatured && (
                <span className="bg-ni-white text-ni-black px-2 py-0.5 font-black uppercase text-xs flex items-center gap-1 border-2 border-ni-black">
                  <Star size={10} fill="currentColor" />
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase leading-tight truncate">
              {event.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-ni-white border-4 border-ni-black p-2 hover:bg-ni-black hover:text-ni-white transition-all active:translate-y-1 active:shadow-none shadow-brutal-sm shrink-0"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {event.image?.url && (
            <div className="relative border-b-4 border-ni-black aspect-video sm:aspect-[21/9]">
              <img
                src={event.image.url}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 border-4 border-ni-black p-4 flex items-center gap-4 shadow-brutal-sm">
                <div className="bg-ni-neon border-2 border-ni-black p-2.5 shrink-0">
                  <Calendar size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black uppercase text-xs text-gray-500 mb-0.5">
                    Date
                  </p>
                  <p className="font-bold text-lg leading-none">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border-4 border-ni-black p-4 flex items-center gap-4 shadow-brutal-sm">
                <div className="bg-ni-cyan border-2 border-ni-black p-2.5 shrink-0">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black uppercase text-xs text-gray-500 mb-0.5">
                    Time
                  </p>
                  <p className="font-bold text-lg leading-none">
                    {event.timeFrom} - {event.timeTo}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border-4 border-ni-black p-4 flex items-center gap-4 shadow-brutal-sm sm:col-span-2 lg:col-span-1">
                <div className="bg-ni-pink border-2 border-ni-black p-2.5 shrink-0">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="font-black uppercase text-xs text-gray-500 mb-0.5">
                    Location
                  </p>
                  <p className="font-bold text-lg leading-none truncate block w-full">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            {isUpcoming() && (
              <div className="bg-ni-black text-ni-neon p-4 sm:p-6 text-center border-4 border-ni-black shadow-brutal bg-[url('/noise.png')]">
                <p className="font-black uppercase tracking-widest text-sm mb-2 text-ni-white">
                  Event Starts In
                </p>
                <div className="flex justify-center scale-90 sm:scale-100">
                  <CountdownTimer
                    eventDate={event.date}
                    eventTime={event.timeFrom}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-ni-black/10" />
                <h3 className="font-black uppercase text-xl text-ni-black">
                  About Event
                </h3>
                <div className="flex-1 h-1 bg-ni-black/10" />
              </div>

              <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 font-medium">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {event.details || event.description || event.shortDetails}
                </p>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 font-bold text-xs uppercase border-2 border-ni-black rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t-4 border-ni-black bg-white p-4 shrink-0 flex flex-col sm:flex-row gap-3">
          {event.isRegisterable && event.registrationLink ? (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-ni-black text-ni-white border-4 border-ni-black py-3.5 px-6 font-black uppercase text-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-ni-neon hover:text-ni-black transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              <CheckCircle size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
              Register Now
            </a>
          ) : (
            <div className="flex-1 bg-gray-200 border-4 border-ni-black py-3.5 px-6 font-black uppercase text-center text-gray-500 text-sm sm:text-base flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              {event.status === "completed"
                ? "Event Completed"
                : "Registration Closed"}
            </div>
          )}

          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendarOptions(!showCalendarOptions);
                  setShowShareOptions(false);
                }}
                className="w-full bg-white border-4 border-ni-black py-3.5 px-4 font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-ni-cyan transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
                title="Add to Calendar"
              >
                <CalendarPlus size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
                <span className="sm:hidden">Calendar</span>
              </button>

              {showCalendarOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-ni-white border-4 border-ni-black shadow-brutal z-50 animate-in slide-in-from-bottom-2 duration-200">
                  <button
                    onClick={() => {
                      openGoogleCalendar(event);
                      setShowCalendarOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left font-bold uppercase text-xs hover:bg-ni-neon border-b-2 border-ni-black flex items-center gap-2"
                  >
                    <ExternalLink size={14} /> Google Calendar
                  </button>
                  <button
                    onClick={() => {
                      downloadICalFile(event);
                      setShowCalendarOptions(false);
                    }}
                    className="w-full px-4 py-3 text-left font-bold uppercase text-xs hover:bg-ni-cyan flex items-center gap-2"
                  >
                    <Download size={14} /> Download .ics
                  </button>
                </div>
              )}
            </div>

            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareOptions(!showShareOptions);
                  setShowCalendarOptions(false);
                }}
                className="w-full bg-white border-4 border-ni-black py-3.5 px-4 font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-ni-pink transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
                title="Share Event"
              >
                <Share2 size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
                <span className="sm:hidden">Share</span>
              </button>

              {showShareOptions && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-ni-white border-4 border-ni-black shadow-brutal z-50 animate-in slide-in-from-bottom-2 duration-200">
                  <button
                    onClick={() => shareEvent("copy")}
                    className="w-full px-4 py-3 text-left font-bold uppercase text-xs hover:bg-ni-neon border-b-2 border-ni-black flex items-center gap-2"
                  >
                    {copied ? (
                      <CheckCircle size={14} />
                    ) : (
                      <ExternalLink size={14} />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={() => shareEvent("twitter")}
                    className="w-full px-4 py-3 text-left font-bold uppercase text-xs hover:bg-ni-cyan border-b-2 border-ni-black flex items-center gap-2"
                  >
                    Twitter / X
                  </button>
                  <button
                    onClick={() => shareEvent("whatsapp")}
                    className="w-full px-4 py-3 text-left font-bold uppercase text-xs hover:bg-ni-neon flex items-center gap-2"
                  >
                    WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventModal;
