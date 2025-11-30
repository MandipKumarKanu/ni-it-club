import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Eye,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TeamForm from "./TeamForm";
import TeamDetails from "./TeamDetails";
import toast from "react-hot-toast";

import Loader from "../../components/ui/Loader";
import Skeleton from "../../components/ui/Skeleton";

const SortableRow = ({ member, handleView, handleEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b-4 border-black last:border-b-0 hover:bg-gray-50 ${
        isDragging ? "bg-ni-neon opacity-80" : ""
      }`}
    >
      <TableCell className="w-12">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded"
        >
          <GripVertical size={20} />
        </div>
      </TableCell>
      <TableCell>
        <img
          src={member.image?.thumb || member.image?.url || member.image}
          alt={member.name}
          className="w-16 h-16 object-cover border-2 border-black rounded-full"
        />
      </TableCell>
      <TableCell className="font-bold">{member.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {Array.isArray(member.role) ? (
            member.role.map((r, index) => (
              <span
                key={index}
                className="bg-ni-neon px-2 py-0.5 text-xs font-bold border border-black"
              >
                {r}
              </span>
            ))
          ) : (
            <span className="bg-ni-neon px-2 py-0.5 text-xs font-bold border border-black">
              {member.role}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {member.socialLinks?.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ni-cyan"
            >
              <Linkedin size={20} />
            </a>
          )}
          {member.socialLinks?.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ni-cyan"
            >
              <Github size={20} />
            </a>
          )}
          {member.socialLinks?.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ni-cyan"
            >
              <Twitter size={20} />
            </a>
          )}
          {member.socialLinks?.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ni-cyan"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleView(member._id)}
            className="p-2"
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleEdit(member)}
            className="p-2"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(member._id)}
            className="p-2"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};

const TeamList = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMemberId, setViewingMemberId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/team");
      // Handle both paginated (data.docs) and non-paginated (data) responses
      const teamData = Array.isArray(data) ? data : data.docs || [];
      setTeam(teamData);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to fetch team members");
      setTeam([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await api.delete(`/team/${id}`);
        toast.success("Team member deleted");
        fetchTeam();
      } catch (error) {
        toast.error("Failed to delete team member");
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setViewingMemberId(id);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchTeam();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTeam((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Prepare payload for API
        const positions = newItems.map((item, index) => ({
          id: item._id,
          position: index,
        }));

        // Call API to update order
        api
          .put("/team/reorder", { positions })
          .then(() => {
            toast.success("Team order updated");
          })
          .catch((err) => {
            console.error("Failed to reorder team:", err);
            toast.error("Failed to reorder team");
            // Revert changes if API fails (optional, but good UX)
            fetchTeam();
          });

        return newItems;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={20} /> Add Member
        </Button>
      </div>

      {loading ? (
        <Table
          headers={["Order", "Image", "Name", "Role", "Socials", "Actions"]}
        >
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-6 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-16 h-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
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
      ) : team.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No team members found</p>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={20} /> Add Your First Team Member
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table
            headers={["Order", "Image", "Name", "Role", "Socials", "Actions"]}
          >
            <SortableContext
              items={team.map((m) => m._id)}
              strategy={verticalListSortingStrategy}
            >
              {team.map((member) => (
                <SortableRow
                  key={member._id}
                  member={member}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </Table>
        </DndContext>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Member" : "Add New Member"}
      >
        <TeamForm member={editingMember} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Member Details"
      >
        {viewingMemberId && (
          <TeamDetails
            memberId={viewingMemberId}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default TeamList;
