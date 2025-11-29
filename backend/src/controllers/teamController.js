const TeamMember = require("../models/TeamMember");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

// Helper to add thumb URL to team member response
const transformMember = (member) => {
  const m = member.toObject ? member.toObject() : member;
  return {
    ...m,
    image: {
      url: m.image?.url || "",
      public_id: m.image?.public_id || "",
      thumb: m.image?.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_300/${m.image.public_id}.jpg`
        : m.image?.url || "",
    },
  };
};

// Helper to parse comma-separated string to array
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    return field
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const { status, jobType } = req.query;
    const filter = {};

    // By default, only show active members on public routes
    if (status) {
      filter.status = status;
    }
    if (jobType) {
      filter.jobType = jobType;
    }

    const team = await TeamMember.find(filter).sort({
      position: 1,
      createdAt: 1,
    });
    res.json(team.map(transformMember));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all team members (Admin - includes inactive)
// @route   GET /api/team/admin/all
// @access  Private/Admin
const getAllTeamMembersAdmin = async (req, res) => {
  try {
    const team = await TeamMember.find({}).sort({ position: 1, createdAt: 1 });
    res.json(team.map(transformMember));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (member) {
      res.json(transformMember(member));
    } else {
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new team member
// @route   POST /api/team
// @access  Private/Admin
const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      jobType,
      bio,
      skills,
      specializedIn,
      description,
      email,
      position,
      status,
      linkedin,
      github,
      twitter,
      instagram,
      portfolio,
    } = req.body;

    let image = { url: "", public_id: "" };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const teamMember = new TeamMember({
      name,
      role: parseArrayField(role),
      jobType: jobType || "Other",
      bio: bio || "",
      skills: parseArrayField(skills),
      specializedIn: specializedIn || "",
      description: parseArrayField(description),
      email,
      position: position ? parseInt(position) : 0,
      status: status || "active",
      image,
      socialLinks: {
        linkedin,
        github,
        twitter,
        instagram,
        portfolio,
      },
    });

    const createdMember = await teamMember.save();
    res.status(201).json(transformMember(createdMember));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
const updateTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      jobType,
      bio,
      skills,
      specializedIn,
      description,
      email,
      position,
      status,
      linkedin,
      github,
      twitter,
      instagram,
      portfolio,
    } = req.body;

    const member = await TeamMember.findById(req.params.id);

    if (member) {
      member.name = name || member.name;
      member.jobType = jobType || member.jobType;
      member.bio = bio !== undefined ? bio : member.bio;
      member.email = email !== undefined ? email : member.email;
      member.position =
        position !== undefined ? parseInt(position) : member.position;
      member.status = status || member.status;

      if (role !== undefined) {
        member.role = parseArrayField(role);
      }
      if (skills !== undefined) {
        member.skills = parseArrayField(skills);
      }
      if (specializedIn !== undefined) {
        member.specializedIn = specializedIn;
      }
      if (description !== undefined) {
        member.description = parseArrayField(description);
      }

      // Update social links
      if (linkedin !== undefined) member.socialLinks.linkedin = linkedin;
      if (github !== undefined) member.socialLinks.github = github;
      if (twitter !== undefined) member.socialLinks.twitter = twitter;
      if (instagram !== undefined) member.socialLinks.instagram = instagram;
      if (portfolio !== undefined) member.socialLinks.portfolio = portfolio;

      if (req.file) {
        // Delete old image from Cloudinary if exists
        if (member.image?.public_id) {
          deleteFromCloudinary(member.image.public_id);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        member.image = { url: result.secure_url, public_id: result.public_id };
      }

      const updatedMember = await member.save();
      res.json(transformMember(updatedMember));
    } else {
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update team member positions (bulk reorder)
// @route   PUT /api/team/reorder
// @access  Private/Admin
const reorderTeamMembers = async (req, res) => {
  try {
    const { positions } = req.body; // Array of { id, position }

    if (!Array.isArray(positions)) {
      return res.status(400).json({ message: "Positions array required" });
    }

    const updatePromises = positions.map(({ id, position }) =>
      TeamMember.findByIdAndUpdate(id, { position }, { new: true })
    );

    await Promise.all(updatePromises);

    const team = await TeamMember.find({}).sort({ position: 1 });
    res.json(team.map(transformMember));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (member) {
      // Delete image from Cloudinary if exists
      if (member.image?.public_id) {
        deleteFromCloudinary(member.image.public_id);
      }

      await member.deleteOne();
      res.json({ message: "Team member removed" });
    } else {
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembersAdmin,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  reorderTeamMembers,
  deleteTeamMember,
};
