import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Mail,
  UserPlus,
  Download,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  Send,
} from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import DeleteConfirmationModal from "../../components/ui/DeleteConfirmationModal";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import toast from "react-hot-toast";

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
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
      toast.success("Subscriber added successfully");
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
      await api.put(`/newsletter/subscribers/${selectedSubscriber._id}`, formData);
      setIsEditModalOpen(false);
      setSelectedSubscriber(null);
      fetchSubscribers();
      fetchStats();
      toast.success("Subscriber updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subscriber");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (subscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subscriberToDelete) return;
    try {
      await api.delete(`/newsletter/subscribers/${subscriberToDelete._id}`);
      fetchSubscribers();
      fetchStats();
      toast.success("Subscriber deleted successfully");
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
      toast.error("Failed to delete subscriber");
    } finally {
      setSubscriberToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/newsletter/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `subscribers-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch (error) {
      console.error("Failed to export:", error);
      toast.error("Failed to export subscribers");
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: "bg-green-200 text-green-600 border-green-600",
      pending: "bg-yellow-200 text-yellow-600 border-yellow-600",
      unsubscribed: "bg-red-200 text-red-600 border-red-600",
      bounced: "bg-orange-200 text-orange-600 border-orange-600",
    };
    return statusConfig[status] || "bg-gray-200 text-gray-600 border-gray-600";
  };

  const tableHeaders = ["Email", "Name", "Status", "Source", "Subscribed", "Actions"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage your email subscribers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/newsletter/compose")} className="flex items-center gap-2 bg-purple-500">
            <Send size={18} />
            Compose Newsletter
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-green-500">
            <UserPlus size={18} />
            Add Subscriber
          </Button>
        </div>
      </div>

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

      <div className="bg-white border-4 border-black p-4 shadow-brutal">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
          <Button onClick={() => { fetchSubscribers(); fetchStats(); }} className="flex items-center gap-2">
            <RefreshCw size={18} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <Table headers={tableHeaders}>
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-6 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><div className="flex gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
            </TableRow>
          ))}
        </Table>
      ) : subscribers.length === 0 ? (
        <div className="bg-white border-4 border-black shadow-brutal p-12 text-center">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl font-bold text-gray-600">No subscribers found</p>
          <p className="text-gray-500">Add your first subscriber to get started</p>
        </div>
      ) : (
        <Table headers={tableHeaders}>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-bold">{subscriber.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{subscriber.name || "-"}</TableCell>
              <TableCell>
                <span className={`py-1 px-3 rounded-full text-xs font-bold border ${getStatusBadge(subscriber.status)}`}>
                  {subscriber.status}
                </span>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-xs font-bold">{subscriber.source}</span>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => openEditModal(subscriber)} className="p-2">
                    <FaEdit size={16} />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(subscriber)} className="p-2">
                    <FaTrash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      {pagination.pages > 1 && (
        <div className="bg-white border-4 border-black shadow-brutal px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
          <div className="flex gap-2">
            <Button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-3 py-1 text-sm">Previous</Button>
            <Button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="px-3 py-1 text-sm">Next</Button>
          </div>
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setFormData({ email: "", name: "", status: "active" }); setError(""); }} title="Add Subscriber">
        <form onSubmit={handleAddSubscriber} className="space-y-4">
          {error && <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">{error}</div>}
          <Input label="Email *" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} required />
          <Input label="Name" type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
          <div>
            <label className="block text-sm font-bold mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={formLoading} className="flex-1">{formLoading ? "Adding..." : "Add Subscriber"}</Button>
            <Button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-200 text-black">Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedSubscriber(null); setError(""); }} title="Edit Subscriber">
        <form onSubmit={handleEditSubscriber} className="space-y-4">
          {error && <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold">{error}</div>}
          <Input label="Email" type="email" value={formData.email} disabled className="bg-gray-100" />
          <Input label="Name" type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
          <div>
            <label className="block text-sm font-bold mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={formLoading} className="flex-1">{formLoading ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 text-black">Cancel</Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSubscriberToDelete(null); }} onConfirm={handleConfirmDelete} itemName="Subscriber" />
    </div>
  );
};

export default SubscribersList;
