import React, { useState } from "react";
import { Calendar, MapPin, Search, Filter } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { events } from "../data/mockData";

const Events = () => {
  const [filter, setFilter] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    // In a real app, we would compare dates. For now, we just return all or filter by mock logic
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-ni-black pb-8">
        <h1 className="text-6xl font-black uppercase tracking-tighter">
          Events
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full sm:w-64 pl-10 pr-4 py-3 border-3 border-ni-black font-bold focus:outline-none focus:shadow-brutal transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              strokeWidth={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "Upcoming" ? "primary" : "secondary"}
              onClick={() => setFilter("Upcoming")}
              className="flex-1 sm:flex-none"
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "Past" ? "primary" : "secondary"}
              onClick={() => setFilter("Past")}
              className="flex-1 sm:flex-none"
            >
              Past
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            hoverEffect={true}
            className="flex flex-col md:flex-row gap-6 p-0 overflow-hidden"
          >
            <div className="bg-ni-black text-ni-neon p-6 flex flex-col items-center justify-center min-w-[150px] text-center border-b-3 md:border-b-0 md:border-r-3 border-ni-black">
              <span className="text-4xl font-black">
                {new Date(event.date).getDate()}
              </span>
              <span className="text-xl font-bold uppercase">
                {new Date(event.date).toLocaleString("default", {
                  month: "short",
                })}
              </span>
              <span className="text-sm font-mono mt-2">
                {new Date(event.date).getFullYear()}
              </span>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-ni-neon text-ni-black px-2 py-1 text-xs font-black uppercase border-2 border-ni-black">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 leading-tight">
                  {event.title}
                </h3>
                <p className="font-medium mb-4 text-gray-800">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto pt-4 border-t-2 border-ni-gray">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <MapPin size={18} /> {event.location}
                </div>
                <Button
                  variant="outline"
                  className="py-2 px-4 text-sm w-full sm:w-auto"
                >
                  Register Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-20 border-3 border-dashed border-ni-gray">
          <p className="text-2xl font-bold text-gray-400">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
