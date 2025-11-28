import { useAuthStore } from "../../store/useAuthStore";

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-end px-8 ml-64 fixed top-0 right-0 left-0 z-0">
      <div className="flex items-center gap-4">
        <div className="text-right">
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
