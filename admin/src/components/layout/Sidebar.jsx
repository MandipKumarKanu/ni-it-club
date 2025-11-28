import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Image,
  Briefcase,
  Users,
  LogOut,
  Mail,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import clsx from "clsx";

const Sidebar = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("niit_admin_user");
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/events", icon: Calendar, label: "Events" },
    { to: "/gallery", icon: Image, label: "Gallery" },
    { to: "/projects", icon: Briefcase, label: "Projects" },
    { to: "/team", icon: Users, label: "Team" },
    { to: "/contact", icon: Mail, label: "Messages" },
    { to: "/settings", icon: SettingsIcon, label: "App Settings" },
  ];

  return (
    <aside className="w-64 bg-ni-black text-white flex flex-col h-screen fixed left-0 top-0 border-r-4 border-black z-10">
      <div className="p-6 border-b-4 border-white">
        <h1 className="text-2xl font-bold text-ni-neon">NI-IT ADMIN</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 font-bold transition-all border-2 border-transparent",
                isActive
                  ? "bg-ni-neon text-black border-black shadow-[4px_4px_0px_0px_#fff]"
                  : "hover:bg-gray-800 hover:border-gray-600"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t-4 border-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full font-bold text-red-400 hover:bg-gray-800 transition-all border-2 border-transparent hover:border-red-400"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
