import { useState, useEffect } from "react";
import {
  Eye,
  Share2,
  Users,
  TrendingUp,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaCopy } from "react-icons/fa";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";

const TipStats = ({ tipId, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [tipId]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get(`/tips/${tipId}/analytics`);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "twitter":
        return <FaTwitter className="text-blue-400" />;
      case "facebook":
        return <FaFacebook className="text-blue-600" />;
      case "linkedin":
        return <FaLinkedin className="text-blue-700" />;
      case "whatsapp":
        return <FaWhatsapp className="text-green-500" />;
      case "copy":
        return <FaCopy className="text-gray-500" />;
      default:
        return <Share2 size={16} className="text-gray-500" />;
    }
  };

  const getMaxViews = () => {
    if (!analytics?.viewsOverTime?.length) return 1;
    return Math.max(...analytics.viewsOverTime.map((v) => v.views), 1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white border-4 border-black shadow-brutal max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-48 mb-6" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white border-4 border-black shadow-brutal p-8 text-center">
          <p className="font-bold text-lg mb-4">Failed to load analytics</p>
          <button
            onClick={onClose}
            className="bg-ni-black text-white px-6 py-2 font-bold border-2 border-black"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black shadow-brutal max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-ni-black text-white p-4 flex justify-between items-center border-b-4 border-black">
          <div>
            <h2 className="text-xl font-black">Blog Analytics</h2>
            <p className="text-sm opacity-80 truncate max-w-md">{analytics.tip.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-ni-neon border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={20} />
                <span className="font-bold text-sm">Total Views</span>
              </div>
              <p className="text-3xl font-black">{analytics.stats.totalViews}</p>
            </div>

            <div className="bg-ni-cyan border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} />
                <span className="font-bold text-sm">Unique Viewers</span>
              </div>
              <p className="text-3xl font-black">{analytics.stats.uniqueViewers}</p>
            </div>

            <div className="bg-ni-pink border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center gap-2 mb-2">
                <Share2 size={20} />
                <span className="font-bold text-sm">Total Shares</span>
              </div>
              <p className="text-3xl font-black">{analytics.stats.totalShares}</p>
            </div>

            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                <span className="font-bold text-sm">Last 7 Days</span>
              </div>
              <p className="text-2xl font-black">
                {analytics.stats.last7DaysViews} <span className="text-sm font-bold">views</span>
              </p>
            </div>
          </div>

          {/* Views Over Time Chart */}
          <div className="bg-white border-4 border-black p-4 shadow-brutal">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Views Over Time (Last 7 Days)
            </h3>
            <div className="flex items-end gap-2 h-32">
              {analytics.viewsOverTime.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-ni-cyan border-2 border-black transition-all hover:bg-ni-neon"
                    style={{
                      height: `${(day.views / getMaxViews()) * 100}%`,
                      minHeight: day.views > 0 ? "8px" : "2px",
                    }}
                    title={`${day.views} views`}
                  />
                  <span className="text-xs font-bold mt-2 text-gray-600">
                    {formatDate(day.date)}
                  </span>
                  <span className="text-xs font-black">{day.views}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shares by Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <h3 className="font-black mb-4 flex items-center gap-2">
                <Share2 size={20} />
                Shares by Platform
              </h3>
              {Object.keys(analytics.sharesByPlatform).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.sharesByPlatform)
                    .sort((a, b) => b[1] - a[1])
                    .map(([platform, count]) => (
                      <div key={platform} className="flex items-center gap-3">
                        {getPlatformIcon(platform)}
                        <span className="font-bold capitalize flex-1">{platform}</span>
                        <span className="bg-ni-black text-white px-3 py-1 text-sm font-black">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No shares yet</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white border-4 border-black p-4 shadow-brutal">
              <h3 className="font-black mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Recent Activity
              </h3>
              {analytics.recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analytics.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm border-b border-gray-200 pb-2"
                    >
                      {activity.type === "view" ? (
                        <Eye size={14} className="text-ni-cyan" />
                      ) : (
                        getPlatformIcon(activity.platform)
                      )}
                      <span className="font-bold capitalize">
                        {activity.type}
                        {activity.platform && activity.type === "share" && (
                          <span className="text-gray-500 ml-1">({activity.platform})</span>
                        )}
                      </span>
                      <span className="text-gray-500 text-xs ml-auto">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No activity yet</p>
              )}
            </div>
          </div>

          {/* Blog Info */}
          <div className="bg-gray-100 border-4 border-black p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published on</p>
              <p className="font-bold">
                {new Date(analytics.tip.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <a
              href={`${import.meta.env.VITE_CLIENT_URL || "https://ni-itclub.web.app"}/tips/${analytics.tip.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ni-black text-white px-4 py-2 font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <ExternalLink size={16} />
              View Blog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipStats;
