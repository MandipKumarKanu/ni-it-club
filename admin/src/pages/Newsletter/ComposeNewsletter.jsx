import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";

const ComposeNewsletter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    preheader: "",
    content: "",
    category: "all",
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/newsletter/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!formData.subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    setSending(true);
    setError("");
    setSuccess(null);

    try {
      const { data } = await api.post("/newsletter/send", formData);
      setSuccess(data);
      setFormData({
        subject: "",
        preheader: "",
        content: "",
        category: "all",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      all: "All Subscribers",
      events: "Event Updates",
      projects: "Project Updates",
      digest: "Weekly Digest",
      announcements: "Announcements",
    };
    return labels[category] || category;
  };

  const getEstimatedRecipients = () => {
    if (!stats) return 0;
    // For simplicity, return active count
    // In production, you'd calculate based on category preferences
    return stats.active;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/newsletter")}
          className="bg-gray-200 text-black p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black">Compose Newsletter</h1>
          <p className="text-gray-600">
            Create and send newsletters to your subscribers
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border-4 border-green-500 p-4 shadow-brutal">
          <div className="flex items-start gap-3">
            <CheckCircle size={24} className="text-green-600 shrink-0" />
            <div>
              <h3 className="font-black text-green-800">
                Newsletter Sent Successfully!
              </h3>
              <p className="text-green-700 mt-1">{success.message}</p>
              <div className="mt-2 text-sm text-green-600">
                <p>
                  ✓ Sent: {success.results?.sent} | ✗ Failed:{" "}
                  {success.results?.failed}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-4 border-red-500 p-4 shadow-brutal">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600" />
            <p className="font-bold text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-brutal">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <FileText size={24} />
              Newsletter Content
            </h2>

            <div className="space-y-4">
              <Input
                label="Subject Line *"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter email subject..."
              />

              <Input
                label="Preheader (Preview Text)"
                name="preheader"
                value={formData.preheader}
                onChange={handleChange}
                placeholder="Short preview text shown in inbox..."
              />

              <div>
                <label className="block text-sm font-bold mb-1">
                  Target Audience
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">All Subscribers</option>
                  <option value="events">Subscribed to Events</option>
                  <option value="projects">Subscribed to Projects</option>
                  <option value="digest">Subscribed to Digest</option>
                  <option value="announcements">
                    Subscribed to Announcements
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Email Content * (HTML supported)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  placeholder="Write your newsletter content here...

You can use HTML tags for formatting:
<h2>Section Title</h2>
<p>Paragraph text</p>
<ul><li>List item</li></ul>
<a href='https://example.com'>Link</a>
<strong>Bold text</strong>
<em>Italic text</em>"
                  className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 bg-blue-500"
            >
              <Eye size={18} />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !formData.subject || !formData.content}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500"
            >
              <Send size={18} />
              {sending ? "Sending..." : "Send Newsletter"}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipients Info */}
          <div className="bg-white border-4 border-black p-6 shadow-brutal">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <Users size={24} />
              Recipients
            </h2>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div>
                <p className="text-4xl font-black text-green-600">
                  {getEstimatedRecipients()}
                </p>
                <p className="text-gray-600">
                  {getCategoryLabel(formData.category)}
                </p>
                {stats && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 text-sm space-y-1">
                    <p>Total Subscribers: {stats.total}</p>
                    <p>Active: {stats.active}</p>
                    <p>Unsubscribed: {stats.unsubscribed}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-yellow-100 border-4 border-black p-6 shadow-brutal">
            <h3 className="font-black mb-3">💡 Tips for Great Newsletters</h3>
            <ul className="text-sm space-y-2">
              <li>✓ Keep subject lines under 50 characters</li>
              <li>✓ Use preheader to add context</li>
              <li>✓ Include a clear call-to-action</li>
              <li>✓ Personalize when possible</li>
              <li>✓ Test on mobile devices</li>
              <li>✓ Send at optimal times (Tue-Thu, 10am)</li>
            </ul>
          </div>

          {/* Quick Templates */}
          <div className="bg-white border-4 border-black p-6 shadow-brutal">
            <h3 className="font-black mb-3">📝 Quick Templates</h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: "🎉 New Event Announcement!",
                    content: `<h2>Exciting News!</h2>
<p>We're thrilled to announce our upcoming event:</p>

<div style="background-color: #fabb0e; padding: 20px; margin: 20px 0; border: 3px solid #000;">
  <h3 style="margin: 0;">[Event Name]</h3>
  <p style="margin: 10px 0 0 0;">📅 Date: [Date]<br>📍 Location: [Location]<br>⏰ Time: [Time]</p>
</div>

<p>Don't miss out on this amazing opportunity to learn and connect!</p>

<p><a href="[Registration Link]" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px;">Register Now →</a></p>`,
                  }))
                }
                className="w-full text-left px-3 py-2 border-2 border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-bold"
              >
                🎉 Event Announcement
              </button>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: "🚀 New Project Showcase",
                    content: `<h2>Check Out Our Latest Project!</h2>
<p>Our talented members have been hard at work, and we're excited to share their creation:</p>

<div style="background-color: #087fef; color: #fff; padding: 20px; margin: 20px 0; border: 3px solid #000;">
  <h3 style="margin: 0; color: #fff;">[Project Name]</h3>
  <p style="margin: 10px 0 0 0;">[Brief Description]</p>
</div>

<p><strong>Tech Stack:</strong> [Technologies Used]</p>

<p>Want to see more? Check out all our projects on the showcase page!</p>

<p><a href="[Showcase Link]" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px;">View Projects →</a></p>`,
                  }))
                }
                className="w-full text-left px-3 py-2 border-2 border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-bold"
              >
                🚀 Project Showcase
              </button>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: "📰 Weekly Digest from NI-IT Club",
                    content: `<h2>This Week at NI-IT Club</h2>
<p>Here's what happened this week and what's coming up:</p>

<h3>📅 This Week's Highlights</h3>
<ul>
  <li>[Highlight 1]</li>
  <li>[Highlight 2]</li>
  <li>[Highlight 3]</li>
</ul>

<h3>🔮 Coming Up</h3>
<ul>
  <li>[Upcoming Event 1]</li>
  <li>[Upcoming Event 2]</li>
</ul>

<h3>💡 Tech Tip of the Week</h3>
<p>[Share a quick coding tip or resource]</p>

<p>Stay connected and keep innovating!</p>`,
                  }))
                }
                className="w-full text-left px-3 py-2 border-2 border-gray-300 hover:border-black hover:bg-gray-50 transition-colors text-sm font-bold"
              >
                📰 Weekly Digest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white border-4 border-black p-6 shadow-brutal">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Eye size={24} />
            Email Preview
          </h2>
          <div className="border-2 border-gray-300 p-4 bg-gray-50">
            <div className="bg-white border border-gray-200 max-w-2xl mx-auto">
              {/* Email Header Preview */}
              <div className="bg-black text-white p-4 text-center">
                <h1 className="text-2xl font-black text-yellow-400">
                  NI-IT CLUB
                </h1>
              </div>
              {/* Email Content Preview */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">Hey [Subscriber Name]! 👋</p>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content ||
                      "<p>Your content will appear here...</p>",
                  }}
                />
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="font-bold">— The NI-IT Club Team</p>
                </div>
              </div>
              {/* Email Footer Preview */}
              <div className="bg-black text-white p-4 text-center text-sm">
                <p>National Infotech College, Birgunj</p>
                <p className="text-yellow-400 text-xs mt-1">
                  Where Innovation Meets Community 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComposeNewsletter;
