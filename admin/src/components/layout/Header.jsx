import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const Header = ({ onMenuToggle }) => {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between md:justify-end px-4 md:px-8 ml-0 md:ml-64 fixed top-0 right-0 left-0 z-30">
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-bold text-lg">{user?.name || "Admin"}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="w-10 h-10 bg-ni-neon border-2 border-black rounded-full flex items-center justify-center font-bold text-xl">
          {user?.name?.[0] || "A"}
        </div>
      </div>
    </header>
  );
};

export default Header;
