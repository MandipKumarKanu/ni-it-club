import { useState, useEffect } from "react";
import {
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  RefreshCw,
  Activity,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import api from "../../services/api";

const Traffic = () => {
  const [stats, setStats] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [period]);

  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/traffic/stats?period=${period}`);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch traffic stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const { data } = await api.get("/traffic/realtime");
      setRealtime(data);
    } catch (error) {
      console.error("Failed to fetch realtime data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchRealtime()]);
    setRefreshing(false);
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case "desktop":
        return <Monitor size={20} />;
      case "mobile":
        return <Smartphone size={20} />;
      case "tablet":
        return <Tablet size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  const getMaxViews = () => {
    if (!stats?.viewsOverTime?.length) return 1;
    return Math.max(...stats.viewsOverTime.map((v) => v.views));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    
    // For 24h period, format is "2025-12-03 21:00"
    if (period === "24h" && dateStr.includes(" ")) {
      const timePart = dateStr.split(" ")[1]; // "21:00"
      const hour = parseInt(timePart.split(":")[0], 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12} ${ampm}`;
    }
    
    // For other periods, format is "2025-12-03"
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
  };

  const getPageLabel = (path) => {
    const labels = {
      "/": "Home",
      "/events": "Events",
      "/gallery": "Gallery",
      "/showcase": "Showcase",
      "/contact": "Contact",
      "/tips": "Tips",
    };
    return labels[path] || path;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Traffic Monitor</h1>
        <div className="flex items-center gap-3">
          <div className="flex border-brutal overflow-hidden">
            {["24h", "7d", "30d", "90d"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 font-bold text-sm transition-all ${
                  period === p
                    ? "bg-ni-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {p === "24h" ? "24H" : p === "7d" ? "7D" : p === "30d" ? "30D" : "90D"}
              </button>
            ))}
          </div>
          <Button
            onClick={handleRefresh}
            variant="secondary"
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views */}
        <Card className="bg-ni-neon">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide opacity-80">
                Total Views
              </p>
              <p className="text-4xl font-black mt-2">
                {stats?.totalViews?.toLocaleString() || 0}
              </p>
              {stats?.viewsChange !== undefined && (
                <div
                  className={`flex items-center gap-1 mt-2 text-sm font-bold ${
                    stats.viewsChange >= 0 ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {stats.viewsChange >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{Math.abs(stats.viewsChange)}%</span>
                  <span className="opacity-60">vs prev</span>
                </div>
              )}
            </div>
            <Eye size={32} className="opacity-50" />
          </div>
        </Card>

        {/* Unique Visitors */}
        <Card className="bg-ni-cyan text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide opacity-80">
                Unique Visitors
              </p>
              <p className="text-4xl font-black mt-2">
                {stats?.uniqueVisitors?.toLocaleString() || 0}
              </p>
              {stats?.visitorsChange !== undefined && (
                <div
                  className={`flex items-center gap-1 mt-2 text-sm font-bold ${
                    stats.visitorsChange >= 0 ? "text-green-200" : "text-red-200"
                  }`}
                >
                  {stats.visitorsChange >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{Math.abs(stats.visitorsChange)}%</span>
                  <span className="opacity-60">vs prev</span>
                </div>
              )}
            </div>
            <Users size={32} className="opacity-50" />
          </div>
        </Card>

        {/* Active Now */}
        <Card className="bg-ni-pink text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide opacity-80">
                Active Now
              </p>
              <p className="text-4xl font-black mt-2">
                {realtime?.activeCount || 0}
              </p>
              <p className="text-sm mt-2 opacity-60">Last 5 minutes</p>
            </div>
            <Activity size={32} className="opacity-50 animate-pulse" />
          </div>
        </Card>

        {/* Avg per Day */}
        <Card className="bg-ni-black text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide opacity-80">
                Avg / Day
              </p>
              <p className="text-4xl font-black mt-2">
                {stats?.viewsOverTime?.length
                  ? Math.round(
                      stats.totalViews / stats.viewsOverTime.length
                    ).toLocaleString()
                  : 0}
              </p>
              <p className="text-sm mt-2 opacity-60">Page views</p>
            </div>
            <BarChart3 size={32} className="opacity-50" />
          </div>
        </Card>
      </div>

      {/* Views Over Time Chart */}
      <Card title="Views Over Time">
        {stats?.viewsOverTime?.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-end gap-1 h-48">
              {stats.viewsOverTime.map((item, index) => {
                const height = (item.views / getMaxViews()) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-full max-w-10 bg-ni-cyan border-2 border-ni-black transition-all hover:bg-ni-neon"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-ni-black text-white text-xs px-2 py-1 font-bold whitespace-nowrap z-10">
                          {item.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1 mt-2 overflow-x-auto">
              {stats.viewsOverTime.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 text-center text-xs text-gray-500 font-medium truncate"
                >
                  {formatDate(item.date)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available</p>
        )}
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card title="Top Pages">
          {stats?.pageStats?.length > 0 ? (
            <div className="space-y-3 mt-2">
              {stats.pageStats.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-ni-black text-white text-xs font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{getPageLabel(page.path)}</p>
                    <p className="text-xs text-gray-500 truncate">{page.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{page.views}</p>
                    <p className="text-xs text-gray-500">
                      {page.uniqueVisitors} unique
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Device & Browser Stats */}
        <div className="space-y-6">
          {/* Devices */}
          <Card title="Devices">
            {stats?.deviceStats?.length > 0 ? (
              <div className="space-y-3 mt-2">
                {stats.deviceStats.map((device, index) => {
                  const total = stats.deviceStats.reduce(
                    (sum, d) => sum + d.count,
                    0
                  );
                  const percentage = ((device.count / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 border border-gray-200">
                        {getDeviceIcon(device._id)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold capitalize">
                            {device._id || "Unknown"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-ni-cyan"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No data</p>
            )}
          </Card>

          {/* Browsers */}
          <Card title="Browsers">
            {stats?.browserStats?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.browserStats.map((browser, index) => {
                  const colors = [
                    "bg-ni-neon",
                    "bg-ni-cyan text-white",
                    "bg-ni-pink text-white",
                    "bg-ni-black text-white",
                    "bg-gray-200",
                  ];
                  return (
                    <span
                      key={index}
                      className={`px-3 py-2 border-2 border-ni-black font-bold text-sm ${
                        colors[index % colors.length]
                      }`}
                    >
                      {browser._id || "Unknown"}: {browser.count}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No data</p>
            )}
          </Card>
        </div>
      </div>

      {/* Referrers */}
      {stats?.referrerStats?.length > 0 && (
        <Card title="Top Referrers">
          <div className="space-y-2 mt-2">
            {stats.referrerStats.map((ref, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <ExternalLink size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate text-sm">{ref._id}</span>
                </div>
                <span className="font-bold ml-4">{ref.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Pages (Realtime) */}
      {realtime?.activePaths?.length > 0 && (
        <Card
          title="Currently Active Pages"
          action={
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          }
        >
          <div className="flex flex-wrap gap-2 mt-2">
            {realtime.activePaths.map((page, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-green-100 border-2 border-green-500 text-green-800 font-bold text-sm"
              >
                {getPageLabel(page.path)}: {page.count} visitor
                {page.count > 1 ? "s" : ""}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Traffic;
