import React, { useState } from "react";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CurlyBrace,
  Arrow,
  HandDrawnArrow,
  CircleScribble,
  Chip,
} from "../components/ui/Doodles";
import { events } from "../data/mockData";

const Events = () => {
  const [filter, setFilter] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative">
      <Chip className="absolute top-10 right-10 w-32 h-32 text-ni-gray -z-10 transform rotate-45" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-4 border-ni-black pb-10 relative">
        <div className="relative">
          <h1 className="text-7xl font-black uppercase tracking-tighter relative z-10">
            Events
            <CircleScribble className="absolute -top-10 -right-10 w-32 h-32 text-ni-neon -z-10" />
          </h1>
          <p className="text-xl font-bold mt-2 transform rotate-1 bg-ni-black text-ni-white inline-block px-2">
            Don't miss out on the action!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full sm:w-72 pl-4 pr-10 py-4 border-brutal font-bold focus:outline-none focus:shadow-brutal transition-all bg-ni-white transform -rotate-1 focus:rotate-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              size={24}
              strokeWidth={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "Upcoming" ? "primary" : "outline"}
              onClick={() => setFilter("Upcoming")}
              className="flex-1 sm:flex-none transform hover:-rotate-2"
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "Past" ? "primary" : "outline"}
              onClick={() => setFilter("Past")}
              className="flex-1 sm:flex-none transform hover:rotate-2"
            >
              Past
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {filteredEvents.map((event, index) => (
          <div key={event.id} className="relative group">
            <div className="absolute inset-0 bg-ni-black transform translate-x-3 translate-y-3 border-brutal"></div>
            <Card
              rotate={index % 2 === 0 ? -1 : 1}
              hoverEffect={true}
              className="flex flex-col md:flex-row gap-6 p-0 overflow-hidden relative z-10 h-full"
            >
              <div className="bg-ni-black text-ni-neon p-8 flex flex-col items-center justify-center min-w-[160px] text-center border-b-4 md:border-b-0 md:border-r-4 border-ni-black relative">
                <div className="absolute top-2 left-2 w-2 h-2 bg-ni-white rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-ni-white rounded-full"></div>
                <span className="text-5xl font-black">
                  {new Date(event.date).getDate()}
                </span>
                <span className="text-2xl font-bold uppercase">
                  {new Date(event.date).toLocaleString("default", {
                    month: "short",
                  })}
                </span>
                <span className="text-sm font-mono mt-2 bg-ni-white text-ni-black px-2">
                  {new Date(event.date).getFullYear()}
                </span>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between relative">
                <CurlyBrace className="absolute right-2 top-2 h-16 text-ni-gray opacity-50" />

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-ni-pink text-ni-white px-3 py-1 text-sm font-black uppercase border-2 border-ni-black transform -rotate-2 shadow-sm">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-3 leading-tight">
                    {event.title}
                  </h3>
                  <p className="font-bold mb-4 text-gray-800">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto pt-4 border-t-4 border-ni-black border-dashed">
                  <div className="flex items-center gap-2 font-bold text-sm bg-ni-cyan px-2 py-1 border-2 border-ni-black">
                    <MapPin size={18} /> {event.location}
                  </div>
                  <Button
                    variant="outline"
                    className="py-2 px-6 text-sm w-full sm:w-auto hover:bg-ni-black hover:text-ni-neon"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-24 border-4 border-dashed border-ni-black bg-ni-gray relative">
          <HandDrawnArrow className="absolute top-10 left-1/4 w-24 text-ni-black transform rotate-12" />
          <p className="text-3xl font-black text-ni-black uppercase">
            No events found.
          </p>
          <p className="text-xl font-bold mt-2">
            Try searching for something else!
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
