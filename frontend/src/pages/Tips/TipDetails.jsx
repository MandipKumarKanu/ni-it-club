import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  CheckCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";
import SEO from "../../components/SEO";

const TipDetails = () => {
  const { slug } = useParams();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTip();
  }, [slug]);

  // Track page view
  useEffect(() => {
    if (tip && slug) {
      const sessionId = sessionStorage.getItem("traffic_session_id") || 
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("traffic_session_id", sessionId);
      
      api.post(`/tips/slug/${slug}/view`, { sessionId }).catch(() => {});
    }
  }, [tip, slug]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowShareOptions(false);
    };
    if (showShareOptions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showShareOptions]);

  const fetchTip = async () => {
    try {
      const { data } = await api.get(`/tips/slug/${slug}`);
      setTip(data);
    } catch (error) {
      console.error("Failed to fetch tip", error);
    } finally {
      setLoading(false);
    }
  };

  const shareTip = async (platform) => {
    const baseUrl = import.meta.env.MODE === "development" 
      ? "http://localhost:5000" 
      : "https://ni-it-club.vercel.app";
    // Use backend share URL (has OG meta tags and redirects to frontend)
    const shareUrl = `${baseUrl}/api/tips/share/${tip.slug}`;
    const text = "Check out this blog: " + tip.title;

    // Track share action
    const sessionId = sessionStorage.getItem("traffic_session_id") || "";
    api.post(`/tips/slug/${tip.slug}/share`, { platform, sessionId }).catch(() => {});

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
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
          encodeURIComponent(shareUrl),
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        "https://wa.me/?text=" + encodeURIComponent(text + " " + shareUrl),
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(shareUrl),
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(shareUrl),
        "_blank"
      );
    }
    setShowShareOptions(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-5xl">
        <div className="bg-white border-4 border-black p-12 shadow-brutal inline-block">
          <h1 className="text-4xl font-black mb-4">Tip Not Found</h1>
          <Link to="/tips" className="text-ni-neon hover:underline font-bold">
            &larr; Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {tip && (
        <SEO
          title={tip.title}
          description={tip.content.replace(/<[^>]*>/g, "").substring(0, 155)}
          image={tip.coverImage.url}
          url={`/tips/${tip.slug}`}
          keywords={`${tip.title}, tech tips, tutorials, NI IT Club`}
        />
      )}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link
          to="/tips"
          className="inline-flex items-center gap-2 font-black mb-8 hover:text-ni-neon transition-colors bg-white border-4 border-black px-6 py-3 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 "
        >
          <ArrowLeft size={20} /> Back to Blogs
        </Link>

        <article className="bg-white border-4 border-black shadow-brutal">
          <div className="p-8 md:p-12">
            <header className="mb-8 pb-8 border-b-4 border-black">
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {tip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 font-bold">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(tip.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} />
                  {tip.author?.name || "Admin"}
                </div>
              </div>
              {tip.deadline && (
                <div className="mt-6 bg-red-500 border-4 border-black p-4 shadow-brutal text-white">
                  <p className="font-black flex items-center gap-2">
                    <Clock size={20} />
                    Deadline:{" "}
                    {new Date(tip.deadline).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </header>

            <div className="mb-10 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
              <img
                src={tip.coverImage.url}
                alt={tip.title}
                className="w-full h-auto"
              />
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:font-black prose-a:text-ni-neon prose-a:font-bold prose-strong:font-black prose-img:border-4 prose-img:border-black prose-img:shadow-[4px_4px_0px_0px_#000]"
              dangerouslySetInnerHTML={{ __html: tip.content }}
            />

            <div className="mt-12 pt-8 border-t-4 border-black flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="font-black uppercase">Share this blog:</div>
                <p className="text-xs text-gray-500 mt-1">Use share button for best preview on social media</p>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareOptions(!showShareOptions);
                  }}
                  className="bg-ni-pink border-4 border-black py-3 px-6 font-black uppercase shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 cursor-target"
                >
                  <Share2 size={20} strokeWidth={3} />
                  Share
                </button>

                {showShareOptions && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border-4 border-black shadow-brutal z-20 min-w-[200px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareTip("copy");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-neon transition-colors flex items-center gap-3 border-b-3 border-black"
                    >
                      {copied ? (
                        <CheckCircle size={18} strokeWidth={3} />
                      ) : (
                        <ExternalLink size={18} strokeWidth={3} />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareTip("twitter");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3 border-b-3 border-black"
                    >
                      Twitter/X
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareTip("whatsapp");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-neon transition-colors flex items-center gap-3 border-b-3 border-black"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareTip("linkedin");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3 border-b-3 border-black"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareTip("facebook");
                      }}
                      className="w-full px-4 py-3 text-left font-bold uppercase text-sm hover:bg-ni-cyan transition-colors flex items-center gap-3"
                    >
                      Facebook
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default TipDetails;
