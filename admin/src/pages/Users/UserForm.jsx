import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    designation: "Member",
    permissions: {
      events: false,
      gallery: false,
      projects: false,
      team: false,
      contact: false,
      settings: false,
      users: false,
      view_logs: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation || "Member",
          permissions: user.permissions || {
            events: false,
            gallery: false,
            projects: false,
            team: false,
            contact: false,
            settings: false,
            users: false,
            view_logs: false,
          },
        });
      }
    } catch (err) {
      setError("Failed to fetch user details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        await api.put(`/users/${id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit User" : "Add New User"}
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-black shadow-brutal p-6 mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
              required
            />
          </div>
          {!isEditMode && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
                required={!isEditMode}
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
            />
          </div>
        </div>

        <input type="hidden" name="role" value="admin" />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-gray-700 text-sm font-bold">
              Permissions
            </label>
            <button
              type="button"
              onClick={() => {
                const allChecked = Object.values(formData.permissions).every(
                  Boolean
                );
                const newPermissions = {};
                Object.keys(formData.permissions).forEach((key) => {
                  newPermissions[key] = !allChecked;
                });
                setFormData((prev) => ({
                  ...prev,
                  permissions: newPermissions,
                }));
              }}
              className="text-sm text-blue-600 hover:underline font-bold"
            >
              {Object.values(formData.permissions).every(Boolean)
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(formData.permissions).map((perm) => (
              <label
                key={perm}
                className={`flex items-center p-3 border-2 border-black cursor-pointer transition-all ${
                  formData.permissions[perm]
                    ? "bg-ni-neon shadow-[4px_4px_0px_0px_#000]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  name={perm}
                  checked={formData.permissions[perm]}
                  onChange={handlePermissionChange}
                  className="mr-3 h-5 w-5 accent-black"
                />
                <span className="font-bold capitalize">{perm}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white font-bold py-3 px-6 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
