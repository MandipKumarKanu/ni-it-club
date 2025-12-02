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
import { openGoogleCalendar, downloadICalFile } from "../../utils/calendarUtils";

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
        "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(eventUrl),
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        "https://wa.me/?text=" + encodeURIComponent(text + " " + eventUrl),
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(eventUrl),
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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ni-black/90" onClick={onClose} />

      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 bg-ni-black translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4" />
        
        <div className="relative bg-ni-white border-4 sm:border-[6px] border-ni-black max-h-[90vh] overflow-hidden flex flex-col">
          
          <div className={config.color + " border-b-4 sm:border-b-[6px] border-ni-black p-4 sm:p-6"}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-ni-black text-ni-white px-3 py-1.5 font-black uppercase text-xs sm:text-sm flex items-center gap-2 transform -rotate-1">
                    <Icon size={16} strokeWidth={3} />
                    {event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="bg-ni-white text-ni-black border-3 border-ni-black px-2 py-1 font-black uppercase text-[10px] sm:text-xs flex items-center gap-1 transform rotate-1 shadow-brutal-sm">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  )}
                  {event.status && (
                    <span className={"px-2 py-1 font-black uppercase text-[10px] sm:text-xs border-3 border-ni-black transform -rotate-1 " + (
                      event.status === "upcoming" ? "bg-ni-neon text-ni-black" :
                      event.status === "ongoing" ? "bg-ni-cyan text-ni-black" :
                      "bg-gray-300 text-ni-black"
                    )}>
                      <Zap size={10} className="inline mr-1" />
                      {event.status}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                  {event.name}
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="bg-ni-white border-4 border-ni-black p-2 sm:p-3 hover:bg-ni-black hover:text-ni-white transition-all shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 shrink-0"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {event.image?.url && (
              <div className="relative border-b-4 sm:border-b-[6px] border-ni-black">
                <img
                  src={event.image.url}
                  alt={event.name}
                  className="w-full h-48 sm:h-64 md:h-72 object-cover"
                />
              </div>
            )}

            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              {event.shortDetails && (
                <p className="text-lg sm:text-xl font-bold text-gray-700 border-l-4 border-ni-neon pl-4">
                  {event.shortDetails}
                </p>
              )}

              {isUpcoming() && (
                <div className="bg-ni-neon/20 border-4 border-ni-black p-4 sm:p-6 shadow-brutal">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={20} className="text-ni-black" fill="currentColor" />
                    <span className="font-black uppercase text-sm tracking-wider">Event Starts In</span>
                  </div>
                  <CountdownTimer eventDate={event.date} eventTime={event.timeFrom} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-ni-neon border-4 border-ni-black p-4 text-center shadow-brutal transform hover:-translate-y-1 transition-transform">
                  <Calendar className="mx-auto mb-2" size={28} strokeWidth={2.5} />
                  <p className="font-black uppercase text-xs tracking-wider mb-1">Date</p>
                  <p className="font-black text-lg sm:text-xl">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-ni-cyan border-4 border-ni-black p-4 text-center shadow-brutal transform hover:-translate-y-1 transition-transform">
                  <Clock className="mx-auto mb-2" size={28} strokeWidth={2.5} />
                  <p className="font-black uppercase text-xs tracking-wider mb-1">Time</p>
                  <p className="font-black text-lg sm:text-xl">
                    {event.timeFrom} - {event.timeTo}
                  </p>
                </div>
                <div className="bg-ni-pink border-4 border-ni-black p-4 text-center shadow-brutal transform hover:-translate-y-1 transition-transform">
                  <MapPin className="mx-auto mb-2" size={28} strokeWidth={2.5} />
                  <p className="font-black uppercase text-xs tracking-wider mb-1">Location</p>
                  <p className="font-black text-lg sm:text-xl truncate" title={event.location}>
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border-4 border-ni-black p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-black uppercase mb-4 flex items-center gap-2">
                  <span className="bg-ni-black text-ni-white px-3 py-1">About</span>
                  <span className="flex-1 h-1 bg-ni-black"></span>
                </h3>
                <div className="font-medium text-gray-800 text-base sm:text-lg leading-relaxed">
                  <p className="whitespace-pre-wrap">
                    {event.details || event.description || event.shortDetails}
                  </p>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag size={18} strokeWidth={3} className="text-ni-black" />
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-ni-white border-3 border-ni-black px-3 py-1.5 font-bold text-sm uppercase shadow-brutal-sm hover:bg-ni-neon transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* {event.organizer && (
                <div className="flex items-center gap-3 bg-gray-100 border-3 border-ni-black p-3">
                  <Users size={20} strokeWidth={2.5} />
                  <span className="font-bold uppercase text-sm">
                    Organized by: <span className="text-ni-black">{event.organizer.name || "NI-IT Club"}</span>
                  </span>
                </div>
              )} */}
            </div>
          </div>

          <div className="border-t-4 sm:border-t-[6px] border-ni-black bg-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {event.isRegisterable && event.registrationLink ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-ni-black text-ni-white border-4 border-ni-black py-4 px-6 font-black uppercase text-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-ni-neon hover:text-ni-black transition-all flex items-center justify-center gap-2 group"
                >
                  <CheckCircle size={22} strokeWidth={3} />
                  Register Now
                  <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </a>
              ) : event.status === "completed" ? (
                <div className="flex-1 bg-gray-300 border-4 border-ni-black py-4 px-6 font-black uppercase text-center text-gray-600">
                  Event Completed
                </div>
              ) : (
                <div className="flex-1 bg-gray-200 border-4 border-ni-black py-4 px-6 font-black uppercase text-center text-gray-500">
                  Registration Closed
                </div>
              )}

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCalendarOptions(!showCalendarOptions);
                    setShowShareOptions(false);
                  }}
                  className="w-full sm:w-auto bg-ni-cyan border-4 border-ni-black py-4 px-6 font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <CalendarPlus size={22} strokeWidth={3} />
                  <span className="hidden sm:inline">Calendar</span>
                </button>

                {showCalendarOptions && (
                  <div className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-0 mb-2 bg-ni-white border-4 border-ni-black shadow-brutal z-20 min-w-[220px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleCalendar(event);
                        setShowCalendarOptions(false);
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-neon transition-colors flex items-center gap-3 border-b-3 border-ni-black"
                    >
                      <ExternalLink size={18} strokeWidth={3} />
                      Google Calendar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadICalFile(event);
                        setShowCalendarOptions(false);
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3"
                    >
                      <Download size={18} strokeWidth={3} />
                      Download .ics
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareOptions(!showShareOptions);
                    setShowCalendarOptions(false);
                  }}
                  className="w-full sm:w-auto bg-ni-pink border-4 border-ni-black py-4 px-6 font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={22} strokeWidth={3} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {showShareOptions && (
                  <div className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-0 mb-2 bg-ni-white border-4 border-ni-black shadow-brutal z-20 min-w-[200px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareEvent("copy");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-neon transition-colors flex items-center gap-3 border-b-3 border-ni-black"
                    >
                      {copied ? <CheckCircle size={18} strokeWidth={3} /> : <ExternalLink size={18} strokeWidth={3} />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareEvent("twitter");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3 border-b-3 border-ni-black"
                    >
                      Twitter/X
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareEvent("whatsapp");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-neon transition-colors flex items-center gap-3 border-b-3 border-ni-black"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareEvent("linkedin");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3"
                    >
                      LinkedIn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventModal;
