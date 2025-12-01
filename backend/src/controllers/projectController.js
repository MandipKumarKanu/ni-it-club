const Project = require("../models/Project");
const { uploadToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary } = require("../utils/cloudinaryUpload");

const transformProject = (project) => {
  const p = project.toObject ? project.toObject() : project;
  return {
    ...p,
    image: {
      url: p.image?.url || "",
      public_id: p.image?.public_id || "",
      thumb: p.image?.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,h_400/${p.image.public_id}.jpg`
        : p.image?.url || "",
    },
    screenshots: (p.screenshots || []).map((ss) => ({
      _id: ss._id,
      url: ss.url,
      public_id: ss.public_id,
      caption: ss.caption || "",
      thumb: ss.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_400,h_300/${ss.public_id}.jpg`
        : ss.url,
    })),
  };
};

const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const parseBool = (val) => {
  if (typeof val === "boolean") return val;
  if (val === "true" || val === "1") return true;
  if (val === "false" || val === "0") return false;
  return false;
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { status, category, featured } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ["active", "completed"] };
    }
    
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;

    const projects = await Project.find(filter)
      .sort({ isFeatured: -1, position: 1, createdAt: -1 });
    res.json(projects.map(transformProject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for admin (including drafts)
// @route   GET /api/projects/admin/all
// @access  Private/Admin
const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find({})
      .sort({ position: 1, createdAt: -1 });
    res.json(projects.map(transformProject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(transformProject(project));
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { 
      name, shortDescription, details, techstack, link, github, 
      contributors, category, tags, isFeatured, status, startDate, completedDate, position 
    } = req.body;

    let image = { url: "", public_id: "" };
    if (req.files && req.files.image) {
      const result = await uploadToCloudinary(req.files.image[0].buffer);
      image = { url: result.secure_url, public_id: result.public_id };
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = { url: result.secure_url, public_id: result.public_id };
    }

    let screenshotsArr = [];
    if (req.files && req.files.screenshots) {
      const uploadPromises = req.files.screenshots.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      const results = await Promise.all(uploadPromises);
      screenshotsArr = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
        caption: "",
      }));
    }

    const project = new Project({
      name,
      shortDescription: shortDescription || "",
      details,
      techstack: parseArrayField(techstack),
      link,
      github,
      image,
      screenshots: screenshotsArr,
      contributors: parseArrayField(contributors),
      category: category || "Web",
      tags: parseArrayField(tags),
      isFeatured: parseBool(isFeatured),
      status: status || "active",
      startDate: startDate || null,
      completedDate: completedDate || null,
      position: position ? parseInt(position) : 0,
    });

    const createdProject = await project.save();
    res.status(201).json(transformProject(createdProject));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { 
      name, shortDescription, details, techstack, link, github, 
      contributors, category, tags, isFeatured, status, startDate, completedDate, position 
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.shortDescription = shortDescription !== undefined ? shortDescription : project.shortDescription;
      project.details = details || project.details;
      project.link = link !== undefined ? link : project.link;
      project.github = github || project.github;
      project.category = category || project.category;
      project.startDate = startDate !== undefined ? startDate : project.startDate;
      project.completedDate = completedDate !== undefined ? completedDate : project.completedDate;
      project.position = position !== undefined ? parseInt(position) : project.position;

      if (techstack !== undefined) {
        project.techstack = parseArrayField(techstack);
      }
      if (contributors !== undefined) {
        project.contributors = parseArrayField(contributors);
      }
      if (tags !== undefined) {
        project.tags = parseArrayField(tags);
      }
      if (isFeatured !== undefined) {
        project.isFeatured = parseBool(isFeatured);
      }
      if (status) {
        project.status = status;
      }

      if (req.files && req.files.image) {
        if (project.image?.public_id) {
          deleteFromCloudinary(project.image.public_id);
        }
        const result = await uploadToCloudinary(req.files.image[0].buffer);
        project.image = { url: result.secure_url, public_id: result.public_id };
      } else if (req.file) {
        if (project.image?.public_id) {
          deleteFromCloudinary(project.image.public_id);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        project.image = { url: result.secure_url, public_id: result.public_id };
      }

      if (req.files && req.files.screenshots) {
        const uploadPromises = req.files.screenshots.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const results = await Promise.all(uploadPromises);
        const newScreenshots = results.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
          caption: "",
        }));
        project.screenshots = [...project.screenshots, ...newScreenshots];
      }

      const updatedProject = await project.save();
      res.json(transformProject(updatedProject));
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/featured
// @access  Private/Admin
const toggleProjectFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.isFeatured = !project.isFeatured;
      const updatedProject = await project.save();
      res.json(transformProject(updatedProject));
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private/Admin
const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.status = status;
      const updatedProject = await project.save();
      res.json(transformProject(updatedProject));
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a screenshot from project
// @route   DELETE /api/projects/:id/screenshots/:screenshotId
// @access  Private/Admin
const deleteProjectScreenshot = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const ssIndex = project.screenshots.findIndex(
      (ss) => ss._id.toString() === req.params.screenshotId
    );

    if (ssIndex === -1) {
      return res.status(404).json({ message: "Screenshot not found" });
    }

    const screenshot = project.screenshots[ssIndex];
    if (screenshot.public_id) {
      await deleteFromCloudinary(screenshot.public_id);
    }

    project.screenshots.splice(ssIndex, 1);
    await project.save();

    res.json({ message: "Screenshot removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Collect all public_ids for deletion
      const publicIds = [];
      if (project.image?.public_id) {
        publicIds.push(project.image.public_id);
      }
      project.screenshots.forEach((ss) => {
        if (ss.public_id) publicIds.push(ss.public_id);
      });

      if (publicIds.length > 0) {
        deleteMultipleFromCloudinary(publicIds);
      }

      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private/Admin
const getProjectStats = async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const active = await Project.countDocuments({ status: "active" });
    const completed = await Project.countDocuments({ status: "completed" });
    const featured = await Project.countDocuments({ isFeatured: true });

    const byCategory = await Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const byStatus = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      active,
      completed,
      featured,
      byCategory: byCategory.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  toggleProjectFeatured,
  updateProjectStatus,
  deleteProjectScreenshot,
  deleteProject,
  getProjectStats,
};
