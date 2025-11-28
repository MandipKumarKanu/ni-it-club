import { useState, useEffect } from "react";
import { Calendar, Image, Briefcase } from "lucide-react";
import Card from "../components/ui/Card";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get("/settings/dashboard");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-ni-neon">
          <div className="flex items-center gap-4">
            <Calendar size={40} />
            <div>
              <h3 className="font-bold text-xl mb-1">Total Events</h3>
              <p className="text-4xl font-black">
                {stats?.counts?.events?.total || 0}
              </p>
              <p className="text-sm mt-1">
                {stats?.counts?.events?.upcoming || 0} upcoming
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-ni-cyan text-white">
          <div className="flex items-center gap-4">
            <Image size={40} />
            <div>
              <h3 className="font-bold text-xl mb-1">Gallery Albums</h3>
              <p className="text-4xl font-black">
                {stats?.counts?.gallery?.total || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-ni-pink text-white">
          <div className="flex items-center gap-4">
            <Briefcase size={40} />
            <div>
              <h3 className="font-bold text-xl mb-1">Projects</h3>
              <p className="text-4xl font-black">
                {stats?.counts?.projects?.total || 0}
              </p>
              <p className="text-sm mt-1">
                {stats?.counts?.projects?.featured || 0} featured
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Events">
          {stats?.recentActivity?.events?.length > 0 ? (
            <ul className="space-y-2">
              {stats.recentActivity.events.map((event) => (
                <li key={event._id} className="border-l-4 border-ni-neon pl-3">
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()} • {event.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent events</p>
          )}
        </Card>

        <Card title="Recent Projects">
          {stats?.recentActivity?.projects?.length > 0 ? (
            <ul className="space-y-2">
              {stats.recentActivity.projects.map((project) => (
                <li
                  key={project._id}
                  className="border-l-4 border-ni-pink pl-3"
                >
                  <p className="font-bold">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent projects</p>
          )}
        </Card>
      </div>

      <Card title="Welcome to the Admin Panel">
        <p className="text-lg">
          Use the sidebar to manage content for the NI-IT Club website.
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
