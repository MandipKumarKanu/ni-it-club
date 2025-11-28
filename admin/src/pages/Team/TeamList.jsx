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
} from "lucide-react";
import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import TeamForm from "./TeamForm";
import TeamDetails from "./TeamDetails";
import toast from "react-hot-toast";

const TeamList = () => {
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMemberId, setViewingMemberId] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data } = await api.get("/team");
      // Handle both paginated (data.docs) and non-paginated (data) responses
      const teamData = Array.isArray(data) ? data : data.docs || [];
      setTeam(teamData);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to fetch team members");
      setTeam([]); // Set empty array on error
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={20} /> Add Member
        </Button>
      </div>

      {team.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No team members found</p>
          <Button onClick={handleAdd} className="flex items-center gap-2 mx-auto">
            <Plus size={20} /> Add Your First Team Member
          </Button>
        </div>
      ) : (
        <Table headers={["Image", "Name", "Role", "Socials", "Actions"]}>
          {team.map((member) => (
          <TableRow key={member._id}>
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
          </TableRow>
        ))}
      </Table>

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
