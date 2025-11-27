import React from "react";
import Card from "../ui/Card";
import { Binary, Zigzag } from "../ui/Doodles";
import { activities } from "../../data/mockData";

const Activities = () => {
  return (
    <section className="bg-ni-gray py-24 border-y-4 border-ni-black relative overflow-hidden">
      <Binary className="absolute top-0 left-0 w-full text-ni-black opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 relative">
          <h2 className="text-6xl font-black uppercase inline-block bg-ni-white border-brutal px-8 py-4 shadow-brutal transform -rotate-2">
            What We Do
          </h2>
          <Zigzag className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-64 text-ni-pink" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activities.map((activity, index) => (
            <Card
              key={activity.id}
              rotate={index % 3 === 0 ? -2 : index % 3 === 1 ? 2 : 0}
              className="bg-ni-white group hover:z-20"
            >
              <div className="absolute -top-6 -right-6 bg-ni-neon border-brutal p-4 transform rotate-12 group-hover:rotate-0 transition-transform">
                <activity.icon size={32} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 mt-4">
                {activity.title}
              </h3>
              <p className="font-bold text-lg">{activity.description}</p>
              <div className="mt-6 h-2 bg-ni-black w-1/2 group-hover:w-full transition-all duration-300"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
