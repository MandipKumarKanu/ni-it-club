import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Github, ExternalLink, Eye } from "lucide-react";
import api from "../../services/api";
import Table, { TableRow, TableCell } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ProjectForm from "./ProjectForm";
import ProjectDetails from "./ProjectDetails";
import toast from "react-hot-toast";

import Loader from "../../components/ui/Loader";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProjectId, setViewingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      // Handle both paginated (data.docs) and non-paginated (data) responses
      const projectsData = Array.isArray(data) ? data : data.docs || [];
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to fetch projects");
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success("Project deleted");
        fetchProjects();
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    setViewingProjectId(id);
    setIsViewModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={20} /> Add Project
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No projects found</p>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={20} /> Add Your First Project
          </Button>
        </div>
      ) : (
        <Table headers={["Image", "Name", "Tech Stack", "Links", "Actions"]}>
          {projects.map((project) => (
            <TableRow key={project._id}>
              <TableCell>
                <img
                  src={
                    project.image?.thumb || project.image?.url || project.image
                  }
                  alt={project.name}
                  className="w-16 h-16 object-cover border-2 border-black"
                />
              </TableCell>
              <TableCell className="font-bold">{project.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.techstack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-ni-neon px-2 py-0.5 text-xs font-bold border border-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-ni-cyan"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-ni-cyan"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleView(project._id)}
                    className="p-2"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="p-2"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(project._id)}
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
        title={editingProject ? "Edit Project" : "Add New Project"}
      >
        <ProjectForm project={editingProject} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Project Details"
      >
        {viewingProjectId && (
          <ProjectDetails
            projectId={viewingProjectId}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProjectsList;
