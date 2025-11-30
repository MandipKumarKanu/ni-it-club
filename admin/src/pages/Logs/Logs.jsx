import { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, User, Clock, Activity } from "lucide-react";
import api from "../../services/api";
import Skeleton from "../../components/ui/Skeleton";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    module: "",
    action: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/users/logs/activity?${params}`);
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 text-green-800 border-green-500",
      UPDATE: "bg-blue-100 text-blue-800 border-blue-500",
      DELETE: "bg-red-100 text-red-800 border-red-500",
      LOGIN: "bg-purple-100 text-purple-800 border-purple-500",
    };
    return colors[action] || "bg-gray-100 text-gray-800 border-gray-500";
  };

  const getModuleIcon = (module) => {
    const icons = {
      USER: User,
      EVENT: Activity,
      GALLERY: Activity,
      PROJECT: Activity,
      TEAM: Activity,
      CONTACT: Activity,
      SETTINGS: Activity,
    };
    const Icon = icons[module] || Activity;
    return <Icon size={16} />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase">Activity Logs</h1>
          <p className="text-gray-600 font-bold mt-1">
            Track all user actions in the admin panel
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 font-bold hover:bg-gray-800 border-2 border-black"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>
      {/* Filters */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">Module</label>
            <select
              value={filters.module}
              onChange={(e) => handleFilterChange("module", e.target.value)}
              className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
            >
              <option value="">All Modules</option>
              <option value="USER">User</option>
              <option value="EVENT">Event</option>
              <option value="GALLERY">Gallery</option>
              <option value="PROJECT">Project</option>
              <option value="TEAM">Team</option>
              <option value="CONTACT">Contact</option>
              <option value="SETTINGS">Settings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
              className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", e.target.value)}
              className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
      {/* Logs Table */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ni-neon border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr
                    key={i}
                    className={`border-b-2 border-gray-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-6 w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-48" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-5 w-24" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold">No activity logs found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ni-neon border-b-2 border-black">
                  <tr>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      User
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Module
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      Details
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={log._id}
                      className={`border-b-2 border-gray-200 hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold">
                          {log.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {log.user?.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold border-2 ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getModuleIcon(log.module)}
                          <span className="font-bold">{log.module}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{log.details}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {log.ipAddress || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="border-t-2 border-black bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="text-sm font-bold">
                  Showing {logs.length} of {pagination.total} logs
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border-2 border-black bg-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pagination.pages ||
                          Math.abs(page - filters.page) <= 1
                      )
                      .map((page, index, array) => (
                        <>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span key={`ellipsis-${page}`} className="px-2">
                              ...
                            </span>
                          )}
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border-2 border-black font-bold ${
                              filters.page === page
                                ? "bg-ni-neon"
                                : "bg-white hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        </>
                      ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.pages}
                    className="px-4 py-2 border-2 border-black bg-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Logs;
