import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowRight,
  Lightbulb,
  Zap,
  Sparkles,
} from "lucide-react";
import { Dots, Zigzag } from "../../components/ui/Doodles";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";
import SEO from "../../components/SEO";

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data } = await api.get("/tips");
      setTips(data.tips);
    } catch (error) {
      console.error("Failed to fetch tips", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Tips & Blogs"
        description="Discover useful guides, tutorials, and resources to level up your tech skills. Learn from expert tips and blogs curated by NI IT Club."
        keywords="tech tips, programming tutorials, coding blogs, web development tips, NI IT Club guides"
        url="/tips"
      />
      <div className="min-h-screen relative overflow-hidden bg-ni-white">
        <Dots className="absolute top-20 right-10 w-32 h-32 text-ni-black opacity-5" />
        <Dots className="absolute bottom-40 left-10 w-32 h-32 text-ni-black opacity-5" />
        <Zigzag className="absolute top-1/3 right-0 w-24 h-24 text-ni-neon opacity-20" />

        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-ni-neon border-4 border-black px-6 py-2 mb-6 shadow-brutal transform -rotate-1">
              <span className="font-black uppercase text-sm tracking-wider flex items-center gap-2">
                <Lightbulb size={18} className="animate-pulse" />
                Learn & Grow
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 uppercase leading-none">
              Tips &{" "}
              <span className="text-ni-neon drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                Blogs
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-gray-600 max-w-3xl mx-auto mb-8">
              Useful guides, tutorials, and resources to level up your skills.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-ni-cyan border-3 border-black px-6 py-3 transform rotate-1 shadow-brutal">
                <span className="font-black text-sm uppercase">
                  Expert Tips
                </span>
              </div>
              <div className="bg-ni-pink border-3 border-black px-6 py-3 transform -rotate-1 shadow-brutal">
                <span className="font-black text-sm uppercase">
                  Step-by-Step Guides
                </span>
              </div>
              <div className="bg-white border-3 border-black px-6 py-3 shadow-brutal">
                <span className="font-black text-sm uppercase">
                  Real Examples
                </span>
              </div>
            </div>
          </div>

          {tips.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-ni-neon/20 transform rotate-3" />
                <div className="relative bg-white border-4 border-black p-12 shadow-brutal">
                  <div className="w-24 h-24 bg-gray-100 border-4 border-black mx-auto mb-6 flex items-center justify-center">
                    <Lightbulb size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-4xl font-black uppercase mb-4">
                    No Blogs Available Yet
                  </h3>
                  <p className="text-xl font-bold text-gray-600">
                    Check back soon for awesome content!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tips.map((tip, index) => {
                const rotations = ["rotate-1", "-rotate-1", "rotate-0"];
                const rotation = rotations[index % 3];
                const accentColors = ["bg-ni-neon", "bg-ni-cyan", "bg-ni-pink"];
                const accentColor = accentColors[index % 3];

                return (
                  <Link
                    key={tip._id}
                    to={`/tips/${tip.slug}`}
                    className={`group block bg-white border-4 border-black shadow-brutal hover:shadow-brutal-lg transform ${rotation} hover:rotate-0 hover:-translate-y-2 transition-all duration-300`}
                  >
                    {/* Accent Bar */}
                    <div
                      className={`h-3 ${accentColor} border-b-4 border-black`}
                    />

                    {/* Image */}
                    <div className="aspect-video overflow-hidden border-b-4 border-black relative">
                      <img
                        src={tip.coverImage.url}
                        alt={tip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Deadline Badge - Floating */}
                      {tip.deadline && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-3 py-2 border-2 border-white shadow-[2px_2px_0px_0px_#000] transform -rotate-3">
                          <Zap size={12} className="inline mr-1" />
                          Deadline:{" "}
                          {new Date(tip.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-black mb-3 line-clamp-2 uppercase leading-tight group-hover:text-ni-neon transition-colors">
                        {tip.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 font-bold">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(tip.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {tip.author?.name || "Admin"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-gray-700 group-hover:text-ni-black transition-colors">
                        Read More{" "}
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 ${accentColor} transform rotate-45 translate-x-12 -translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
        </div>

        {tips.length > 0 && (
          <div className="mt-20 relative">
            <div className="bg-ni-neon border-y-8 border-black py-16 sm:py-20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, black 10px, black 12px)",
                  }}
                />
              </div>

              <div className="relative max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                  Want to{" "}
                  <span className="block text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Contribute?
                  </span>
                </h2>
                <div className="inline-block bg-black text-ni-neon px-8 py-4 mb-8 transform -rotate-1 border-4 border-black shadow-brutal">
                  <p className="text-xl font-black uppercase tracking-wide">
                    Share Your Knowledge
                  </p>
                </div>
                <p className="text-lg sm:text-xl font-bold text-black/70 max-w-xl mx-auto mb-10">
                  Have a cool tip or blog post? We'd love to feature it!
                </p>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 bg-black text-ni-neon border-4 border-black px-10 py-5 font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
                >
                  <Lightbulb size={24} />
                  Get in Touch
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tips;
