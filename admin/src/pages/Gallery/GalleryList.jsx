import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import GalleryForm from "./GalleryForm";
import GalleryDetails from "./GalleryDetails";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import { format } from "date-fns";
import Skeleton from "../../components/ui/Skeleton";

const GalleryList = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [viewingGalleryId, setViewingGalleryId] = useState(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/gallery");
      // Handle both paginated (data.docs) and non-paginated (data) responses
      const galleriesData = Array.isArray(data) ? data : data.docs || [];
      setGalleries(galleriesData);
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
      toast.error("Failed to fetch galleries");
      setGalleries([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      try {
        await api.delete(`/gallery/${id}`);
        toast.success("Gallery deleted");
        fetchGalleries();
      } catch (error) {
        toast.error("Failed to delete gallery");
      }
    }
  };

  const handleEdit = (gallery) => {
    setEditingGallery(gallery);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setViewingGalleryId(id);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditingGallery(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchGalleries();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={20} /> Add Gallery
        </Button>
      </div>

      {loading ? (
        <Table headers={["Featured", "Title", "Date", "Images", "Actions"]}>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="w-16 h-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No galleries found</p>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={20} /> Add Your First Gallery
          </Button>
        </div>
      ) : (
        <Table headers={["Featured", "Title", "Date", "Images", "Actions"]}>
          {galleries.map((gallery) => (
            <TableRow key={gallery._id}>
              <TableCell>
                <img
                  src={gallery.featuredImage?.url || gallery.featuredImage}
                  alt={gallery.title}
                  className="w-16 h-16 object-cover border-2 border-black"
                />
              </TableCell>
              <TableCell className="font-bold">{gallery.title}</TableCell>
              <TableCell>
                {format(new Date(gallery.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{gallery.images?.length || 0} images</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleView(gallery._id)}
                    className="p-2"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(gallery)}
                    className="p-2"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(gallery._id)}
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGallery ? "Edit Gallery" : "Add New Gallery"}
      >
        <GalleryForm gallery={editingGallery} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Gallery Details"
      >
        {viewingGalleryId && (
          <GalleryDetails
            galleryId={viewingGalleryId}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default GalleryList;
