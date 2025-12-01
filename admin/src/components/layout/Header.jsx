import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Key, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("niit_admin_user");
    navigate("/login");
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    navigate("/change-password");
  };

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between md:justify-end px-4 md:px-8 ml-0 md:ml-64 fixed top-0 right-0 left-0 z-30">
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 hover:bg-gray-100 transition-colors border-2 border-black"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-gray-50 p-2 transition-colors group"
        >
          <div className="text-right hidden sm:block">
            <p className="font-bold text-lg">{user?.name || "Admin"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="w-12 h-12 bg-ni-neon border-4 border-black flex items-center justify-center font-black text-2xl">
            {user?.name?.[0] || "A"}
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] z-50">
            {/* User Info in Dropdown (mobile) */}
            <div className="sm:hidden border-b-2 border-black p-4 bg-gray-50">
              <p className="font-bold text-lg">{user?.name || "Admin"}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase font-bold">
                {user?.role || "Admin"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ni-neon transition-all font-bold border-b-2 border-gray-200"
              >
                <Key size={18} />
                Change Password
              </button>
              {/* <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-100 transition-all font-bold text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button> */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
