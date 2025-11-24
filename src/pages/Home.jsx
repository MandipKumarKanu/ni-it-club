import React from "react";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { stats, teamMembers, activities } from "../data/mockData";

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-ni-white border-b-4 border-ni-black py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-ni-black drop-shadow-[4px_4px_0px_rgba(204,255,0,1)]">
              Welcome to <br />
              <span className="text-ni-neon bg-ni-black px-4 inline-block transform -rotate-2">
                NI IT Club
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-8 border-l-8 border-ni-red pl-6 py-2">
              Where Innovation Meets Technology.
            </p>
            <p className="text-xl mb-10 max-w-2xl font-medium text-gray-800">
              We are a community of builders, breakers, and creators. Join us to
              level up your skills and build the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" className="text-xl px-8 py-4">
                Join Us Today <ArrowRight className="ml-2" strokeWidth={3} />
              </Button>
              <Button variant="secondary" className="text-xl px-8 py-4">
                View Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase mb-8 decoration-ni-neon underline decoration-8 underline-offset-4">
              About Us
            </h2>
            <div className="bg-ni-black text-ni-white p-8 shadow-brutal-lg border-2 border-ni-black">
              <p className="text-xl leading-relaxed font-medium mb-6">
                NI IT Club is the premier student organization dedicated to
                fostering a culture of technical excellence and innovation. We
                bridge the gap between academic learning and industry
                requirements through hands-on workshops, hackathons, and
                collaborative projects.
              </p>
              <p className="text-xl leading-relaxed font-medium">
                Our mission is to empower every student with the tools and
                community they need to succeed in the tech world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="flex flex-col items-center justify-center text-center py-10 bg-ni-neon"
              >
                <span className="text-5xl font-black mb-2">{stat.value}</span>
                <span className="text-xl font-bold uppercase tracking-widest">
                  {stat.label}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-black uppercase">Meet Our Team</h2>
          <Button variant="outline" className="hidden md:flex">
            View All Members
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} hoverEffect={true} className="group">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full border-2 border-ni-black bg-ni-gray"
                />
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <span className="bg-ni-black text-ni-neon px-2 py-1 text-sm font-bold uppercase">
                    {member.role}
                  </span>
                </div>
              </div>
              <p className="mb-6 font-medium border-t-2 border-ni-black pt-4">
                {member.description}
              </p>
              <div className="flex gap-3">
                <button className="p-2 border-2 border-ni-black hover:bg-ni-black hover:text-ni-white transition-colors">
                  <Github size={20} />
                </button>
                <button className="p-2 border-2 border-ni-black hover:bg-ni-black hover:text-ni-white transition-colors">
                  <Linkedin size={20} />
                </button>
                <button className="p-2 border-2 border-ni-black hover:bg-ni-black hover:text-ni-white transition-colors">
                  <Twitter size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-ni-gray py-20 border-y-4 border-ni-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black uppercase mb-12 text-center">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="bg-ni-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
                  <activity.icon size={100} />
                </div>
                <div className="relative z-10">
                  <activity.icon
                    size={48}
                    className="mb-6 text-ni-red"
                    strokeWidth={2.5}
                  />
                  <h3 className="text-2xl font-bold uppercase mb-3">
                    {activity.title}
                  </h3>
                  <p className="font-medium">{activity.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-ni-neon border-4 border-ni-black p-12 shadow-brutal-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
            Ready to Join?
          </h2>
          <p className="text-xl font-bold mb-8 max-w-2xl mx-auto">
            Become a part of the most active tech community on campus. No prior
            experience required.
          </p>
          <Button
            variant="primary"
            className="bg-ni-black text-ni-white hover:bg-ni-white hover:text-ni-black text-xl px-12 py-4 mx-auto"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
