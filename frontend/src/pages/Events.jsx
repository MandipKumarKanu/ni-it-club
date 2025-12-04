import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Search,
  Clock,
  ArrowRight,
  Users,
  Zap,
  Filter,
  ChevronRight,
  ChevronLeft,
  Star,
  Code2,
  Trophy,
  Mic,
  BookOpen,
  X,
  Eye,
} from "lucide-react";
import { Dots, Zigzag, WavyLine } from "../components/ui/Doodles";
import api from "../services/api";
import SEO from "../components/SEO";
import Skeleton from "../components/ui/Skeleton";
import EventModal from "../components/ui/EventModal";
import CountdownTimer from "../components/ui/CountdownTimer";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const category = searchParams.get("category") || "All";
  const urlSearchTerm = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== urlSearchTerm) {
        updateParams({ search: searchTerm, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, urlSearchTerm]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
        };

        if (category !== "All") params.category = category;
        if (urlSearchTerm) params.search = urlSearchTerm;

        const { data } = await api.get("/events", { params });
        setEvents(data.docs);
        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          hasPrevPage: data.hasPrevPage,
          hasNextPage: data.hasNextPage,
        });
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, urlSearchTerm, page]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const setCategory = (newCategory) => {
    updateParams({ category: newCategory, page: 1 });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const setPage = (newPage) => {
    updateParams({ page: newPage });
  };

  const eventTypes = [
    "All",
    "Workshop",
    "Hackathon",
    "Tech Talk",
    "Study Group",
  ];

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const otherEvents = events.filter((e) => e._id !== featuredEvent?._id);

  const typeConfig = {
    Workshop: {
      color: "bg-ni-cyan",
      gradient: "from-ni-cyan to-blue-600",
      icon: Code2,
      accent: "text-ni-cyan",
    },
    Hackathon: {
      color: "bg-ni-neon",
      gradient: "from-ni-neon to-yellow-500",
      icon: Trophy,
      accent: "text-ni-neon",
    },
    "Tech Talk": {
      color: "bg-ni-pink",
      gradient: "from-ni-pink to-purple-600",
      icon: Mic,
      accent: "text-ni-pink",
    },
    "Study Group": {
      color: "bg-ni-blue",
      gradient: "from-ni-blue to-teal-600",
      icon: BookOpen,
      accent: "text-ni-blue",
    },
    Other: {
      color: "bg-ni-cyan",
      gradient: "from-ni-cyan to-blue-600",
      icon: Star,
      accent: "text-ni-cyan",
    },
  };

  const getTypeConfig = (type) => typeConfig[type] || typeConfig["Workshop"];

  return (
    <>
      <SEO
        title="Events"
        description="Discover upcoming workshops, hackathons, tech talks, and study groups at NI IT Club. Level up your skills with our exciting events."
        keywords="tech events, workshops, hackathons, tech talks, coding events, NI IT Club events"
        url="/events"
      />
      <div className="min-h-screen relative overflow-hidden bg-ni-white">
        <Dots className="absolute top-20 right-10 w-32 h-32 text-ni-black opacity-5" />
        <Dots className="absolute bottom-40 left-10 w-32 h-32 text-ni-black opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <div className="inline-block bg-ni-neon border-4 border-ni-black px-4 py-2 mb-6 shadow-brutal">
                <span className="font-black uppercase text-sm tracking-wider">
                  NI IT Club
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-ni-black mb-6">
                Upcoming
                <br />
                <span className="text-ni-pink">Events</span>
              </h1>
              <p className="text-xl font-bold text-gray-600 max-w-md">
                Level up your skills with workshops, hackathons, tech talks, and
                study groups.
              </p>
            </div>

            <div className="hidden lg:flex justify-center">
              <Calendar
                className="w-48 h-48 text-ni-neon opacity-60"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {eventTypes.map((type) => {
                const config = type !== "All" ? getTypeConfig(type) : null;
                return (
                  <button
                    key={type}
                    onClick={() => setCategory(type)}
                    className={`px-4 py-3 font-black uppercase border-4 border-ni-black transition-all text-sm flex items-center gap-2 cursor-target ${
                      category === type
                        ? `${config?.color || "bg-ni-black"} ${
                            type === "All" ? "text-ni-white" : "text-ni-black"
                          } shadow-none translate-x-1 translate-y-1`
                        : "bg-ni-white text-ni-black shadow-brutal hover:-translate-y-1"
                    }`}
                  >
                    {config && <config.icon size={16} />}
                    {type === "All" && <Filter size={16} />}
                    {type}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-5 py-3 pl-12 border-4 border-ni-black font-bold focus:outline-none shadow-brutal bg-ni-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                size={20}
                strokeWidth={3}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 relative z-10">
          {loading ? (
            <>
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-8 w-64" />
                </div>
                <div className="bg-ni-white border-4 border-ni-black grid grid-cols-1 lg:grid-cols-3 shadow-brutal">
                  <div className="p-8 lg:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-ni-black flex flex-col items-center justify-center bg-gray-50">
                    <Skeleton className="h-24 w-24 mb-2 bg-gray-300" />
                    <Skeleton className="h-8 w-16 mb-4 bg-gray-300" />
                    <Skeleton className="h-6 w-32 bg-gray-300" />
                  </div>
                  <div className="lg:col-span-2 p-8 lg:p-12">
                    <div className="flex gap-4 mb-6">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-5/6 mb-8" />
                    <div className="flex gap-4">
                      <Skeleton className="h-14 w-40" />
                      <Skeleton className="h-14 w-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-ni-white border-4 border-ni-black overflow-hidden"
                  >
                    <div className="h-2 bg-gray-200" />
                    <div className="p-6">
                      <div className="flex justify-between mb-4">
                        <Skeleton className="h-16 w-16" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-8 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex gap-4 mb-5">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : events.length > 0 ? (
            <>
              {featuredEvent && page === 1 && !urlSearchTerm && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Star
                      className="w-8 h-8 text-ni-neon"
                      fill="currentColor"
                    />
                    <h2 className="text-3xl font-black uppercase">
                      Featured Event
                    </h2>
                    <Zigzag className="w-24 text-ni-pink h-2" />
                  </div>

                  <div
                    className="group relative bg-ni-white border-4 border-ni-black overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoveredEvent(featuredEvent._id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${
                        getTypeConfig(featuredEvent.category).gradient
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    <div className="relative grid grid-cols-1 lg:grid-cols-3">
                      <div
                        className={`${
                          getTypeConfig(featuredEvent.category).color
                        } p-8 lg:p-12 flex flex-col justify-center items-center text-center border-b-4 lg:border-b-0 lg:border-r-4 border-ni-black`}
                      >
                        <div className="text-8xl lg:text-9xl font-black leading-none">
                          {new Date(featuredEvent.date).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-3xl lg:text-4xl font-black uppercase mt-2">
                          {new Date(featuredEvent.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                            }
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 bg-ni-black/20 px-4 py-2">
                          <Clock size={18} strokeWidth={3} />
                          <span className="font-bold">
                            {featuredEvent.timeFrom}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <span className="bg-ni-black text-ni-white px-4 py-2 font-black uppercase text-sm inline-flex items-center gap-2">
                            {React.createElement(
                              getTypeConfig(featuredEvent.category).icon,
                              { size: 16 }
                            )}
                            {featuredEvent.category}
                          </span>
                          <span className="flex items-center gap-2 font-bold text-gray-600 group-hover:text-ni-white transition-colors">
                            <MapPin size={18} />
                            {featuredEvent.location}
                          </span>
                        </div>

                        <h3 className="text-4xl lg:text-5xl font-black uppercase leading-tight mb-4 group-hover:text-ni-white transition-colors">
                          {featuredEvent.name}
                        </h3>

                        <p className="font-bold text-xl text-gray-600 mb-6 group-hover:text-ni-white/80 transition-colors max-w-2xl line-clamp-3">
                          {featuredEvent.shortDetails}
                        </p>

                        {new Date(featuredEvent.date) > new Date() && (
                          <div className="mb-6 p-4 bg-ni-white/90 border-4 border-ni-black inline-block">
                            <CountdownTimer
                              eventDate={featuredEvent.date}
                              eventTime={featuredEvent.timeFrom}
                              variant="compact"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4">
                          {featuredEvent.isRegisterable &&
                            featuredEvent.registrationLink && (
                              <a
                                href={featuredEvent.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-ni-black text-ni-white border-4 border-ni-black px-8 py-4 font-black uppercase text-lg shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all inline-flex items-center gap-3 group-hover:bg-ni-white group-hover:text-ni-black cursor-target"
                              >
                                Register Now
                                <ArrowRight
                                  size={20}
                                  className="group-hover:translate-x-1 transition-transform"
                                />
                              </a>
                            )}
                          <button
                            onClick={() => setSelectedEvent(featuredEvent)}
                            className="bg-transparent text-ni-black border-4 border-ni-black px-8 py-4 font-black uppercase text-lg hover:bg-ni-black hover:text-ni-white transition-all group-hover:border-ni-white group-hover:text-ni-white group-hover:hover:bg-ni-white group-hover:hover:text-ni-black inline-flex items-center gap-2 cursor-target"
                          >
                            <Eye size={20} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-ni-black transform rotate-45 translate-x-16 -translate-y-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}

              {(otherEvents.length > 0 || (page > 1 && events.length > 0)) && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Calendar className="w-7 h-7 text-ni-black" />
                    <h2 className="text-3xl font-black uppercase">
                      {page === 1 && !urlSearchTerm ? "More Events" : "Events"}
                    </h2>
                    <WavyLine className="w-20 text-ni-cyan h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(page === 1 && !urlSearchTerm ? otherEvents : events).map(
                      (event, index) => {
                        const config = getTypeConfig(event.category);
                        const rotations = [
                          "rotate-1",
                          "-rotate-1",
                          "rotate-0.5",
                        ];
                        const rotation = rotations[index % 3];

                        return (
                          <div
                            key={event._id}
                            className={`group relative bg-ni-white border-4 border-ni-black overflow-hidden cursor-pointer transform ${rotation} hover:rotate-0 hover:-translate-y-2 transition-all duration-300`}
                            onMouseEnter={() => setHoveredEvent(event._id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                          >
                            <div className={`h-2 ${config.color}`} />

                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div
                                  className={`${config.color} border-3 border-ni-black p-3 text-center shadow-brutal`}
                                >
                                  <div className="text-2xl font-black leading-none">
                                    {new Date(event.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        day: "numeric",
                                      }
                                    )}
                                  </div>
                                  <div className="text-xs font-bold uppercase mt-1">
                                    {new Date(event.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                      }
                                    )}
                                  </div>
                                </div>
                                <span className="bg-ni-black text-ni-white px-3 py-1.5 font-bold uppercase text-xs flex items-center gap-1.5">
                                  <config.icon size={14} />
                                  {event.category}
                                </span>
                              </div>

                              <h3 className="text-xl font-black uppercase leading-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-ni-black group-hover:to-gray-600 transition-all">
                                {event.name}
                              </h3>
                              <p className="font-bold text-gray-600 text-sm mb-4 line-clamp-2">
                                {event.shortDetails}
                              </p>

                              <div className="flex items-center gap-4 text-sm font-bold text-gray-500 mb-5">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={14} />
                                  {event.timeFrom}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={14} />
                                  {event.location}
                                </span>
                              </div>

                              {/* Countdown Timer for upcoming events */}
                              {new Date(event.date) > new Date() && (
                                <div className="mb-4">
                                  <CountdownTimer
                                    eventDate={event.date}
                                    eventTime={event.timeFrom}
                                    variant="compact"
                                  />
                                </div>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                                className="w-full bg-ni-black text-ni-white border-3 border-ni-black py-3 font-bold uppercase text-sm hover:bg-ni-neon hover:text-ni-black transition-all flex items-center justify-center gap-2 cursor-target"
                              >
                                <Eye size={14} />
                                View Details
                              </button>
                            </div>

                            <div
                              className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => setPage(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="bg-ni-white border-4 border-ni-black p-3 hover:bg-ni-black hover:text-ni-white disabled:opacity-50 disabled:hover:bg-ni-white disabled:hover:text-ni-black transition-all shadow-brutal disabled:shadow-none cursor-target"
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <div className="font-black text-xl">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <button
                    onClick={() => setPage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="bg-ni-white border-4 border-ni-black p-3 hover:bg-ni-black hover:text-ni-white disabled:opacity-50 disabled:hover:bg-ni-white disabled:hover:text-ni-black transition-all shadow-brutal disabled:shadow-none cursor-target"
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-ni-neon/20 transform rotate-3" />
                <div className="relative bg-ni-white border-4 border-ni-black p-12 shadow-brutal">
                  <div className="w-24 h-24 bg-gray-100 border-4 border-ni-black mx-auto mb-6 flex items-center justify-center">
                    <Calendar size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-4xl font-black uppercase mb-4">
                    No Events Found
                  </h3>
                  <p className="text-xl font-bold text-gray-600 mb-6">
                    Try adjusting your search or filter
                  </p>
                  <button
                    onClick={() => {
                      setCategory("All");
                      setSearchTerm(null);
                    }}
                    className="bg-ni-black text-ni-white border-4 border-ni-black px-8 py-4 font-black uppercase shadow-brutal hover:bg-ni-neon hover:text-ni-black transition-all inline-flex items-center gap-2"
                  >
                    <X size={18} />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative mt-20">
          <div className="bg-ni-neon border-y-8 border-ni-black py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, black 10px, black 12px)",
                }}
              />
            </div>

            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-20 h-20 sm:w-28 sm:h-28 border-4 border-ni-black rounded-full flex items-center justify-center transform rotate-12 bg-ni-white">
              <div className="text-center">
                <Zap
                  className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-ni-black"
                  strokeWidth={2.5}
                />
                <span className="text-[10px] sm:text-xs font-black uppercase"></span>
              </div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
                Got an
                <span className="block text-ni-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Idea?
                </span>
              </h2>

              <div className="inline-block bg-ni-black text-ni-white px-6 sm:px-10 py-3 sm:py-4 mb-8 transform -rotate-1">
                <p className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide">
                  Host Your Own Event
                </p>
              </div>

              <p className="text-lg sm:text-xl font-bold text-ni-black/70 max-w-xl mx-auto mb-10">
                Workshops • Tech Talks • Study Sessions • Hackathons
              </p>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-ni-black text-ni-neon border-4 border-ni-black px-10 py-5 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
              >
                <Users size={24} />
                Let's Talk
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};

export default Events;
