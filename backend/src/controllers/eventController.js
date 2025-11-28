const Event = require("../models/Event");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");
const { format } = require("date-fns");

// Helper to generate Google Calendar Link
const generateGoogleCalendarLink = (event) => {
  const { name, details, location, date, timeFrom, timeTo } = event;

  // Parse date and time to ISO format (simplified for this example)
  // Assuming date is a Date object and timeFrom/timeTo are "HH:MM" strings
  const dateStr = format(new Date(date), "yyyyMMdd");
  const startDateTime = `${dateStr}T${timeFrom.replace(":", "")}00`;
  const endDateTime = `${dateStr}T${timeTo.replace(":", "")}00`;

  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: name,
    dates: `${startDateTime}/${endDateTime}`,
    details: details,
    location: location,
    sf: "true",
    output: "xml",
  });

  return `${baseUrl}&${params.toString()}`;
};

// Helper to add thumb URL to event response
const transformEvent = (event) => {
  const e = event.toObject ? event.toObject() : event;
  return {
    ...e,
    image: {
      url: e.image?.url || "",
      public_id: e.image?.public_id || "",
      thumb: e.image?.public_id
        ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,h_400/${e.image.public_id}.jpg`
        : e.image?.url || "",
    },
  };
};

// Helper to parse array fields
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// Helper to parse boolean
const parseBool = (val) => {
  if (typeof val === "boolean") return val;
  if (val === "true" || val === "1") return true;
  if (val === "false" || val === "0") return false;
  return false;
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const {
      status,
      category,
      featured,
      upcoming,
      page = 1,
      limit = 9,
      search,
    } = req.query;
    const filter = {};

    // By default for public, only show non-draft events
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "draft" };
    }

    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ["upcoming", "ongoing"] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { details: { $regex: search, $options: "i" } },
        { shortDetails: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalDocs = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ isFeatured: -1, date: 1 })
      .skip(skip)
      .limit(limitNum)
      .populate("organizer", "name email");

    const totalPages = Math.ceil(totalDocs / limitNum);

    res.json({
      docs: events.map(transformEvent),
      totalDocs,
      limit: limitNum,
      totalPages,
      page: pageNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events for admin (including drafts)
// @route   GET /api/events/admin/all
// @access  Private/Admin
const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find({})
      .sort({ date: -1 })
      .populate("organizer", "name email");
    res.json(events.map(transformEvent));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (event) {
      res.json(transformEvent(event));
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      date,
      endDate,
      timeFrom,
      timeTo,
      details,
      shortDetails,
      location,
      isRegisterable,
      registrationLink,
      capacity,
      tags,
      speakers,
      isFeatured,
      status,
    } = req.body;

    let image = { url: "", public_id: "" };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const event = new Event({
      name,
      category,
      date,
      endDate: endDate || null,
      timeFrom,
      timeTo,
      details,
      shortDetails,
      location,
      isRegisterable: parseBool(isRegisterable),
      registrationLink: registrationLink || "",
      capacity: capacity ? parseInt(capacity) : 0,
      tags: parseArrayField(tags),
      speakers: parseArrayField(speakers),
      isFeatured: parseBool(isFeatured),
      status: status || "upcoming",
      image,
      organizer: req.user._id,
    });

    event.addToCalendarLink = generateGoogleCalendarLink(event);

    const createdEvent = await event.save();
    res.status(201).json(transformEvent(createdEvent));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      date,
      endDate,
      timeFrom,
      timeTo,
      details,
      shortDetails,
      location,
      isRegisterable,
      registrationLink,
      capacity,
      registeredCount,
      tags,
      speakers,
      isFeatured,
      status,
    } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      event.name = name || event.name;
      event.category = category || event.category;
      event.date = date || event.date;
      event.endDate = endDate !== undefined ? endDate : event.endDate;
      event.timeFrom = timeFrom || event.timeFrom;
      event.timeTo = timeTo || event.timeTo;
      event.details = details || event.details;
      event.shortDetails = shortDetails || event.shortDetails;
      event.location = location || event.location;

      if (isRegisterable !== undefined) {
        event.isRegisterable = parseBool(isRegisterable);
      }
      if (registrationLink !== undefined) {
        event.registrationLink = registrationLink;
      }
      if (capacity !== undefined) {
        event.capacity = parseInt(capacity);
      }
      if (registeredCount !== undefined) {
        event.registeredCount = parseInt(registeredCount);
      }
      if (tags !== undefined) {
        event.tags = parseArrayField(tags);
      }
      if (speakers !== undefined) {
        event.speakers = parseArrayField(speakers);
      }
      if (isFeatured !== undefined) {
        event.isFeatured = parseBool(isFeatured);
      }
      if (status) {
        event.status = status;
      }

      if (req.file) {
        // Delete old image from Cloudinary if exists
        if (event.image?.public_id) {
          deleteFromCloudinary(event.image.public_id);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        event.image = { url: result.secure_url, public_id: result.public_id };
      }

      event.addToCalendarLink = generateGoogleCalendarLink(event);

      const updatedEvent = await event.save();
      res.json(transformEvent(updatedEvent));
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Toggle event featured status
// @route   PATCH /api/events/:id/featured
// @access  Private/Admin
const toggleEventFeatured = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      event.isFeatured = !event.isFeatured;
      const updatedEvent = await event.save();
      res.json(transformEvent(updatedEvent));
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update event status
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
      event.status = status;
      const updatedEvent = await event.save();
      res.json(transformEvent(updatedEvent));
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Delete image from Cloudinary if exists
      if (event.image?.public_id) {
        deleteFromCloudinary(event.image.public_id);
      }

      await event.deleteOne();
      res.json({ message: "Event removed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Private/Admin
const getEventStats = async (req, res) => {
  try {
    const total = await Event.countDocuments();
    const upcoming = await Event.countDocuments({
      status: { $in: ["upcoming", "ongoing"] },
      date: { $gte: new Date() },
    });
    const completed = await Event.countDocuments({ status: "completed" });

    const byCategory = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const byStatus = await Event.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      upcoming,
      completed,
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
  getEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  toggleEventFeatured,
  updateEventStatus,
  deleteEvent,
  getEventStats,
};
