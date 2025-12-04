import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Save,
  RefreshCw,
  Upload,
  Globe,
  Tag,
  Phone,
  Share2,
  BarChart3,
  Layout,
  // Info,
  Info,
  Plus,
  Lock,
} from "lucide-react";
import ChangePassword from "../Auth/ChangePassword";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import DeleteConfirmationModal from "../../components/ui/DeleteConfirmationModal";
import toast from "react-hot-toast";

const Settings = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    isActive: true,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      setSettings(data);
      reset(data);
      if (data.logo?.url) {
        setLogoPreview(data.logo.url);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      const excludeFields = [
        "logo",
        "favicon",
        "features",
        "seo",
        "socialLinks",
        "heroButton1",
        "heroButton2",
        "_id",
        "__v",
        "createdAt",
        "updatedAt",
      ];

      Object.keys(data).forEach((key) => {
        if (excludeFields.includes(key)) {
          return;
        }

        if (key === "stats") {
          if (data.stats && typeof data.stats === "object") {
            Object.keys(data.stats).forEach((statKey) => {
              if (statKey === "_id" || statKey === "__v") {
                return;
              }
              if (
                data.stats[statKey] !== undefined &&
                data.stats[statKey] !== null &&
                data.stats[statKey] !== ""
              ) {
                formData.append(`stats[${statKey}]`, data.stats[statKey]);
              }
            });
          }
        } else if (
          data[key] !== undefined &&
          data[key] !== null &&
          data[key] !== ""
        ) {
          formData.append(key, data[key]);
        }
      });

      // Handle hero buttons as nested FormData fields
      if (data.heroButton1) {
        formData.append("heroButton1[name]", data.heroButton1.name || "");
        formData.append("heroButton1[link]", data.heroButton1.link || "");
      }
      if (data.heroButton2) {
        formData.append("heroButton2[name]", data.heroButton2.name || "");
        formData.append("heroButton2[link]", data.heroButton2.link || "");
      }

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await api.put("/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Settings updated successfully");
      setLogoFile(null);
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculateStats = async () => {
    try {
      await api.post("/settings/stats/recalculate");
      toast.success("Stats recalculated successfully");
      fetchSettings();
    } catch (error) {
      toast.error("Failed to recalculate stats");
    }
  };

  const handleAddSocialLink = async () => {
    if (!newLink.platform || !newLink.url) {
      toast.error("Please select a platform and enter a URL");
      return;
    }
    try {
      await api.post("/settings/social-links", newLink);
      toast.success("Social link added successfully");
      setNewLink({ platform: "", url: "", isActive: true });
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add social link");
    }
  };

  const handleToggleActive = async (linkId, currentStatus) => {
    try {
      await api.put(`/settings/social-links/${linkId}`, {
        isActive: !currentStatus,
      });
      toast.success("Social link updated");
      fetchSettings();
    } catch (error) {
      toast.error("Failed to update social link");
    }
  };

  const handleDeleteClick = (linkId) => {
    setLinkToDelete(linkId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await api.delete(`/settings/social-links/${linkToDelete}`);
      toast.success("Social link deleted");
      fetchSettings();
    } catch (error) {
      toast.error("Failed to delete social link");
    } finally {
      setLinkToDelete(null);
    }
  };

  if (!settings)
    return (
      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <Card>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        </div>
        <div className="flex-1">
          <Card>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );

  const tabs = [
    { id: "general", label: "General (SEO)", icon: Globe },
    { id: "branding", label: "Branding", icon: Tag },
    { id: "hero", label: "Hero Section", icon: Layout },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "stats", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <Card className="sticky top-6">
          <h2 className="text-xl font-bold mb-4 pb-3 border-b-2 border-black">
            App Settings
          </h2>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left font-bold transition-all border-2 ${
                    activeTab === tab.id
                      ? "bg-ni-neon border-black shadow-[2px_2px_0px_0px_#000]"
                      : "border-transparent hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t-2 border-black">
            <Button
              onClick={handleRecalculateStats}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw size={14} /> Recalculate Stats
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <Card title="General Settings">
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  {...register("siteName", {
                    required: "Site name is required",
                  })}
                  error={errors.siteName}
                />
                <Input
                  label="Site Tagline"
                  {...register("siteTagline")}
                  error={errors.siteTagline}
                />
                <Input
                  label="Website URL"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  {...register("website")}
                  error={errors.website}
                />
                <div>
                  <label className="font-bold text-sm block mb-1">
                    Site Description
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                    rows="4"
                    {...register("siteDescription")}
                  ></textarea>
                </div>
              </div>
            </Card>
          )}

          {/* Branding */}
          {activeTab === "branding" && (
            <Card title="Branding">
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-sm block mb-2">
                    Site Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview && (
                      <div className="border-2 border-black p-3 bg-white">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-ni-neon border-2 border-black font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all">
                        <Upload size={16} />
                        {logoFile
                          ? "Change Logo"
                          : logoPreview
                          ? "Update Logo"
                          : "Upload Logo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                      {logoFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {logoFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 border-l-4 border-ni-neon">
                  Upload your site logo. Recommended size: 200x60px (PNG format
                  with transparent background works best)
                </p>
              </div>
            </Card>
          )}

          {/* Hero Section */}
          {activeTab === "hero" && (
            <Card title="Hero Section">
              <div className="space-y-4">
                <Input
                  label="Hero Title Part 1"
                  placeholder="e.g., Welcome to"
                  {...register("heroTitle1")}
                  error={errors.heroTitle1}
                />
                <Input
                  label="Hero Title Part 2"
                  placeholder="e.g., NI-IT Club"
                  {...register("heroTitle2")}
                  error={errors.heroTitle2}
                />
                <Input
                  label="Hero Subtitle"
                  placeholder="e.g., Where Innovation Meets Technology"
                  {...register("heroSubtitle")}
                  error={errors.heroSubtitle}
                />
                <p className="text-sm text-gray-600 p-3 bg-gray-50 border-l-4 border-ni-neon">
                  The hero title is split into two parts for better styling.
                  Part 1 appears first, followed by Part 2.
                </p>

                {/* Hero Buttons */}
                <div className="border-t-2 border-black pt-4 mt-4">
                  <h3 className="font-bold text-lg mb-4">Hero Buttons</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure the two action buttons in the hero section. Leave empty to hide a button.
                  </p>

                  {/* Button 1 */}
                  <div className="p-4 border-2 border-black bg-gray-50 mb-4">
                    <h4 className="font-bold mb-3">Primary Button (with arrow)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Button Name"
                        placeholder="e.g., Join Us Today"
                        {...register("heroButton1.name")}
                      />
                      <Input
                        label="Button Link"
                        placeholder="e.g., /contact-us"
                        {...register("heroButton1.link")}
                      />
                    </div>
                  </div>

                  {/* Button 2 */}
                  <div className="p-4 border-2 border-black bg-gray-50">
                    <h4 className="font-bold mb-3">Secondary Button (outline)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Button Name"
                        placeholder="e.g., View Events"
                        {...register("heroButton2.name")}
                      />
                      <Input
                        label="Button Link"
                        placeholder="e.g., /events"
                        {...register("heroButton2.link")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* About Section */}
          {activeTab === "about" && (
            <Card title="About Section">
              <div className="space-y-4">
                <Input
                  label="About Title"
                  placeholder="e.g., About Us"
                  {...register("aboutTitle")}
                  error={errors.aboutTitle}
                />
                <div>
                  <label className="font-bold text-sm block mb-1">
                    About Description Paragraph 1
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                    rows="4"
                    placeholder="First paragraph..."
                    {...register("aboutDescription")}
                  ></textarea>
                </div>
                <div>
                  <label className="font-bold text-sm block mb-1">
                    About Description Paragraph 2
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                    rows="4"
                    placeholder="Second paragraph..."
                    {...register("aboutDescription2")}
                  ></textarea>
                </div>
              </div>
            </Card>
          )}

          {/* Contact Information */}
          {activeTab === "contact" && (
            <Card title="Contact Information">
              <div className="space-y-4">
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="contact@example.com"
                  {...register("contactEmail")}
                  error={errors.contactEmail}
                />
                <Input
                  label="Contact Phone"
                  placeholder="+1 234 567 890"
                  {...register("contactPhone")}
                  error={errors.contactPhone}
                />
                <div>
                  <label className="font-bold text-sm block mb-1">
                    Address
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                    rows="3"
                    placeholder="Your organization address"
                    {...register("address")}
                  ></textarea>
                </div>
              </div>
            </Card>
          )}

          {/* Social Links */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <Card title="Add Social Link">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="font-bold text-sm block mb-1">
                      Platform
                    </label>
                    <select
                      className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                      value={newLink.platform}
                      onChange={(e) =>
                        setNewLink({ ...newLink, platform: e.target.value })
                      }
                    >
                      <option value="">Select Platform</option>
                      {[
                        "facebook",
                        "instagram",
                        "twitter",
                        "linkedin",
                        "github",
                        "youtube",
                        "discord",
                        "telegram",
                        "whatsapp",
                        "website",
                      ].map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-1">URL</label>
                    <input
                      type="url"
                      className="w-full p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                      placeholder="https://..."
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="flex items-center gap-2"
                    disabled={!newLink.platform || !newLink.url}
                  >
                    <Plus size={16} /> Add Link
                  </Button>
                </div>
              </Card>

              {/* Existing Links */}
              <Card title="Current Social Links">
                {settings.socialLinks && settings.socialLinks.length > 0 ? (
                  <div className="space-y-3">
                    {settings.socialLinks.map((link) => (
                      <div
                        key={link._id}
                        className="flex items-center justify-between p-3 border-2 border-black bg-white"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="px-3 py-1 bg-ni-neon text-xs font-bold border border-black uppercase">
                            {link.platform}
                          </span>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate flex-1"
                          >
                            {link.url}
                          </a>
                          <span
                            className={`px-2 py-1 text-xs font-bold border border-black ${
                              link.isActive ? "bg-green-200" : "bg-gray-200"
                            }`}
                          >
                            {link.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleActive(link._id, link.isActive)
                            }
                            className="px-3 py-1 text-xs font-bold border-2 border-black hover:bg-ni-cyan hover:text-white transition-all"
                          >
                            {link.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(link._id)}
                            className="px-3 py-1 text-xs font-bold border-2 border-black bg-red-500 text-white hover:bg-red-600 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-gray-300 text-center text-gray-500">
                    No social links added yet. Use the form above to add your
                    first social link.
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Statistics */}
          {activeTab === "stats" && (
            <Card title="Statistics (Manual Override)">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    label="Members Count"
                    type="number"
                    {...register("stats.membersCount")}
                  />
                  <Input
                    label="Projects Count"
                    type="number"
                    {...register("stats.projectsCount")}
                  />
                  <Input
                    label="Events Count"
                    type="number"
                    {...register("stats.eventsCount")}
                  />
                  <Input
                    label="Partners Count"
                    type="number"
                    {...register("stats.partnersCount")}
                  />
                  <Input
                    label="Workshops Count"
                    type="number"
                    {...register("stats.workshopsCount")}
                  />
                  <Input
                    label="Years Active"
                    type="number"
                    {...register("stats.yearsActive")}
                  />
                </div>
                <p className="text-sm text-gray-600 p-3 bg-ni-neon border-l-4 border-black">
                  <strong>Tip:</strong> These stats can be manually set here or
                  auto-calculated using the "Recalculate Stats" button in the
                  sidebar.
                </p>
              </div>
            </Card>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <Card title="Security">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Update your password to keep your account secure.
                </p>
                <ChangePassword embedded={true} />
              </div>
            </Card>
          )}

          {/* Save Button */}
          {activeTab !== "social" && activeTab !== "security" && (
            <div className="sticky bottom-6 bg-white border-2 border-black p-4 shadow-brutal">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Save size={20} />
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </form>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="Social Link"
      />
    </div>
  );
};

export default Settings;
