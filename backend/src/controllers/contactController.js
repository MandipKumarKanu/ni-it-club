const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// @desc    Send contact email and save to DB
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message, category } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      category: category || "general",
      status: "new",
    });

    // Send email notification
    const emailContent = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Category:</strong> ${category || "general"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><small>Contact ID: ${contact._id}</small></p>
    `;

    await sendEmail({
      email: process.env.CONTACT_EMAIL || process.env.BREVO_SMTP_USER,
      subject: `[${(category || "general").toUpperCase()}] Contact Form: ${subject}`,
      html: emailContent,
      message: `Name: ${name}\nEmail: ${email}\nCategory: ${category}\nSubject: ${subject}\nMessage: ${message}`,
    });

    res.status(201).json({ 
      success: true, 
      message: "Message sent successfully",
      contactId: contact._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send message" });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("repliedBy", "name email");

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contact submission by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("repliedBy", "name email");

    if (contact) {
      // Mark as read if new
      if (contact.status === "new") {
        contact.status = "read";
        await contact.save();
      }
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact submission not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact submission (status, notes)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContact = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      if (status) contact.status = status;
      if (notes !== undefined) contact.notes = notes;

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Contact submission not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reply to contact submission
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
const replyToContact = async (req, res) => {
  try {
    const { replyMessage, replySubject } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    if (!replyMessage) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    // Send reply email
    const emailContent = `
      <h3>Response from NI IT Club</h3>
      <p>Dear ${contact.name},</p>
      <p>${replyMessage}</p>
      <hr>
      <p><small>This is in response to your message: "${contact.subject}"</small></p>
    `;

    await sendEmail({
      email: contact.email,
      subject: replySubject || `Re: ${contact.subject}`,
      html: emailContent,
      message: replyMessage,
    });

    // Update contact status
    contact.status = "replied";
    contact.repliedAt = new Date();
    contact.repliedBy = req.user._id;
    await contact.save();

    res.json({ 
      success: true, 
      message: "Reply sent successfully",
      contact 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send reply" });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: "Contact submission removed" });
    } else {
      res.status(404).json({ message: "Contact submission not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contact stats for dashboard
// @route   GET /api/contact/stats
// @access  Private/Admin
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Contact.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: "new" });

    res.json({
      total,
      new: newCount,
      byStatus: stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byCategory: categoryStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  sendContactEmail,
  getContacts,
  getContactById,
  updateContact,
  replyToContact,
  deleteContact,
  getContactStats,
};
