import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import DeleteConfirmationModal from "../../components/ui/DeleteConfirmationModal";
import Skeleton from "../../components/ui/Skeleton";
import toast from "react-hot-toast";

const TipsList = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tipToDelete, setTipToDelete] = useState(null);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data } = await api.get("/tips");
      setTips(data.tips);
    } catch (error) {
      console.error("Failed to fetch tips", error);
      toast.error("Failed to load tips");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tip) => {
    setTipToDelete(tip);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tipToDelete) return;

    try {
      await api.delete(`/tips/${tipToDelete._id}`);
      setTips(tips.filter((t) => t._id !== tipToDelete._id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setTipToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Tips & Blogs</h1>
          <p className="text-gray-600">Manage useful articles and guides</p>
        </div>
        <Link to="/tips/new">
          <Button className="flex items-center gap-2 bg-ni-neon text-black border-black hover:translate-y-[-2px] hover:shadow-brutal transition-all">
            <Plus size={20} /> Create New Blog
          </Button>
        </Link>
      </div>

      {tips.length === 0 ? (
        <div className="text-center py-20 bg-white border-4 border-black shadow-brutal">
          <p className="text-xl font-bold text-gray-500">No blogs found yet.</p>
          <Link
            to="/tips/new"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create your first blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip._id}
              className="bg-white border-4 border-black shadow-brutal flex flex-col"
            >
              <div className="h-48 overflow-hidden border-b-4 border-black relative group">
                <img
                  src={tip.coverImage.url}
                  alt={tip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-black mb-2 line-clamp-2">
                  {tip.title}
                </h3>
                {tip.deadline && (
                  <div className="mb-2">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 border border-red-500">
                      Deadline: {new Date(tip.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  {new Date(tip.createdAt).toLocaleDateString()} • By{" "}
                  {tip.author?.name || "Admin"}
                </div>
                <div className="mt-auto flex gap-2">
                  <Link to={`/tips/${tip._id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit2 size={16} /> Edit
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(tip)}
                    className="px-3 py-2 border-2 border-black bg-red-100 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="Blog Post"
      />
    </div>
  );
};

export default TipsList;
