import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Mail,
  UserPlus,
  Download,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Send,
} from "lucide-react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";

const SubscribersList = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    status: "",
    search: "",
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    status: "active",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [filters]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/newsletter/subscribers?${params}`);
      setSubscribers(data.subscribers);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/newsletter/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      await api.post("/newsletter/subscribers", formData);
      setIsAddModalOpen(false);
      setFormData({ email: "", name: "", status: "active" });
      fetchSubscribers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subscriber");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubscriber = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      await api.put(
        `/newsletter/subscribers/${selectedSubscriber._id}`,
        formData
      );
      setIsEditModalOpen(false);
      setSelectedSubscriber(null);
      fetchSubscribers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subscriber");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubscriber = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/newsletter/subscribers/${selectedSubscriber._id}`);
      setIsDeleteModalOpen(false);
      setSelectedSubscriber(null);
      fetchSubscribers();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/newsletter/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `subscribers-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const openEditModal = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      name: subscriber.name || "",
      status: subscriber.status,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDeleteModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "unsubscribed":
        return <XCircle size={16} className="text-red-600" />;
      case "bounced":
        return <AlertCircle size={16} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-500";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "unsubscribed":
        return "bg-red-100 text-red-800 border-red-500";
      case "bounced":
        return "bg-orange-100 text-orange-800 border-orange-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your email subscribers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate("/newsletter/compose")}
            className="flex items-center gap-2 bg-purple-500"
          >
            <Send size={18} />
            Compose Newsletter
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-green-500"
          >
            <UserPlus size={18} />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 border-2 border-black">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black">{stats.active}</p>
                <p className="text-sm text-gray-600">Active Subscribers</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 border-2 border-black">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-black">{stats.newThisMonth}</p>
                <p className="text-sm text-gray-600">New This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 border-2 border-black">
                <XCircle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-black">{stats.unsubscribed}</p>
                <p className="text-sm text-gray-600">Unsubscribed</p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 border-2 border-black">
                <Mail size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-black">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Subscribers</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-4 border-black p-4 shadow-brutal">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
          <Button
            onClick={() => {
              fetchSubscribers();
              fetchStats();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white border-4 border-black shadow-brutal overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-bold text-gray-600">
              No subscribers found
            </p>
            <p className="text-gray-500">
              Add your first subscriber to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Subscribed
                  </th>
                  <th className="px-4 py-3 text-left font-black uppercase text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber, index) => (
                  <tr
                    key={subscriber._id}
                    className={`border-b-2 border-gray-200 hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="font-bold">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {subscriber.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border-2 ${getStatusColor(
                          subscriber.status
                        )}`}
                      >
                        {getStatusIcon(subscriber.status)}
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-xs font-bold">
                        {subscriber.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(subscriber)}
                          className="p-2 hover:bg-blue-100 border-2 border-transparent hover:border-blue-500 transition-colors"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(subscriber)}
                          className="p-2 hover:bg-red-100 border-2 border-transparent hover:border-red-500 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="border-t-2 border-black bg-gray-50 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
              total)
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ email: "", name: "", status: "active" });
          setError("");
        }}
        title="Add Subscriber"
      >
        <form onSubmit={handleAddSubscriber} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
              {error}
            </div>
          )}
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div>
            <label className="block text-sm font-bold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? "Adding..." : "Add Subscriber"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-200 text-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Subscriber Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSubscriber(null);
          setError("");
        }}
        title="Edit Subscriber"
      >
        <form onSubmit={handleEditSubscriber} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div>
            <label className="block text-sm font-bold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={formLoading} className="flex-1">
              {formLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-200 text-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSubscriber(null);
        }}
        title="Delete Subscriber"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedSubscriber?.email}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleDeleteSubscriber}
              disabled={formLoading}
              className="flex-1 bg-red-500"
            >
              {formLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-200 text-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscribersList;
